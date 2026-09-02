<?php
/**
 * Field-tree + payload sanitization.
 *
 * @package SPCUS
 */

namespace SPCUS\Data;

use SPCUS\Support\Arr;

defined( 'ABSPATH' ) || exit;

/**
 * Sanitizes the saved field tree. The tree is user-authored config (not
 * end-customer input) but is still scrubbed defensively: text fields are
 * cleaned, a curated set of rich keys allow safe HTML, structure is
 * preserved recursively (including nested section children).
 */
final class Sanitizer {

	/**
	 * Keys whose value may contain limited HTML (post kses).
	 *
	 * @var string[]
	 */
	private static $rich_keys = array( 'html', 'content', 'previewContent', 'popupContent', 'description' );

	/**
	 * Sanitize an ordered field tree.
	 *
	 * @param mixed $fields Decoded fields array.
	 * @return array
	 */
	public static function fields( $fields ) {
		if ( ! is_array( $fields ) ) {
			return array();
		}
		$out = array();
		foreach ( $fields as $node ) {
			if ( is_array( $node ) ) {
				$out[] = self::node( $node );
			}
		}
		return $out;
	}

	/**
	 * Sanitize an object key while PRESERVING its case.
	 *
	 * The field schema is a controlled set of camelCase identifiers
	 * (priceMode, hideLabel, logicEnabled, cssClass, imageId, …). WP's
	 * sanitize_key() lowercases, which would silently rename every
	 * camelCase key and break pricing + most per-field config. We only
	 * strip characters that could not be a legitimate schema key.
	 *
	 * @param string $key Raw key.
	 * @return string
	 */
	private static function clean_key( $key ) {
		return (string) preg_replace( '/[^A-Za-z0-9_]/', '', (string) $key );
	}

	/**
	 * Sanitize a single node and recurse into children.
	 *
	 * @param array $node Field node.
	 * @return array
	 */
	private static function node( array $node ) {
		$clean = array();
		foreach ( $node as $key => $value ) {
			$key = self::clean_key( $key );
			if ( 'children' === $key ) {
				$clean['children'] = self::fields( $value );
				continue;
			}
			$clean[ $key ] = self::value( $key, $value );
		}
		if ( ! isset( $clean['children'] ) ) {
			$clean['children'] = array();
		}
		return $clean;
	}

	/**
	 * Sanitize a leaf value by key.
	 *
	 * @param string $key   Key.
	 * @param mixed  $value Value.
	 * @return mixed
	 */
	private static function value( $key, $value ) {
		if ( is_array( $value ) ) {
			$out = array();
			foreach ( $value as $k => $v ) {
				// Recurse with the child key so nested config keys (e.g.
				// `content`, `html`) are matched against the rich-key list;
				// list items keep the parent key.
				$child_key       = is_int( $k ) ? $key : self::clean_key( $k );
				$out[ is_int( $k ) ? $k : $child_key ] = self::value( $child_key, $v );
			}
			return $out;
		}
		if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
			return $value;
		}
		if ( in_array( $key, self::$rich_keys, true ) ) {
			return wp_kses_post( (string) $value );
		}
		return sanitize_textarea_field( (string) $value );
	}

	/**
	 * Generic REST param scrub (recursive).
	 *
	 * @param mixed $params Params.
	 * @return mixed
	 */
	public static function params( $params ) {
		return Arr::deep_clean( $params );
	}

	/**
	 * Build the "required fields" lookup from a tree (skips logic-gated
	 * fields and recurses sections), used for fast add-to-cart validation.
	 *
	 * @param array $fields Field tree.
	 * @param array $acc    Accumulator.
	 * @return array Map of fieldId => ['type'=>type].
	 */
	public static function required_map( array $fields, array $acc = array() ) {
		foreach ( $fields as $node ) {
			if ( ! is_array( $node ) ) {
				continue;
			}
			$logic = ! empty( $node['logicEnabled'] );
			if ( ! empty( $node['children'] ) && ! $logic ) {
				$acc = self::required_map( $node['children'], $acc );
			}
			if ( ! empty( $node['required'] ) && ! $logic && ! empty( $node['id'] ) ) {
				$acc[ $node['id'] ] = array( 'type' => isset( $node['type'] ) ? $node['type'] : '' );
			}
		}
		return $acc;
	}
}
