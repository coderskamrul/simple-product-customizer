<?php
/**
 * Custom font management controller.
 *
 * @package DPO
 */

namespace DPO\Rest\Route;

use DPO\Core\Container;
use DPO\Rest\RestServer;
use DPO\Support\Upload;
use WP_REST_Request;

defined( 'ABSPATH' ) || exit;

/**
 * List, upload, delete and rename custom web fonts stored in
 * `dpo_custom_fonts` with files under uploads/dpo_fonts.
 */
final class FontsController {

	const OPTION       = 'dpo_custom_fonts';
	const MAX_SIZE     = 10485760; // 10MB.
	const ALLOWED_EXTS = array( 'woff', 'woff2', 'ttf' );

	/**
	 * Container.
	 *
	 * @var Container
	 */
	private $c;

	/**
	 * Constructor.
	 *
	 * @param Container $c Container.
	 */
	public function __construct( Container $c ) {
		$this->c = $c;
	}

	/**
	 * Route descriptors.
	 *
	 * @param RestServer $s Server.
	 * @return array
	 */
	public function routes( RestServer $s ) {
		return array(
			array(
				'path'       => 'fonts',
				'methods'    => 'GET',
				'permission' => array( $s, 'can_read' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->list_fonts( $r, $s );
				},
			),
			array(
				'path'       => 'font',
				'methods'    => 'POST',
				'permission' => array( $s, 'can_manage' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->upload_font( $r, $s );
				},
			),
			array(
				'path'       => 'font/(?P<id>[\\w-]+)',
				'methods'    => 'DELETE',
				'permission' => array( $s, 'can_manage' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->delete_font( $r, $s );
				},
				'args'       => array(
					'id' => array( 'sanitize_callback' => 'sanitize_text_field' ),
				),
			),
			array(
				'path'       => 'font/(?P<id>[\\w-]+)',
				'methods'    => 'PATCH',
				'permission' => array( $s, 'can_manage' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->update_font( $r, $s );
				},
				'args'       => array(
					'id' => array( 'sanitize_callback' => 'sanitize_text_field' ),
				),
			),
		);
	}

	/**
	 * Stored fonts (always an array).
	 *
	 * @return array
	 */
	private function fonts() {
		$fonts = get_option( self::OPTION, array() );
		return is_array( $fonts ) ? $fonts : array();
	}

	/**
	 * GET fonts.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response
	 */
	private function list_fonts( WP_REST_Request $r, RestServer $s ) {
		return $s->ok( array( 'fonts' => array_values( $this->fonts() ) ) );
	}

	/**
	 * POST font — multipart upload.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function upload_font( WP_REST_Request $r, RestServer $s ) {
		if ( ! $s->verify_nonce( $r ) ) {
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'dynamic-product-options-for-woocommerce' ), 403 );
		}

		$files = $r->get_file_params();
		if ( empty( $files['font_file'] ) || empty( $files['font_file']['name'] ) ) {
			return $s->fail( 'no_file', __( 'No font file provided.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}
		$file = $files['font_file'];

		$title = sanitize_text_field( (string) $r->get_param( 'title' ) );
		if ( '' === $title ) {
			return $s->fail( 'no_title', __( 'Font title is required.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}
		$family = sanitize_text_field( (string) $r->get_param( 'family' ) );
		$family = '' === $family ? $title : $family;

		if ( (int) $file['size'] > self::MAX_SIZE ) {
			return $s->fail( 'too_large', __( 'Font exceeds the 10MB limit.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}

		$ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, self::ALLOWED_EXTS, true ) ) {
			return $s->fail( 'bad_type', __( 'Allowed font types: woff, woff2, ttf.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}

		$dir       = Upload::dir( 'fonts' );
		$safe_name = wp_unique_filename( $dir, sanitize_file_name( $file['name'] ) );
		$target    = $dir . $safe_name;

		$moved = is_uploaded_file( $file['tmp_name'] )
			? @move_uploaded_file( $file['tmp_name'], $target ) // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
			: @copy( $file['tmp_name'], $target ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged

		if ( ! $moved || ! is_file( $target ) ) {
			return $s->fail( 'move_failed', __( 'Could not store the font file.', 'dynamic-product-options-for-woocommerce' ), 500 );
		}

		$entry = array(
			'id'        => uniqid( 'font_' ),
			'title'     => $title,
			'src'       => Upload::url( 'fonts' ) . $safe_name,
			'family'    => $family,
			'file_type' => $ext,
		);

		$fonts   = $this->fonts();
		$fonts[] = $entry;
		update_option( self::OPTION, array_values( $fonts ) );

		return $s->ok( array( 'font' => $entry ) );
	}

	/**
	 * DELETE font/{id}.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function delete_font( WP_REST_Request $r, RestServer $s ) {
		if ( ! $s->verify_nonce( $r ) ) {
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'dynamic-product-options-for-woocommerce' ), 403 );
		}

		$id    = sanitize_text_field( (string) $r->get_param( 'id' ) );
		$fonts = $this->fonts();
		$found = false;

		foreach ( $fonts as $key => $font ) {
			if ( isset( $font['id'] ) && $font['id'] === $id ) {
				$found = true;
				if ( ! empty( $font['src'] ) ) {
					$path = Upload::url_to_path( $font['src'] );
					if ( $path && is_file( $path ) ) {
						wp_delete_file( $path );
					}
				}
				unset( $fonts[ $key ] );
				break;
			}
		}

		if ( ! $found ) {
			return $s->fail( 'not_found', __( 'Font not found.', 'dynamic-product-options-for-woocommerce' ), 404 );
		}

		update_option( self::OPTION, array_values( $fonts ) );
		return $s->ok( array( 'id' => $id ) );
	}

	/**
	 * PATCH font/{id} — rename title/family.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function update_font( WP_REST_Request $r, RestServer $s ) {
		if ( ! $s->verify_nonce( $r ) ) {
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'dynamic-product-options-for-woocommerce' ), 403 );
		}

		$id    = sanitize_text_field( (string) $r->get_param( 'id' ) );
		$fonts = $this->fonts();
		$found = false;

		foreach ( $fonts as $key => $font ) {
			if ( isset( $font['id'] ) && $font['id'] === $id ) {
				$found = true;
				$title = $r->get_param( 'title' );
				if ( null !== $title && '' !== $title ) {
					$fonts[ $key ]['title'] = sanitize_text_field( (string) $title );
				}
				$family = $r->get_param( 'family' );
				if ( null !== $family ) {
					$clean                   = sanitize_text_field( (string) $family );
					$fonts[ $key ]['family'] = '' === $clean ? $fonts[ $key ]['title'] : $clean;
				}
				break;
			}
		}

		if ( ! $found ) {
			return $s->fail( 'not_found', __( 'Font not found.', 'dynamic-product-options-for-woocommerce' ), 404 );
		}

		update_option( self::OPTION, array_values( $fonts ) );
		return $s->ok( array( 'id' => $id ) );
	}
}
