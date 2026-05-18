<?php
/**
 * Settings store (option `dpo_settings`).
 *
 * @package DPO
 */

namespace DPO\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Typed accessor over the single serialized settings option.
 */
final class Settings {

	const OPTION = 'dpo_settings';

	/**
	 * Default values for every known setting.
	 *
	 * @return array
	 */
	public static function defaults() {
		return array(
			'showPriceLine'       => true,
			'priceLineLabel'      => __( 'Options Price', 'dynamic-product-options-for-woocommerce' ),
			'showTotalLine'       => true,
			'totalLineLabel'      => __( 'Total Price', 'dynamic-product-options-for-woocommerce' ),
			'hideInCart'          => false,
			'hideInCheckout'      => false,
			'shopForceSelect'     => true,
			'shopButtonText'      => __( 'Select Options', 'dynamic-product-options-for-woocommerce' ),
			'uploadTempDays'      => 7,
			'uploadPlacedDays'    => 0,
			'uploadCompletedDays' => 0,
		);
	}

	/**
	 * Full settings array (stored merged over defaults).
	 *
	 * @return array
	 */
	public function all() {
		$stored = get_option( self::OPTION, array() );
		$stored = is_array( $stored ) ? $stored : array();
		return array_merge( self::defaults(), $stored );
	}

	/**
	 * Single setting value.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Fallback.
	 * @return mixed
	 */
	public function get( $key, $default = null ) {
		$all = $this->all();
		if ( array_key_exists( $key, $all ) ) {
			return $all[ $key ];
		}
		return null === $default ? '' : $default;
	}

	/**
	 * Replace the settings option.
	 *
	 * @param array $values New values.
	 * @return void
	 */
	public function save( array $values ) {
		update_option( self::OPTION, array_merge( self::defaults(), $values ) );
	}
}
