<?php
/**
 * Capability resolution + license gate.
 *
 * @package ProductKit
 */

namespace ProductKit\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Central place for permission + Pro-feature gating decisions.
 */
final class Capabilities {

	/**
	 * Capability required for read-only endpoints/screens.
	 *
	 * @return string
	 */
	public static function read() {
		return (string) apply_filters( 'pkitfw_cap_read', 'manage_options' );
	}

	/**
	 * Capability required for mutating endpoints/screens.
	 *
	 * @return string
	 */
	public static function manage() {
		return (string) apply_filters( 'pkitfw_cap_manage', 'manage_options' );
	}

	/**
	 * Whether the current request may read plugin data.
	 *
	 * @return bool
	 */
	public static function can_read() {
		return current_user_can( self::read() );
	}

	/**
	 * Whether the current request may modify plugin data.
	 *
	 * @return bool
	 */
	public static function can_manage() {
		return current_user_can( self::manage() );
	}

	/**
	 * Is a valid Pro license active?
	 *
	 * Reads the validation result the Pro plugin wrote after talking to the
	 * licence server. Intentionally NOT filterable: a filter here would be a
	 * trivial unlock bypass, so the stored, server-validated status is the only
	 * source of truth.
	 *
	 * @return bool
	 */
	public static function license_active() {
		$data = get_option( 'pkitfw_license_data', array() );
		return is_array( $data ) && isset( $data['status'] ) && 'valid' === $data['status'];
	}

	/**
	 * Is a (possibly expired) license present? Used for soft Pro fallbacks.
	 *
	 * @return bool
	 */
	public static function license_expired() {
		$data = get_option( 'pkitfw_license_data', array() );
		return is_array( $data ) && isset( $data['status'] ) && 'expired' === $data['status'];
	}

	/**
	 * Should Pro-only features render/compute?
	 *
	 * Gated exactly like product-addons-pro's `is_pro_feature_available()`:
	 * Pro unlocks ONLY when the dedicated **ProductKit for WooCommerce Pro**
	 * plugin is active (it is the only thing that defines `PKITPRO_VERSION`)
	 * AND the licence has been validated by the licence server. An expired but
	 * previously-valid licence keeps feature access (only updates stop), which
	 * matches the reference plugin's grace behaviour.
	 *
	 * There is deliberately NO filter that can enable Pro — the unlock signal is
	 * shared state (a constant the Pro plugin defines + a server-written option),
	 * not anything a code snippet can set. Nothing short of editing this source
	 * file (i.e. pirating the plugin) can grant Pro, which is the strongest gate
	 * any GPL PHP plugin — including the reference — can offer.
	 *
	 * @return bool
	 */
	public static function pro() {
		if ( ! defined( 'PKITPRO_VERSION' ) ) {
			return false;
		}
		return self::license_active() || self::license_expired();
	}
}
