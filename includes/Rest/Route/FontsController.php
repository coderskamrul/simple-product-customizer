<?php
/**
 * Custom font management controller.
 *
 * @package SPCUS
 */

namespace SPCUS\Rest\Route;

use SPCUS\Core\Container;
use SPCUS\Rest\RestServer;
use SPCUS\Support\Upload;
use WP_REST_Request;

defined( 'ABSPATH' ) || exit;

/**
 * List, upload, delete and rename custom web fonts stored in
 * `spcus_custom_fonts` with files under uploads/spcus_fonts.
 */
final class FontsController {

	const OPTION       = 'spcus_custom_fonts';
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
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'simple-product-customizer' ), 403 );
		}

		$files = $r->get_file_params();
		if ( empty( $files['font_file'] ) || empty( $files['font_file']['name'] ) ) {
			return $s->fail( 'no_file', __( 'No font file provided.', 'simple-product-customizer' ), 400 );
		}
		$file = $files['font_file'];

		$title = sanitize_text_field( (string) $r->get_param( 'title' ) );
		if ( '' === $title ) {
			return $s->fail( 'no_title', __( 'Font title is required.', 'simple-product-customizer' ), 400 );
		}
		$family = sanitize_text_field( (string) $r->get_param( 'family' ) );
		$family = '' === $family ? $title : $family;

		if ( (int) $file['size'] > self::MAX_SIZE ) {
			return $s->fail( 'too_large', __( 'Font exceeds the 10MB limit.', 'simple-product-customizer' ), 400 );
		}

		$ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, self::ALLOWED_EXTS, true ) ) {
			return $s->fail( 'bad_type', __( 'Allowed font types: woff, woff2, ttf.', 'simple-product-customizer' ), 400 );
		}

		// Make sure the bucket exists before wp_handle_upload() targets it.
		Upload::dir( 'fonts' );

		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		add_filter( 'upload_dir', array( $this, 'force_fonts_dir' ) );
		add_filter( 'upload_mimes', array( $this, 'inject_font_mimes' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'allow_font_filetype' ), 10, 4 );

		$uploaded = wp_handle_upload(
			$file,
			array(
				'test_form' => false,
				'mimes'     => self::font_mimes(),
			)
		);

		remove_filter( 'wp_check_filetype_and_ext', array( $this, 'allow_font_filetype' ), 10 );
		remove_filter( 'upload_mimes', array( $this, 'inject_font_mimes' ) );
		remove_filter( 'upload_dir', array( $this, 'force_fonts_dir' ) );

		if ( ! is_array( $uploaded ) || isset( $uploaded['error'] ) || empty( $uploaded['file'] ) ) {
			return $s->fail( 'move_failed', __( 'Could not store the font file.', 'simple-product-customizer' ), 500 );
		}

		$entry = array(
			'id'        => uniqid( 'font_' ),
			'title'     => $title,
			'src'       => $uploaded['url'],
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
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'simple-product-customizer' ), 403 );
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
			return $s->fail( 'not_found', __( 'Font not found.', 'simple-product-customizer' ), 404 );
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
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'simple-product-customizer' ), 403 );
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
			return $s->fail( 'not_found', __( 'Font not found.', 'simple-product-customizer' ), 404 );
		}

		update_option( self::OPTION, array_values( $fonts ) );
		return $s->ok( array( 'id' => $id ) );
	}

	/**
	 * Extension => MIME map for the font types this controller accepts.
	 *
	 * @return array<string,string>
	 */
	private static function font_mimes() {
		return array(
			'woff'  => 'font/woff',
			'woff2' => 'font/woff2',
			'ttf'   => 'font/ttf',
		);
	}

	/**
	 * Route wp_handle_upload() into uploads/spcus_fonts for this request.
	 *
	 * @param array $upload Upload dir descriptor.
	 * @return array
	 */
	public function force_fonts_dir( $upload ) {
		$subdir           = '/spcus_fonts';
		$upload['subdir'] = $subdir;
		$upload['path']   = $upload['basedir'] . $subdir;
		$upload['url']    = $upload['baseurl'] . $subdir;
		if ( ! is_dir( $upload['path'] ) ) {
			wp_mkdir_p( $upload['path'] );
		}
		return $upload;
	}

	/**
	 * Whitelist the font MIME types during the request.
	 *
	 * @param array $mimes Existing mimes.
	 * @return array
	 */
	public function inject_font_mimes( $mimes ) {
		return array_merge( (array) $mimes, self::font_mimes() );
	}

	/**
	 * Trust our extension allow-list for fonts.
	 *
	 * libmagic reports web fonts inconsistently (font/sfnt,
	 * application/x-font-ttf, application/octet-stream, ...), so core's
	 * real-MIME comparison would reject otherwise valid files. The extension
	 * has already been checked against self::ALLOWED_EXTS above.
	 *
	 * @param array  $data     ext/type/proper_filename triple.
	 * @param string $file     Temp file path.
	 * @param string $filename Original filename.
	 * @param array  $mimes    Allowed mimes.
	 * @return array
	 */
	public function allow_font_filetype( $data, $file, $filename, $mimes ) {
		unset( $file, $mimes );
		$ext = strtolower( pathinfo( (string) $filename, PATHINFO_EXTENSION ) );
		$map = self::font_mimes();
		if ( isset( $map[ $ext ] ) ) {
			$data['ext']  = $ext;
			$data['type'] = $map[ $ext ];
		}
		return $data;
	}
}
