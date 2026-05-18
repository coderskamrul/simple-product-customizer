<?php
/**
 * Storefront option-set renderer.
 *
 * @package DPO
 */

namespace DPO\Frontend;

use DPO\Core\Container;
use DPO\Data\AssignmentResolver;
use DPO\Data\OptionSetRepository;
use DPO\Fields\FieldRegistry;
use DPO\Pricing\PriceCalculator;
use DPO\Support\Money;

defined( 'ABSPATH' ) || exit;

/**
 * Emits the full storefront DOM for a product's resolved option sets,
 * faithfully following ARCHITECTURE §8 (exact ids / classes / data-*). The
 * store JS bundle (window.dpoStore) consumes everything written here, so the
 * markup contract is load-bearing.
 */
final class StoreRenderer {

	/**
	 * Service container.
	 *
	 * @var Container
	 */
	private $container;

	/**
	 * Asset enqueuer.
	 *
	 * @var StoreAssets
	 */
	private $assets;

	/**
	 * Constructor.
	 *
	 * @param Container $container Service container.
	 */
	public function __construct( Container $container ) {
		$this->container = $container;
		$this->assets    = new StoreAssets();
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		$this->assets->register();

		add_action( 'woocommerce_before_add_to_cart_button', array( $this, 'render' ), 100 );

		// Image-swatch product-image swap entry point (kept minimal — the
		// store JS performs the live swap; this filter is the server-side
		// passthrough so gallery ids can be augmented later).
		add_filter( 'woocommerce_product_get_gallery_image_ids', array( $this, 'filter_gallery_image_ids' ), 99, 2 );
	}

	/**
	 * Render the option-set wrapper before the add-to-cart button.
	 *
	 * @return void
	 */
	public function render() {
		global $product;

		if ( ! $product || ! is_a( $product, 'WC_Product' ) ) {
			return;
		}

		$product_id = (int) $product->get_id();

		/** @var AssignmentResolver $assignment */
		$assignment = $this->container->get( 'assignment' );
		$set_ids    = $assignment ? $assignment->for_product( $product_id ) : array();

		if ( array() === $set_ids ) {
			return;
		}

		/** @var OptionSetRepository $sets */
		$sets = $this->container->get( 'sets' );
		/** @var FieldRegistry $fields */
		$fields = $this->container->get( 'fields' );

		$rendered_sets = array();
		$published_ids = array();

		foreach ( $set_ids as $set_id ) {
			$set_id = (int) $set_id;
			$set    = $sets ? $sets->get( $set_id ) : null;
			if ( ! $set || 'publish' !== $set['status'] ) {
				continue;
			}

			$nodes = is_array( $set['fields'] ) ? $set['fields'] : array();
			if ( array() === $nodes ) {
				continue;
			}

			$inner = '';
			foreach ( $nodes as $node ) {
				if ( ! is_array( $node ) || empty( $node['parent'] ) ) {
					// Top-level nodes only (parent === '' / absent).
				}
				if ( ! is_array( $node ) || ( isset( $node['parent'] ) && '' !== (string) $node['parent'] ) ) {
					continue;
				}
				$field = $fields ? $fields->make( $node, $product_id, $set_id ) : null;
				if ( $field ) {
					$inner .= $field->render();
				}
			}

			if ( '' === $inner ) {
				continue;
			}

			$rendered_sets[] = sprintf(
				'<div class="dpo-set" data-set-id="%d">%s</div>',
				$set_id,
				$inner
			);
			$published_ids[] = $set_id;

			// Impression counter — recorded once per rendered set.
			do_action( 'dpo_stats_record', $set_id, 'impressions', 0 );
		}

		if ( array() === $rendered_sets ) {
			return;
		}

		// Tell StoreAssets to attach (handles the AJAX-loaded page case too).
		do_action( 'dpo_enqueue_store_assets', $product_id, $published_ids );

		$html  = sprintf(
			'<div class="dpo-options dpo-loading" data-product-id="%d">',
			$product_id
		);
		$html .= '<div class="dpo-loader" aria-hidden="true"></div>';
		$html .= $this->hidden_inputs( $product, $published_ids );
		$html .= implode( '', $rendered_sets );
		$html .= $this->price_summary( $product );
		$html .= '</div>';

		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- All dynamic parts escaped at source (field render, esc_attr below).
	}

	/**
	 * Hidden inputs + price/variation/attribute holder spans (DOM contract §8).
	 *
	 * @param \WC_Product $product       Product.
	 * @param int[]       $published_ids Rendered set ids.
	 * @return string
	 */
	private function hidden_inputs( $product, array $published_ids ) {
		$product_id = (int) $product->get_id();

		/** @var PriceCalculator $pricing */
		$pricing  = $this->container->get( 'pricing' );
		$base     = $pricing ? $pricing->productBasePrice( $product_id, 0 ) : 0.0;
		$base_pct = $pricing ? $pricing->productPercentBase( $product_id, 0 ) : 0.0;

		$variation_prices     = array();
		$variation_prices_pct = array();
		$attribute_map        = array();

		if ( method_exists( $product, 'is_type' ) && $product->is_type( 'variable' ) ) {
			foreach ( (array) $product->get_children() as $variation_id ) {
				$variation_id = (int) $variation_id;
				$variation_prices[ $variation_id ]     = $pricing ? $pricing->productBasePrice( $product_id, $variation_id ) : 0.0;
				$variation_prices_pct[ $variation_id ] = $pricing ? $pricing->productPercentBase( $product_id, $variation_id ) : 0.0;
			}

			if ( method_exists( $product, 'get_attributes' ) ) {
				foreach ( (array) $product->get_attributes() as $attribute ) {
					if ( ! is_object( $attribute ) || ! method_exists( $attribute, 'is_taxonomy' ) || ! $attribute->is_taxonomy() ) {
						continue;
					}
					$attribute_name = $attribute->get_name();
					$terms          = function_exists( 'wc_get_product_terms' )
						? wc_get_product_terms( $product_id, $attribute_name, array( 'fields' => 'all' ) )
						: array();
					foreach ( (array) $terms as $term ) {
						if ( is_object( $term ) && isset( $term->slug, $term->term_id ) ) {
							$attribute_map[ $attribute_name ][ $term->slug ] = (int) $term->term_id;
						}
					}
				}
			}
		}

		$shipping = array(
			'weight' => method_exists( $product, 'get_weight' ) ? Money::f( $product->get_weight() ) : 0,
			'length' => method_exists( $product, 'get_length' ) ? Money::f( $product->get_length() ) : 0,
			'width'  => method_exists( $product, 'get_width' ) ? Money::f( $product->get_width() ) : 0,
			'height' => method_exists( $product, 'get_height' ) ? Money::f( $product->get_height() ) : 0,
		);

		$html  = '<input type="hidden" name="dpo_field_data" class="dpo-field-data" value="" />';
		$html .= '<input type="hidden" name="dpo_linked_products" class="dpo-linked-products" value="" />';
		$html .= sprintf(
			'<input type="hidden" name="dpo_published_set_ids" value="%s" />',
			esc_attr( (string) wp_json_encode( array_values( array_map( 'intval', $published_ids ) ) ) )
		);
		$html .= sprintf(
			'<input type="hidden" name="dpo_shipping_dynamics" value="%s" />',
			esc_attr( (string) wp_json_encode( $shipping ) )
		);

		$html .= sprintf(
			'<span class="dpo-holder" id="dpo-base-price" data-value="%s"></span>',
			esc_attr( (string) $base )
		);
		$html .= sprintf(
			'<span class="dpo-holder" id="dpo-base-price-pct" data-value="%s"></span>',
			esc_attr( (string) $base_pct )
		);
		$html .= sprintf(
			'<span class="dpo-holder" id="dpo-variation-prices" data-value="%s"></span>',
			esc_attr( (string) wp_json_encode( $variation_prices ) )
		);
		$html .= sprintf(
			'<span class="dpo-holder" id="dpo-variation-prices-pct" data-value="%s"></span>',
			esc_attr( (string) wp_json_encode( $variation_prices_pct ) )
		);
		$html .= sprintf(
			'<span class="dpo-holder" id="dpo-product-attributes" data-product-type="%s" data-value="%s"></span>',
			esc_attr( method_exists( $product, 'get_type' ) ? (string) $product->get_type() : '' ),
			esc_attr( (string) wp_json_encode( $attribute_map ) )
		);

		return $html;
	}

	/**
	 * Options-price / total summary lines (gated by settings).
	 *
	 * @param \WC_Product $product Product.
	 * @return string
	 */
	private function price_summary( $product ) {
		$settings = $this->container->get( 'settings' );
		if ( ! $settings ) {
			return '';
		}

		$show_price = (bool) $settings->get( 'showPriceLine', true );
		$show_total = (bool) $settings->get( 'showTotalLine', true );
		if ( ! $show_price && ! $show_total ) {
			return '';
		}

		/** @var PriceCalculator $pricing */
		$pricing = $this->container->get( 'pricing' );
		$base    = $pricing ? $pricing->productBasePrice( (int) $product->get_id(), 0 ) : 0.0;

		$out = '<div class="dpo-price-summary">';

		if ( $show_price ) {
			$out .= sprintf(
				'<div class="dpo-price-row"><strong class="dpo-price-label">%s</strong> <span id="dpo-options-price" class="dpo-price-value">%s</span></div>',
				esc_html( (string) $settings->get( 'priceLineLabel', __( 'Options Price', 'dynamic-product-options-for-woocommerce' ) ) ),
				wp_kses_post( Money::html( 0 ) )
			);
		}

		if ( $show_total ) {
			$out .= sprintf(
				'<div class="dpo-price-row"><strong class="dpo-price-label">%s</strong> <span id="dpo-options-total" class="dpo-price-value">%s</span></div>',
				esc_html( (string) $settings->get( 'totalLineLabel', __( 'Total Price', 'dynamic-product-options-for-woocommerce' ) ) ),
				wp_kses_post( Money::html( $base ) )
			);
		}

		$out .= '</div>';
		return $out;
	}

	/**
	 * Passthrough hook for image-swatch product-image swapping.
	 *
	 * The live image swap is handled client-side by the store bundle; this
	 * filter is the server-side seam so gallery ids can be augmented without
	 * touching the renderer.
	 *
	 * @param array $gallery_image_ids Gallery attachment ids.
	 * @param mixed $product           Product (unused here).
	 * @return array
	 */
	public function filter_gallery_image_ids( $gallery_image_ids, $product ) {
		unset( $product );
		return $gallery_image_ids;
	}
}
