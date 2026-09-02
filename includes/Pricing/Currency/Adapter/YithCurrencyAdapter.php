<?php
/**
 * YITH WooCommerce Multi Currency adapter.
 *
 * @package SPCUS
 */

namespace SPCUS\Pricing\Currency\Adapter;

use SPCUS\Pricing\Currency\CurrencyAdapter;

defined( 'ABSPATH' ) || exit;

/**
 * YITH Multi Currency exposes a convert filter but no inverse, so reversion
 * is derived arithmetically from the probed rate.
 */
final class YithCurrencyAdapter implements CurrencyAdapter {

	use ManualRevert;

	/**
	 * Convert to the active currency.
	 *
	 * @param float $price Base amount.
	 * @return float
	 */
	public function convert( float $price ): float {
		if ( ! $this->active() ) {
			return $price;
		}
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- third-party currency-switcher filter; calling its own hook name is the whole point of this adapter.
		return (float) apply_filters( 'yith_wcmcs_convert_price', $price, '' );
	}

	/**
	 * Revert to base currency.
	 *
	 * @param float $price Active amount.
	 * @return float
	 */
	public function revert( float $price ): float {
		if ( ! $this->active() ) {
			return $price;
		}
		return $this->manual_revert( $price );
	}

	/**
	 * Whether YITH Multi Currency is installed.
	 *
	 * @return bool
	 */
	public function active(): bool {
		return function_exists( 'yith_wcmcs_convert_price' );
	}

	/**
	 * Identifier.
	 *
	 * @return string
	 */
	public function name(): string {
		return 'yith-multi-currency';
	}
}
