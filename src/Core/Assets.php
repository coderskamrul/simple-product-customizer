<?php
/**
 * Build-asset enqueue helper.
 *
 * @package DPO
 */

namespace DPO\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Resolves @wordpress/scripts build output (bundle + generated *.asset.php)
 * so PHP never hard-codes dependency lists or cache-busting versions.
 */
final class Assets {

	/**
	 * Read a generated asset manifest.
	 *
	 * @param string $handle_base Bundle base name (e.g. "admin").
	 * @param array  $fallback_deps Deps to use when manifest is absent.
	 * @return array{deps:array,version:string,exists:bool}
	 */
	public static function manifest( $handle_base, array $fallback_deps = array() ) {
		$asset_file = DPO_PATH . 'assets/build/' . $handle_base . '.asset.php';
		if ( is_readable( $asset_file ) ) {
			$data = include $asset_file;
			return array(
				'deps'    => isset( $data['dependencies'] ) ? $data['dependencies'] : $fallback_deps,
				'version' => isset( $data['version'] ) ? $data['version'] : DPO_VERSION,
				'exists'  => true,
			);
		}
		return array(
			'deps'    => $fallback_deps,
			'version' => DPO_VERSION,
			'exists'  => is_readable( DPO_PATH . 'assets/build/' . $handle_base . '.js' ),
		);
	}

	/**
	 * Enqueue a built script bundle.
	 *
	 * @param string $handle      Script handle.
	 * @param string $base        Bundle base name.
	 * @param array  $fallback    Fallback deps.
	 * @param bool   $in_footer   Footer load.
	 * @return bool Whether the bundle existed and was enqueued.
	 */
	public static function script( $handle, $base, array $fallback = array(), $in_footer = true ) {
		$m = self::manifest( $base, $fallback );
		if ( ! $m['exists'] ) {
			return false;
		}
		wp_enqueue_script( $handle, DPO_ASSETS . $base . '.js', $m['deps'], $m['version'], $in_footer );
		return true;
	}

	/**
	 * Enqueue a built style bundle if present.
	 *
	 * @param string $handle Style handle.
	 * @param string $base   Bundle base name.
	 * @return void
	 */
	public static function style( $handle, $base ) {
		$file = DPO_PATH . 'assets/build/' . $base . '.css';
		if ( is_readable( $file ) ) {
			wp_enqueue_style( $handle, DPO_ASSETS . $base . '.css', array(), DPO_VERSION );
		}
	}
}
