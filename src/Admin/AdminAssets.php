<?php
/**
 * Admin app asset enqueue + bootstrap payload.
 *
 * @package DPO
 */

namespace DPO\Admin;

use DPO\Core\Assets;
use DPO\Core\Capabilities;
use DPO\Core\Container;

defined( 'ABSPATH' ) || exit;

/**
 * Enqueues the built admin bundle only on the plugin app screen and
 * hands the React app its bootstrap configuration via the `dpoAdmin`
 * JS global.
 */
final class AdminAssets {

	/**
	 * Service container.
	 *
	 * @var Container
	 */
	private $container;

	/**
	 * Constructor.
	 *
	 * @param Container $c Service container.
	 */
	public function __construct( Container $c ) {
		$this->container = $c;
	}

	/**
	 * Hook the enqueue.
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	/**
	 * Enqueue the bundle + localize bootstrap data (app screen only).
	 *
	 * @return void
	 */
	public function enqueue() {
		if ( ! AdminMenu::is_app_screen() ) {
			return;
		}

		$c = $this->container;

		wp_enqueue_media();

		Assets::script(
			'dpo-admin',
			'admin',
			array( 'wp-element', 'wp-components', 'wp-api-fetch', 'wp-i18n' )
		);
		Assets::style( 'dpo-admin-style', 'admin' );

		wp_set_script_translations(
			'dpo-admin',
			'dynamic-product-options-for-woocommerce',
			DPO_PATH . 'languages'
		);

		$fields = $c->get( 'fields' );

		wp_localize_script(
			'dpo-admin',
			'dpoAdmin',
			array(
				'restUrl'     => esc_url_raw( rest_url( 'dpo/v1/' ) ),
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'uploadNonce' => wp_create_nonce( 'dpo_rest' ),
				'adminUrl'    => admin_url( 'admin.php?page=dpo-options#/' ),
				'pluginUrl'   => DPO_URL,
				'version'     => DPO_VERSION,
				'proActive'   => Capabilities::pro(),
				'license'     => get_option( 'dpo_license_key', '' ),
				'currency'    => array(
					'symbol'      => html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' ),
					'pos'         => get_option( 'woocommerce_currency_pos', 'left' ),
					'decimals'    => wc_get_price_decimals(),
					'decimalSep'  => wc_get_price_decimal_separator(),
					'thousandSep' => wc_get_price_thousand_separator(),
				),
				'fieldTypes'  => $fields ? $fields->types() : array(),
				'attributes'  => $this->wc_attributes(),
				'user'        => array(
					'name'  => wp_get_current_user()->display_name,
					'email' => wp_get_current_user()->user_email,
				),
			)
		);
	}

	/**
	 * Map global WooCommerce product attribute taxonomies to a compact
	 * shape the builder consumes: pa_{name} => {label, terms:[{id,slug,label}]}.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	private function wc_attributes() {
		$out = array();

		if ( ! function_exists( 'wc_get_attribute_taxonomies' ) ) {
			return $out;
		}

		$taxonomies = wc_get_attribute_taxonomies();
		if ( empty( $taxonomies ) || ! is_array( $taxonomies ) ) {
			return $out;
		}

		foreach ( $taxonomies as $tax ) {
			$name     = isset( $tax->attribute_name ) ? $tax->attribute_name : '';
			$label    = isset( $tax->attribute_label ) ? $tax->attribute_label : $name;
			$taxonomy = function_exists( 'wc_attribute_taxonomy_name' )
				? wc_attribute_taxonomy_name( $name )
				: 'pa_' . $name;

			if ( '' === $name ) {
				continue;
			}

			$terms_out = array();
			$terms     = get_terms(
				array(
					'taxonomy'   => $taxonomy,
					'hide_empty' => false,
				)
			);

			if ( ! is_wp_error( $terms ) && is_array( $terms ) ) {
				foreach ( $terms as $term ) {
					$terms_out[] = array(
						'id'    => (int) $term->term_id,
						'slug'  => (string) $term->slug,
						'label' => (string) $term->name,
					);
				}
			}

			$out[ $taxonomy ] = array(
				'label' => (string) $label,
				'terms' => $terms_out,
			);
		}

		return $out;
	}
}
