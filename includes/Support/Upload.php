<?php
/**
 * Upload directory + file relocation helpers.
 *
 * @package SPCUS
 */

namespace SPCUS\Support;

defined( 'ABSPATH' ) || exit;

/**
 * Manages the plugin's private upload buckets:
 * uploads/spcus_uploads/{temp,order_placed,order_completed} and uploads/spcus_fonts.
 */
final class Upload {

	const BUCKETS = array( 'temp', 'order_placed', 'order_completed' );

	/**
	 * Absolute path for a bucket (creates it on first use).
	 *
	 * @param string $bucket One of self::BUCKETS or 'fonts'.
	 * @return string Trailing-slashed path.
	 */
	public static function dir( $bucket = 'temp' ) {
		$base = wp_upload_dir();
		$sub  = 'fonts' === $bucket ? 'spcus_fonts' : 'spcus_uploads/' . sanitize_file_name( $bucket );
		$path = trailingslashit( $base['basedir'] ) . $sub . '/';
		if ( ! is_dir( $path ) ) {
			wp_mkdir_p( $path );
		}
		return $path;
	}

	/**
	 * Public URL for a bucket.
	 *
	 * @param string $bucket Bucket name.
	 * @return string
	 */
	public static function url( $bucket = 'temp' ) {
		$base = wp_upload_dir();
		$sub  = 'fonts' === $bucket ? 'spcus_fonts' : 'spcus_uploads/' . sanitize_file_name( $bucket );
		return trailingslashit( $base['baseurl'] ) . $sub . '/';
	}

	/**
	 * Move/copy uploaded files between buckets (e.g. temp → order_placed).
	 *
	 * @param array  $files  List of {name,path} entries.
	 * @param string $to     Destination bucket.
	 * @param bool   $delete Delete source after move.
	 * @return array Updated list of {name,path}.
	 */
	public static function relocate( $files, $to = 'order_placed', $delete = true ) {
		$files = is_array( $files ) ? $files : array();
		$dest  = self::dir( $to );
		$out   = array();

		foreach ( $files as $file ) {
			$name = isset( $file['name'] ) ? basename( $file['name'] ) : '';
			$src  = isset( $file['path'] ) ? self::url_to_path( $file['path'] ) : '';
			if ( '' === $name || ! $src || ! is_file( $src ) ) {
				$out[] = $file;
				continue;
			}
			$target = $dest . wp_unique_filename( $dest, $name );
			if ( copy( $src, $target ) ) {
				if ( $delete ) {
					wp_delete_file( $src );
				}
				$out[] = array(
					'name' => $name,
					'path' => self::url( $to ) . basename( $target ),
				);
			} else {
				$out[] = $file;
			}
		}
		return $out;
	}

	/**
	 * Translate an uploads URL back to an absolute path.
	 *
	 * @param string $url URL.
	 * @return string
	 */
	public static function url_to_path( $url ) {
		$base = wp_upload_dir();
		return str_replace( $base['baseurl'], $base['basedir'], (string) $url );
	}
}
