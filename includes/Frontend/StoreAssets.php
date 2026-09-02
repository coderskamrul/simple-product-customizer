<?php
/**
 * Storefront asset enqueue + JS localisation.
 *
 * @package SPCUS
 */

namespace SPCUS\Frontend;

use SPCUS\Core\Assets;
use SPCUS\Core\Capabilities;
use SPCUS\Pricing\Currency\CurrencyBridge;

defined( 'ABSPATH' ) || exit;

/**
 * Owns everything asset-related for the storefront: the built `store` JS/CSS
 * bundle, per-set inline CSS, the global thematic/standard CSS option, and the
 * `window.spcusStore` localisation object. StoreRenderer fires
 * `spcus_enqueue_store_assets`; this class listens and attaches once.
 */
final class StoreAssets {

	/**
	 * Whether assets were already attached this request.
	 *
	 * @var bool
	 */
	private $done = false;

	/**
	 * Collected per-set CSS keyed by set id.
	 *
	 * @var array<int,string>
	 */
	private $set_css = array();

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'spcus_enqueue_store_assets', array( $this, 'enqueue' ), 10, 2 );
	}

	/**
	 * Enqueue the store bundle + localise it.
	 *
	 * @param int   $product_id    Product id.
	 * @param int[] $published_ids Rendered set ids.
	 * @return void
	 */
	public function enqueue( $product_id = 0, $published_ids = array() ) {
		unset( $product_id );

		if ( $this->done ) {
			return;
		}
		$this->done = true;

		$attached = Assets::script(
			'spcus-store',
			'store',
			array( 'jquery', 'wp-i18n', 'wp-api-fetch' )
		);

		Assets::style( 'spcus-store-style', 'store' );

		$this->collect_set_css( (array) $published_ids );
		$this->print_inline_css();

		$data = $this->localized();

		if ( $attached ) {
			wp_localize_script( 'spcus-store', 'spcusStore', $data );
		}

		// AJAX-loaded product templates: the wp_enqueue_scripts pipeline never
		// runs, so best-effort inline-print the global + bundle reference.
		if ( ( function_exists( 'wp_doing_ajax' ) && wp_doing_ajax() )
			|| ( function_exists( 'wp_is_serving_rest_request' ) && wp_is_serving_rest_request() ) ) {
			$this->print_ajax_fallback( $data, $attached );
		}
	}

	/**
	 * Gather per-set CSS for the rendered sets.
	 *
	 * @param int[] $published_ids Set ids.
	 * @return void
	 */
	private function collect_set_css( array $published_ids ) {
		$plugin = function_exists( 'spcus' ) ? spcus() : null;
		$repo   = $plugin ? $plugin->service( 'sets' ) : null;
		if ( ! $repo ) {
			return;
		}
		foreach ( $published_ids as $set_id ) {
			$set_id = (int) $set_id;
			$set    = $repo->get( $set_id );
			if ( $set && '' !== (string) $set['css'] ) {
				$this->set_css[ $set_id ] = (string) $set['css'];
			}
		}
	}

	/**
	 * Print collected per-set CSS plus the active global style CSS.
	 *
	 * @return void
	 */
	private function print_inline_css() {
		$css = '';
		foreach ( $this->set_css as $set_id => $rules ) {
			$css .= "\n/* spcus-set-" . (int) $set_id . " */\n" . $rules;
		}

		$thematic = (string) get_option( 'spcus_global_style_thematic_css', '' );
		$global   = '' !== $thematic ? $thematic : (string) get_option( 'spcus_global_style_css', '' );
		if ( '' !== $global ) {
			$css .= "\n/* spcus-global */\n" . $global;
		}

		if ( '' === trim( $css ) ) {
			return;
		}

		if ( wp_style_is( 'spcus-store-style', 'enqueued' ) || wp_style_is( 'spcus-store-style', 'registered' ) ) {
			wp_add_inline_style( 'spcus-store-style', $css );
			return;
		}

		printf(
			'<style id="spcus-inline-css">%s</style>',
			wp_strip_all_tags( $css ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS context, tags stripped.
		);
	}

	/**
	 * Build the window.spcusStore localisation payload.
	 *
	 * @return array
	 */
	private function localized() {
		$currency = array(
			'symbol'      => function_exists( 'get_woocommerce_currency_symbol' ) ? html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' ) : '',
			'pos'         => get_option( 'woocommerce_currency_pos' ),
			'decimals'    => function_exists( 'wc_get_price_decimals' ) ? wc_get_price_decimals() : 2,
			'decimalSep'  => function_exists( 'wc_get_price_decimal_separator' ) ? wc_get_price_decimal_separator() : '.',
			'thousandSep' => function_exists( 'wc_get_price_thousand_separator' ) ? wc_get_price_thousand_separator() : ',',
		);

		return array(
			'url'         => admin_url( 'admin-ajax.php' ),
			'restUrl'     => esc_url_raw( rest_url( 'spcus/v1/' ) ),
			// X-WP-Nonce header — must be `wp_rest` so WP core's REST
			// cookie auth (rest_cookie_check_errors) passes for logged-in
			// visitors. Our routes additionally verify a body `spcus_nonce`
			// against the `spcus_rest` action below.
			'nonce'       => wp_create_nonce( 'wp_rest' ),
			'uploadNonce' => wp_create_nonce( 'spcus_rest' ),
			'currency'    => $currency,
			'proActive'   => class_exists( Capabilities::class ) ? Capabilities::pro() : false,
			'conversion'  => class_exists( CurrencyBridge::class ) ? CurrencyBridge::data() : array(
				'active' => false,
				'rate'   => 1.0,
				'extra'  => 0.0,
			),
		);
	}

	/**
	 * Inline-print the global + bundle for AJAX-rendered product pages.
	 *
	 * @param array $data     Localised data.
	 * @param bool  $attached Whether the bundle handle was enqueued.
	 * @return void
	 */
	private function print_ajax_fallback( array $data, $attached ) {
		wp_print_inline_script_tag(
			sprintf(
				'window.spcusStore = window.spcusStore || %s;',
				wp_json_encode( $data )
			)
		);

		if ( ! $attached && is_readable( SPCUS_PATH . 'assets/build/store.js' ) ) {
			wp_print_script_tag(
				array(
					'src' => esc_url( SPCUS_ASSETS . 'store.js' ),
					'id'  => 'spcus-store-fallback-js',
				)
			);
		}
	}
}
