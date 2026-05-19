<?php
/**
 * Linked products field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Core\Capabilities;
use DPO\Fields\AbstractField;
use DPO\Support\Money;

defined( 'ABSPATH' ) || exit;

/**
 * Lets the customer add related WooCommerce products as separate cart
 * lines. Not priced through the calculator (added as real WC lines).
 * Free tier is capped at two linked products.
 */
final class LinkedProductsField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'linkedproducts';
	}

	/**
	 * Priced via separate WC line items, not the options calculator.
	 *
	 * @return bool
	 */
	public function priceable() {
		return false;
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		if ( ! function_exists( 'wc_get_product' ) ) {
			return '';
		}

		$items = $this->cfg( 'products', array() );
		$items = is_array( $items ) ? array_values( $items ) : array();
		if ( ! Capabilities::pro() && count( $items ) > 2 ) {
			$items = array_slice( $items, 0, 2 );
		}
		if ( empty( $items ) ) {
			return '';
		}

		$multiple = ! empty( $this->cfg( 'multiple' ) );
		$input_t  = $multiple ? 'checkbox' : 'radio';
		$name     = 'dpo_lp_' . $this->id() . ( $multiple ? '[]' : '' );

		$html = '<div class="dpo-linked"' . $this->attrs( array( 'data-multiple' => $multiple ? 'yes' : 'no' ) ) . '>';

		foreach ( $items as $item ) {
			$pid  = isset( $item['id'] ) ? (int) $item['id'] : 0;
			$vid  = isset( $item['variation'] ) ? (int) $item['variation'] : 0;
			$lookup  = $vid > 0 ? $vid : $pid;
			$product = $lookup > 0 ? wc_get_product( $lookup ) : false;
			if ( ! $product || ! $product->is_purchasable() ) {
				continue;
			}

			$html .= '<label class="dpo-linked__card">';
			$html .= '<input type="' . esc_attr( $input_t ) . '" class="dpo-linked__native" name="' . esc_attr( $name ) . '" value="' . esc_attr( $lookup ) . '"'
				. $this->attrs(
					array(
						'data-product-id' => $pid,
						'data-variation'  => $vid > 0 ? $vid : '',
					)
				) . ' />';
			$thumb = $product->get_image( 'woocommerce_thumbnail' );
			$html .= '<span class="dpo-linked__thumb">' . $thumb . '</span>';
			$html .= '<span class="dpo-linked__meta">';
			$html .= '<span class="dpo-linked__title">' . esc_html( $product->get_name() ) . '</span>';
			$html .= '<span class="dpo-linked__price">' . wp_kses_post( Money::html( (float) $product->get_price() ) ) . '</span>';
			$html .= '</span>';
			$html .= '</label>';
		}

		$html .= '</div>';
		return $html;
	}

	/**
	 * Summarise selected linked products by title.
	 *
	 * @param mixed $value Selection value.
	 * @return string
	 */
	public function summarize( $value ) {
		if ( ! function_exists( 'wc_get_product' ) ) {
			return parent::summarize( $value );
		}
		$ids   = is_array( $value ) ? $value : array( $value );
		$names = array();
		foreach ( $ids as $id ) {
			if ( is_array( $id ) ) {
				$id = isset( $id['id'] ) ? $id['id'] : 0;
			}
			$product = (int) $id > 0 ? wc_get_product( (int) $id ) : false;
			if ( $product ) {
				$names[] = sanitize_text_field( $product->get_name() );
			}
		}
		return implode( ', ', $names );
	}
}
