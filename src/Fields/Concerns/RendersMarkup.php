<?php
/**
 * Shared markup helpers for field renderers.
 *
 * @package DPO
 */

namespace DPO\Fields\Concerns;

defined( 'ABSPATH' ) || exit;

/**
 * HTML attribute / class building utilities. Centralising this keeps the
 * frontend DOM contract (ARCHITECTURE §8) identical across all 30 types.
 */
trait RendersMarkup {

	/**
	 * Map a width token to a column class.
	 *
	 * @param string $width Width token.
	 * @return string
	 */
	protected function width_class( $width ) {
		$map = array(
			'full'      => 'dpo-cw-full',
			'half'      => 'dpo-cw-half',
			'third'     => 'dpo-cw-third',
			'two-third' => 'dpo-cw-two-third',
			'quarter'   => 'dpo-cw-quarter',
		);
		return isset( $map[ $width ] ) ? $map[ $width ] : 'dpo-cw-full';
	}

	/**
	 * Build an HTML attribute string. Boolean true → bare attribute;
	 * empty string / null / false skipped.
	 *
	 * @param array $attrs Attribute map.
	 * @return string
	 */
	protected function attrs( array $attrs ) {
		$out = '';
		foreach ( $attrs as $key => $value ) {
			if ( null === $value || false === $value || '' === $value ) {
				continue;
			}
			if ( true === $value ) {
				$out .= ' ' . esc_attr( $key );
				continue;
			}
			if ( is_array( $value ) ) {
				$value = wp_json_encode( $value );
			}
			$out .= ' ' . esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
		}
		return $out;
	}

	/**
	 * Join, de-dupe and sanitize class tokens.
	 *
	 * @param array $classes Class tokens.
	 * @return string
	 */
	protected function classes( array $classes ) {
		$clean = array();
		foreach ( $classes as $class ) {
			$class = trim( (string) $class );
			if ( '' !== $class ) {
				$clean[] = $class;
			}
		}
		return implode( ' ', array_unique( $clean ) );
	}
}
