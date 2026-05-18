<?php
/**
 * Opt-in diagnostic telemetry.
 *
 * @package DPO
 */

namespace DPO\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Strictly opt-in diagnostic ping.
 *
 * IMPORTANT: This class sends NOTHING by default. No data ever leaves the
 * site unless the administrator has explicitly opted in by setting the
 * `dpo_telemetry_optin` option to the integer 1 (captured here via an
 * admin-only, nonce-protected `?dpo_optin=1` link). There is no automatic
 * activation/deactivation ping and no scheduled transmission. send() is a
 * no-op until that opt-in flag is present, fails silently, and is
 * non-blocking so it can never affect page load or be fatal.
 *
 * The endpoint below is a documented placeholder; wire it to a real
 * collector only alongside a clear, user-visible consent flow.
 */
final class Telemetry {

	/**
	 * Placeholder collector endpoint. Replace only with a real consent flow.
	 *
	 * @var string
	 */
	const ENDPOINT = 'https://example.com/telemetry';

	/**
	 * Option flag that gates all transmission. Must be (int) 1.
	 *
	 * @var string
	 */
	const OPTION = 'dpo_telemetry_optin';

	/**
	 * Hook the opt-in capture. Registration alone sends nothing.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_init', array( $this, 'maybe_capture_optin' ) );
	}

	/**
	 * Capture an explicit opt-in (`?dpo_optin=1` + nonce, admins only).
	 *
	 * @return void
	 */
	public function maybe_capture_optin() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! isset( $_GET['dpo_optin'] ) ) {
			return;
		}

		$nonce = isset( $_GET['_dpo_optin_nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_dpo_optin_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'dpo_optin' ) ) {
			return;
		}

		$value = absint( wp_unslash( $_GET['dpo_optin'] ) );
		update_option( self::OPTION, 1 === $value ? 1 : 0 );
	}

	/**
	 * Send a diagnostic ping — only when the user has explicitly opted in.
	 *
	 * Non-blocking, short timeout, never throws/fatals.
	 *
	 * @param string $action Free-form action label (e.g. 'manual_check').
	 * @return void
	 */
	public static function send( string $action ) {
		if ( 1 !== (int) get_option( self::OPTION, 0 ) ) {
			return;
		}

		$payload = array(
			'site_url' => esc_url_raw( home_url() ),
			'plugin'   => 'dynamic-product-options-for-woocommerce',
			'version'  => defined( 'DPO_VERSION' ) ? DPO_VERSION : '',
			'theme'    => get_stylesheet(),
			'action'   => sanitize_text_field( $action ),
		);

		// Best-effort, fire-and-forget; failures are intentionally ignored.
		wp_remote_post(
			self::ENDPOINT,
			array(
				'timeout'     => 15,
				'blocking'    => false,
				'redirection' => 2,
				'headers'     => array( 'Accept' => 'application/json' ),
				'body'        => $payload,
			)
		);
	}
}
