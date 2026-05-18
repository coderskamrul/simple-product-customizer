<?php
/**
 * Capability resolution + license gate.
 *
 * @package DPO
 */

namespace DPO\Core;

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
		return (string) apply_filters( 'dpo_cap_read', 'manage_options' );
	}

	/**
	 * Capability required for mutating endpoints/screens.
	 *
	 * @return string
	 */
	public static function manage() {
		return (string) apply_filters( 'dpo_cap_manage', 'manage_options' );
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
	 * @return bool
	 */
	public static function license_active() {
		$data = get_option( 'dpo_license_data', array() );
		$ok   = is_array( $data ) && isset( $data['status'] ) && 'valid' === $data['status'];
		return (bool) apply_filters( 'dpo_license_active', $ok );
	}

	/**
	 * Is a (possibly expired) license present? Used for soft Pro fallbacks.
	 *
	 * @return bool
	 */
	public static function license_expired() {
		$data = get_option( 'dpo_license_data', array() );
		return is_array( $data ) && isset( $data['status'] ) && 'expired' === $data['status'];
	}

	/**
	 * Should Pro-only features render/compute?
	 *
	 * @return bool
	 */
	public static function pro() {
		return (bool) apply_filters( 'dpo_pro_features', self::license_active() );
	}
}
