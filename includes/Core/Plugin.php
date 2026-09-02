<?php
/**
 * Plugin orchestrator.
 *
 * @package SPCUS
 */

namespace SPCUS\Core;

use SPCUS\Admin\AdminAssets;
use SPCUS\Admin\AdminMenu;
use SPCUS\Admin\AdminNotices;
use SPCUS\Analytics\CleanupCron;
use SPCUS\Analytics\StatsRepository;
use SPCUS\Data\AssignmentResolver;
use SPCUS\Data\OptionSetRepository;
use SPCUS\Fields\FieldRegistry;
use SPCUS\Frontend\StoreRenderer;
use SPCUS\Integration\WooCommerce\CartHooks;
use SPCUS\Integration\WooCommerce\CheckoutHooks;
use SPCUS\Integration\WooCommerce\Compatibility;
use SPCUS\Integration\WooCommerce\OrderHooks;
use SPCUS\Integration\WooCommerce\ProductPanel;
use SPCUS\Integration\WooCommerce\ShopLoop;
use SPCUS\Pricing\PriceCalculator;
use SPCUS\Rest\RestServer;

defined( 'ABSPATH' ) || exit;

/**
 * Boots and wires every subsystem. Singleton.
 */
final class Plugin {

	const POST_TYPE = 'spcus_option_set';

	/**
	 * Singleton.
	 *
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Service container.
	 *
	 * @var Container
	 */
	private $container;

	/**
	 * Singleton accessor.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor — boots the plugin.
	 */
	private function __construct() {
		$this->container = new Container();

		if ( ! $this->woocommerce_ready() ) {
			add_action( 'admin_notices', array( $this, 'render_missing_wc_notice' ) );
			return;
		}

		$this->register_services();
		$this->register_post_type();
		$this->boot();

		do_action( 'spcus_booted', $this );
	}

	/**
	 * Service container accessor.
	 *
	 * @return Container
	 */
	public function container() {
		return $this->container;
	}

	/**
	 * Convenience resolver.
	 *
	 * @param string $id Service id.
	 * @return object|null
	 */
	public function service( $id ) {
		return $this->container->get( $id );
	}

	/**
	 * Is WooCommerce active and new enough?
	 *
	 * @return bool
	 */
	private function woocommerce_ready() {
		if ( ! class_exists( \WooCommerce::class ) ) {
			return false;
		}
		return defined( 'WC_VERSION' ) ? version_compare( WC_VERSION, SPCUS_MIN_WC, '>=' ) : true;
	}

	/**
	 * Register service factories.
	 *
	 * @return void
	 */
	private function register_services() {
		$c = $this->container;

		$c->set( 'settings', static fn() => new Settings() );
		$c->set( 'fields', static fn() => new FieldRegistry() );
		$c->set( 'sets', static fn() => new OptionSetRepository() );
		$c->set( 'assignment', static fn( $c ) => new AssignmentResolver( $c->get( 'sets' ) ) );
		$c->set( 'stats', static fn() => new StatsRepository() );
		$c->set(
			'pricing',
			static fn( $c ) => new PriceCalculator(
				$c->get( 'fields' ),
				$c->get( 'sets' ),
				$c->get( 'assignment' )
			)
		);
	}

	/**
	 * Register the option-set custom post type.
	 *
	 * @return void
	 */
	private function register_post_type() {
		add_action(
			'init',
			static function () {
				register_post_type(
					self::POST_TYPE,
					array(
						'labels'              => array(
							'name'          => __( 'Option Sets', 'simple-product-customizer' ),
							'singular_name' => __( 'Option Set', 'simple-product-customizer' ),
						),
						'public'              => false,
						'show_ui'             => false,
						'show_in_menu'        => false,
						'show_in_nav_menus'   => false,
						'show_in_rest'        => true,
						'exclude_from_search' => true,
						'hierarchical'        => false,
						'rewrite'             => false,
						'query_var'           => false,
						'supports'            => array( 'title', 'editor' ),
						'capability_type'     => 'page',
					)
				);
			}
		);
	}

	/**
	 * Instantiate and hook all runtime subsystems.
	 *
	 * @return void
	 */
	private function boot() {
		$c = $this->container;

		// Stats recorder — single action used everywhere counters change.
		add_action(
			'spcus_stats_record',
			array( $c->get( 'stats' ), 'record' ),
			10,
			3
		);

		( new Compatibility() )->register();
		( new RestServer( $c ) )->register();
		( new ProductPanel( $c->get( 'assignment' ), $c->get( 'sets' ) ) )->register();
		( new StoreRenderer( $c ) )->register();
		( new CartHooks( $c ) )->register();
		( new CheckoutHooks( $c ) )->register();
		( new OrderHooks( $c ) )->register();
		( new ShopLoop( $c->get( 'assignment' ), $c->get( 'settings' ) ) )->register();
		( new CleanupCron( $c->get( 'settings' ) ) )->register();

		if ( is_admin() ) {
			( new AdminMenu() )->register();
			( new AdminAssets( $c ) )->register();
			( new AdminNotices() )->register();
		}
	}

	/**
	 * Admin notice shown when WooCommerce is unavailable.
	 *
	 * @return void
	 */
	public function render_missing_wc_notice() {
		echo '<div class="notice notice-error"><p>';
		echo esc_html__( 'Simple Product Customizer requires an active, up-to-date WooCommerce installation.', 'simple-product-customizer' );
		echo '</p></div>';
	}
}
