<?php
/**
 * Popup / modal trigger field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

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
		$trigger = (string) $this->prop( 'label', '' );
		if ( '' === $trigger ) {
			$trigger = esc_html__( 'Open', 'dynamic-product-options-for-woocommerce' );
		}
		$content = do_shortcode( (string) $this->cfg( 'content', '' ) );

		$html  = '<div ' . $this->wrapper_attrs() . '>';
		$html .= '<button type="button" class="dpo-popup__trigger" data-popup-for="' . esc_attr( $this->id() ) . '">' . esc_html( $trigger ) . '</button>';
		$html .= '<div class="dpo-popup__modal" id="dpo-popup-' . esc_attr( $this->id() ) . '" hidden role="dialog" aria-modal="true">';
		$html .= '<div class="dpo-popup__backdrop" data-popup-close="1"></div>';
		$html .= '<div class="dpo-popup__box">';
		$html .= '<button type="button" class="dpo-popup__close" data-popup-close="1" aria-label="' . esc_attr__( 'Close', 'dynamic-product-options-for-woocommerce' ) . '">&times;</button>';
		$html .= '<div class="dpo-popup__content">' . wp_kses_post( $content ) . '</div>';
		$html .= '</div>';
		$html .= '</div>';
		$html .= '</div>';
		return $html;
	}
}
