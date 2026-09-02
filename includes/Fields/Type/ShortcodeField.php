<?php
/**
 * Shortcode embed field.
 *
 * @package SPCUS
 */

namespace SPCUS\Fields\Type;

use SPCUS\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Renders a WordPress shortcode inline. Layout-only: no price.
 */
final class ShortcodeField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'shortcode';
	}

	/**
	 * No pricing.
	 *
	 * @return bool
	 */
	public function priceable() {
		return false;
	}

	/**
	 * Inner markup (unused; render() is overridden).
	 *
	 * @return string
	 */
	protected function inner() {
		return '';
	}

	/**
	 * Custom render without the standard label wrapper.
	 *
	 * @return string
	 */
	public function render() {
		$shortcode = (string) $this->cfg( 'shortcode', '' );
		$html      = '<div ' . $this->wrapper_attrs() . '>';
		$html     .= '<div class="spcus-shortcode">';
		if ( '' !== $shortcode ) {
			$html .= do_shortcode( $shortcode );
		}
		$html .= '</div>';
		$html .= '</div>';
		return $html;
	}
}
