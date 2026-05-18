<?php
/**
 * Public storefront file-upload controller.
 *
 * @package DPO
 */

namespace DPO\Rest\Route;

use DPO\Core\Container;
use DPO\Rest\RestServer;
use WP_REST_Request;

defined( 'ABSPATH' ) || exit;

/**
 * Handles `fileupload` field submissions from the storefront. Public route
 * (no capability) protected by the `dpo_rest` body nonce. Files land in
 * uploads/dpo_uploads/temp and are relocated on order placement elsewhere.
 */
final class UploadController {

	const MAX_SIZE = 26214400; // 25MB.

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
				'path'       => 'upload',
				'methods'    => 'POST',
				'permission' => array( $s, 'public_nonce' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->upload( $r, $s );
				},
			),
		);
	}

	/**
	 * Allowed extension => MIME map (filterable).
	 *
	 * @return array<string,string>
	 */
	private function allowed_mimes() {
		$default = array(
			'png'  => 'image/png',
			'jpg'  => 'image/jpeg',
			'jpeg' => 'image/jpeg',
			'pdf'  => 'application/pdf',
			'csv'  => 'text/csv',
			'doc'  => 'application/msword',
			'txt'  => 'text/plain',
			'svg'  => 'image/svg+xml',
			'heic' => 'image/heic',
		);

		/**
		 * Filter the allowed upload extension => MIME map.
		 *
		 * @param array<string,string> $default Default map.
		 */
		$map = apply_filters( 'dpo_upload_mimes', $default );
		return is_array( $map ) ? $map : $default;
	}

	/**
	 * POST upload.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function upload( WP_REST_Request $r, RestServer $s ) {
		if ( ! $s->verify_nonce( $r ) ) {
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'dynamic-product-options-for-woocommerce' ), 403 );
		}

		$files = $r->get_file_params();
		if ( empty( $files['dpo_file'] ) || empty( $files['dpo_file']['name'] ) ) {
			return $s->fail( 'no_file', __( 'No file provided.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}
		$file = $files['dpo_file'];

		if ( (int) $file['size'] > self::MAX_SIZE ) {
			return $s->fail( 'too_large', __( 'File exceeds the 25MB limit.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}

		$allowed  = $this->allowed_mimes();
		$filetype = wp_check_filetype_and_ext( $file['tmp_name'], $file['name'], $allowed );
		if ( empty( $filetype['ext'] ) || empty( $filetype['type'] ) ) {
			return $s->fail( 'bad_type', __( 'Unsupported file type.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}

		if ( ! function_exists( 'wp_handle_upload' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		add_filter( 'upload_dir', array( $this, 'force_temp_dir' ) );
		add_filter( 'upload_mimes', array( $this, 'inject_mimes' ) );

		$uploaded = wp_handle_upload(
			$file,
			array(
				'test_form' => false,
				'mimes'     => $allowed,
			)
		);

		remove_filter( 'upload_dir', array( $this, 'force_temp_dir' ) );
		remove_filter( 'upload_mimes', array( $this, 'inject_mimes' ) );

		if ( ! is_array( $uploaded ) || isset( $uploaded['error'] ) ) {
			$msg = is_array( $uploaded ) && isset( $uploaded['error'] )
				? $uploaded['error']
				: __( 'Upload failed.', 'dynamic-product-options-for-woocommerce' );
			return $s->fail( 'upload_failed', $msg, 400 );
		}

		return $s->ok(
			array(
				'file' => array(
					'url'  => $uploaded['url'],
					'name' => basename( $uploaded['file'] ),
				),
			)
		);
	}

	/**
	 * Force uploads into uploads/dpo_uploads/temp for this request.
	 *
	 * @param array $upload Upload dir descriptor.
	 * @return array
	 */
	public function force_temp_dir( $upload ) {
		$subdir           = '/dpo_uploads/temp';
		$upload['subdir'] = $subdir;
		$upload['path']   = $upload['basedir'] . $subdir;
		$upload['url']    = $upload['baseurl'] . $subdir;
		if ( ! is_dir( $upload['path'] ) ) {
			wp_mkdir_p( $upload['path'] );
		}
		return $upload;
	}

	/**
	 * Whitelist the plugin's allowed MIME types during the request.
	 *
	 * @param array $mimes Existing mimes.
	 * @return array
	 */
	public function inject_mimes( $mimes ) {
		return array_merge( (array) $mimes, $this->allowed_mimes() );
	}
}
