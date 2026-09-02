<?php
/**
 * Popup / modal trigger field.
 *
 * @package SPCUS
 */

namespace SPCUS\Fields\Type;

use SPCUS\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * A trigger button that opens a hidden modal containing author content.
 * Layout-only: no price.
 */
final class PopupField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'popup';
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
		// Builder writes the button label to config.triggerText; fall back to
		// the field title, then a sensible default.
		$trigger = (string) $this->cfg( 'triggerText', '' );
		if ( '' === $trigger ) {
			$trigger = (string) $this->prop( 'label', '' );
		}
		if ( '' === $trigger ) {
			$trigger = esc_html__( 'Open', 'simple-product-customizer' );
		}
		$content = do_shortcode( (string) $this->cfg( 'content', '' ) );

		$html  = '<div ' . $this->wrapper_attrs() . '>';
		$html .= '<button type="button" class="spcus-popup__trigger" data-popup-for="' . esc_attr( $this->id() ) . '">' . esc_html( $trigger ) . '</button>';
		$html .= '<div class="spcus-popup__modal" id="spcus-popup-' . esc_attr( $this->id() ) . '" hidden role="dialog" aria-modal="true">';
		$html .= '<div class="spcus-popup__backdrop" data-popup-close="1"></div>';
		$html .= '<div class="spcus-popup__box">';
		$html .= '<button type="button" class="spcus-popup__close" data-popup-close="1" aria-label="' . esc_attr__( 'Close', 'simple-product-customizer' ) . '">&times;</button>';
		$html .= '<div class="spcus-popup__content">' . wp_kses_post( $content ) . '</div>';
		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';
		return $html;
	}
}
