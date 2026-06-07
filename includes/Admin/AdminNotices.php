<?php
/**
 * Minimal, dismissible admin notice.
 *
 * @package ProductKit
 */

namespace ProductKit\Admin;

use ProductKit\Core\Capabilities;

defined( 'ABSPATH' ) || exit;

/**
 * Shows a single, dismissible getting-started / review prompt to
 * non-licensed admins on the plugin screens. Dismissal is persisted
 * for ~90 days via a transient. Everything here is capability-gated
 * and fully escaped.
 */
final class AdminNotices {

	/**
	 * Notice identifier (bump to re-show after copy changes).
	 *
	 * @var string
	 */
	const KEY = 'getting_started_v1';

	/**
	 * Dismissal lifetime (seconds).
	 *
	 * @var int
	 */
	const TTL = 90 * DAY_IN_SECONDS;

	/**
	 * Hook dismissal handling + rendering.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_init', array( $this, 'maybe_dismiss' ) );
		add_action( 'admin_notices', array( $this, 'render' ) );
	}

	/**
	 * Transient key for a notice id.
	 *
	 * @param string $key Notice key.
	 * @return string
	 */
	private function transient_key( $key ) {
		return 'pkitfw_notice_' . $key;
	}

	/**
	 * Handle a dismissal request (`?pkitfw_dismiss=<key>` + nonce).
	 *
	 * @return void
	 */
	public function maybe_dismiss() {
		if ( ! Capabilities::can_read() ) {
			return;
		}

		$key = isset( $_GET['pkitfw_dismiss'] ) ? sanitize_key( wp_unslash( $_GET['pkitfw_dismiss'] ) ) : '';
		if ( '' === $key ) {
			return;
		}

		$nonce = isset( $_GET['_pkitfw_nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_pkitfw_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'pkitfw_notice' ) ) {
			return;
		}

		set_transient( $this->transient_key( $key ), 'off', self::TTL );
	}

	/**
	 * Whether we are on a plugin admin screen.
	 *
	 * @return bool
	 */
	private function on_plugin_screen() {
		if ( AdminMenu::is_app_screen() ) {
			return true;
		}
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
		return ( AdminMenu::SLUG === $page );
	}

	/**
	 * Render the notice (single, dismissible, escaped, gated).
	 *
	 * @return void
	 */
	public function render() {
		if ( ! Capabilities::can_read() ) {
			return;
		}

		if ( ! $this->on_plugin_screen() ) {
			return;
		}

		// Only nudge users without an active Pro license.
		if ( Capabilities::pro() ) {
			return;
		}

		if ( 'off' === get_transient( $this->transient_key( self::KEY ) ) ) {
			return;
		}

		$dismiss_url = wp_nonce_url(
			add_query_arg( 'pkitfw_dismiss', self::KEY ),
			'pkitfw_notice',
			'_pkitfw_nonce'
		);

		?>
		<div class="notice notice-info is-dismissible pkitfw-notice">
			<p>
				<strong><?php esc_html_e( 'ProductKit – Product Options for WooCommerce', 'productkit-for-woocommerce' ); ?></strong>
				&mdash;
				<?php esc_html_e( 'Thanks for installing! Build your first option set to start adding custom fields to products.', 'productkit-for-woocommerce' ); ?>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=' . AdminMenu::SLUG . '#/sets' ) ); ?>">
					<?php esc_html_e( 'Create an Option Set', 'productkit-for-woocommerce' ); ?>
				</a>
			</p>
			<p>
				<a href="<?php echo esc_url( $dismiss_url ); ?>" class="button-link">
					<?php esc_html_e( 'Dismiss', 'productkit-for-woocommerce' ); ?>
				</a>
			</p>
		</div>
		<?php
	}
}
