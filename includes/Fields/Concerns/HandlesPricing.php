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
	 * Numeric regular cost (always the regular price).
	 *
	 * @param array $choice Choice node.
	 * @return float
	 */
	protected function choice_regular( array $choice ) {
		return Money::f( isset( $choice['regular'] ) ? $choice['regular'] : '' );
	}

	/**
	 * Numeric sale cost (or null when no sale price is set). The legacy Pro
	 * gate is intentionally not applied here — when a sale price is stored
	 * for a choice it is honoured everywhere it would be otherwise displayed,
	 * matching the builder preview.
	 *
	 * @param array $choice Choice node.
	 * @return float|null
	 */
	protected function choice_sale( array $choice ) {
		$sale = isset( $choice['sale'] ) ? $choice['sale'] : '';
		if ( '' === $sale || null === $sale ) {
			return null;
		}
		return Money::f( $sale );
	}

	/**
	 * Effective numeric cost for a choice — sale takes priority when set.
	 *
	 * @param array $choice Choice node.
	 * @return float
	 */
	protected function choice_cost( array $choice ) {
		$sale = $this->choice_sale( $choice );
		if ( null !== $sale ) {
			return $sale;
		}
		return $this->choice_regular( $choice );
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
	 * Format a single amount for the badge based on the mode.
	 *
	 * @param float  $amount Numeric amount.
	 * @param string $mode   Effective price mode.
	 * @return string Inline HTML (already escaped where needed).
	 */
	private function badge_amount_html( $amount, $mode ) {
		if ( 'percent' === $mode ) {
			$text = rtrim( rtrim( number_format( (float) $amount, 2, '.', '' ), '0' ), '.' ) . '%';
			return esc_html( $text );
		}
		return wp_kses_post( Money::html( $amount ) );
	}

	/**
	 * Badge HTML for a choice, or '' when it has no price. When both a
	 * regular and a (smaller) sale price are set the regular shows struck
	 * through next to the sale — mirroring the builder preview and the
	 * standard WooCommerce sale-price treatment.
	 *
	 * @param array $choice Choice node.
	 * @return string
	 */
	protected function price_badge( array $choice ) {
		$mode = isset( $choice['priceMode'] ) ? $choice['priceMode'] : 'none';
		if ( 'none' === $mode || '' === $mode ) {
			return '';
		}

		// Pro-only modes collapse to flat for non-licensed sites (mirrors the
		// PriceCalculator gate so the badge and the cart line agree).
		$pro_modes = array( 'percent', 'per_unit', 'per_word', 'per_char_nospace' );
		if ( in_array( $mode, $pro_modes, true ) && ! Capabilities::pro() ) {
			$mode = 'flat';
		}

		$regular = $this->choice_regular( $choice );
		$sale    = $this->choice_sale( $choice );

		// Per-mode unit suffix shown after the price.
		$suffix = '';
		if ( 'per_char' === $mode || 'per_char_nospace' === $mode ) {
			$suffix = '/' . esc_html__( 'char', 'dynamic-product-options-for-woocommerce' );
		} elseif ( 'per_word' === $mode ) {
			$suffix = '/' . esc_html__( 'word', 'dynamic-product-options-for-woocommerce' );
		} elseif ( 'per_unit' === $mode ) {
			$suffix = '/' . esc_html__( 'unit', 'dynamic-product-options-for-woocommerce' );
		}

		$show_pair = ( null !== $sale && $sale < $regular );

		if ( $show_pair ) {
			$reg_html  = $this->badge_amount_html( $regular, $mode );
			$sale_html = $this->badge_amount_html( $sale, $mode );

			return '<span class="dpo-price-badge dpo-price-badge--has-sale">'
				. '<del class="dpo-price-badge__regular" aria-hidden="true">' . $reg_html . '</del>'
				. ' <ins class="dpo-price-badge__sale">+' . $sale_html . $suffix . '</ins>'
				. '</span>';
		}

		$amount = ( null !== $sale ) ? $sale : $regular;
		return '<span class="dpo-price-badge">+' . $this->badge_amount_html( $amount, $mode ) . $suffix . '</span>';
	}
}
