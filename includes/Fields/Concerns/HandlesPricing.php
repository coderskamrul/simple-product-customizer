<?php
/**
 * Display-side price badge helpers.
 *
 * @package DPO
 */

namespace DPO\Fields\Concerns;

use DPO\Core\Capabilities;
use DPO\Support\Money;

defined( 'ABSPATH' ) || exit;

/**
 * Produces the small "+$5" / "+15%" badge shown next to choices/labels.
 * This is presentation only — authoritative pricing lives in
 * PriceCalculator. Pro-gated modes degrade exactly like the calculator.
 */
trait HandlesPricing {

	/**
	 * Effective numeric cost for a choice (sale honoured only under Pro).
	 *
	 * @param array $choice Choice node.
	 * @return float
	 */
	protected function choice_cost( array $choice ) {
		$regular = isset( $choice['regular'] ) ? $choice['regular'] : '';
		$sale    = isset( $choice['sale'] ) ? $choice['sale'] : '';
		if ( '' !== $sale && Capabilities::pro() ) {
			return Money::f( $sale );
		}
		return Money::f( $regular );
	}

	/**
	 * Numeric pricing data-* attributes for a choice. The storefront JS
	 * reads these to compute the live price preview.
	 *
	 * @param array $choice Choice node.
	 * @return array
	 */
	protected function choice_price_attrs( array $choice ) {
		return array(
			'data-price-mode' => ( isset( $choice['priceMode'] ) && '' !== $choice['priceMode'] ) ? $choice['priceMode'] : 'none',
			'data-cost'       => isset( $choice['regular'] ) && '' !== $choice['regular'] ? (string) Money::f( $choice['regular'] ) : '',
			'data-cost-sale'  => isset( $choice['sale'] ) && '' !== $choice['sale'] ? (string) Money::f( $choice['sale'] ) : '',
		);
	}

	/**
	 * Badge HTML for a choice, or '' when it has no price.
	 *
	 * @param array $choice Choice node.
	 * @return string
	 */
	protected function price_badge( array $choice ) {
		$mode = isset( $choice['priceMode'] ) ? $choice['priceMode'] : 'none';
		if ( 'none' === $mode || '' === $mode ) {
			return '';
		}

		// Pro-only modes collapse to flat for non-licensed sites.
		$pro_modes = array( 'percent', 'per_unit', 'per_word', 'per_char_nospace' );
		if ( in_array( $mode, $pro_modes, true ) && ! Capabilities::pro() ) {
			$mode = 'flat';
		}

		$cost = $this->choice_cost( $choice );
		if ( 'percent' === $mode ) {
			$text = '+' . rtrim( rtrim( number_format( $cost, 2, '.', '' ), '0' ), '.' ) . '%';
			return '<span class="dpo-price-badge">' . esc_html( $text ) . '</span>';
		}

		$suffix = '';
		if ( 'per_char' === $mode || 'per_char_nospace' === $mode ) {
			$suffix = '/' . esc_html__( 'char', 'dynamic-product-options-for-woocommerce' );
		} elseif ( 'per_word' === $mode ) {
			$suffix = '/' . esc_html__( 'word', 'dynamic-product-options-for-woocommerce' );
		} elseif ( 'per_unit' === $mode ) {
			$suffix = '/' . esc_html__( 'unit', 'dynamic-product-options-for-woocommerce' );
		}

		return '<span class="dpo-price-badge">+' . wp_kses_post( Money::html( $cost ) ) . $suffix . '</span>';
	}
}
