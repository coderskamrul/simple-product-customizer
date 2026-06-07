<?php
/**
 * Read-only "Product Options" tab on the product edit screen.
 *
 * @package ProductKit
 */

namespace ProductKit\Integration\WooCommerce;

use ProductKit\Data\AssignmentResolver;
use ProductKit\Data\OptionSetRepository;

defined( 'ABSPATH' ) || exit;

/**
 * Adds an informational WooCommerce product-data tab listing the option sets
 * resolved for the product, with deep links into the React admin app. All
 * assignment editing happens in that app — this panel is intentionally
 * read-only.
 */
final class ProductPanel {

	/**
	 * Assignment resolver.
	 *
	 * @var AssignmentResolver
	 */
	private $assignment;

	/**
	 * Set repository.
	 *
	 * @var OptionSetRepository
	 */
	private $sets;

	/**
	 * Constructor.
	 *
	 * @param AssignmentResolver  $assignment Assignment resolver.
	 * @param OptionSetRepository $sets       Set repository.
	 */
	public function __construct( AssignmentResolver $assignment, OptionSetRepository $sets ) {
		$this->assignment = $assignment;
		$this->sets       = $sets;
	}

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'woocommerce_product_data_tabs', array( $this, 'add_tab' ) );
		add_action( 'woocommerce_product_data_panels', array( $this, 'render_panel' ) );
	}

	/**
	 * Add the "Product Options" tab.
	 *
	 * @param array $tabs Product data tabs.
	 * @return array
	 */
	public function add_tab( $tabs ) {
		$tabs = is_array( $tabs ) ? $tabs : array();
		$tabs['pkitfw_options'] = array(
			'label'    => __( 'Product Options', 'productkit-for-woocommerce' ),
			'target'   => 'pkitfw_options_panel',
			'class'    => array( 'hide_if_grouped' ),
			'priority' => 80,
		);
		return $tabs;
	}

	/**
	 * Render the read-only panel.
	 *
	 * @return void
	 */
	public function render_panel() {
		global $post;
		$product_id = $post && isset( $post->ID ) ? (int) $post->ID : 0;

		$set_ids = $product_id ? $this->assignment->for_product( $product_id ) : array();

		echo '<div id="pkitfw_options_panel" class="panel woocommerce_options_panel">';
		echo '<div class="options_group" style="padding:16px;">';

		if ( array() === $set_ids ) {
			echo '<p>' . esc_html__( 'No option sets are assigned to this product yet.', 'productkit-for-woocommerce' ) . '</p>';
			printf(
				'<p><a class="button" target="_blank" href="%s">%s</a></p>',
				esc_url( admin_url( 'admin.php?page=pkitfw-options#/set/new' ) ),
				esc_html__( 'Create an Option Set', 'productkit-for-woocommerce' )
			);
		} else {
			echo '<p><strong>' . esc_html__( 'Assigned Option Sets', 'productkit-for-woocommerce' ) . '</strong></p>';
			echo '<ul style="margin:0;">';
			foreach ( $set_ids as $set_id ) {
				$set_id = (int) $set_id;
				$set    = $this->sets->get( $set_id );
				if ( ! $set || 'publish' !== $set['status'] ) {
					continue;
				}
				printf(
					'<li style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #eee;"><span>%s</span><a target="_blank" href="%s">%s</a></li>',
					esc_html( '' !== $set['title'] ? $set['title'] : __( '(untitled)', 'productkit-for-woocommerce' ) ),
					esc_url( admin_url( 'admin.php?page=pkitfw-options#/set/' . $set_id ) ),
					esc_html__( 'Edit', 'productkit-for-woocommerce' )
				);
			}
			echo '</ul>';
			echo '<p class="description" style="margin-top:12px;">' . esc_html__( 'Assignment is managed in the ProductKit app.', 'productkit-for-woocommerce' ) . '</p>';
		}

		echo '</div>';
		echo '</div>';
	}
}
