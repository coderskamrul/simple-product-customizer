<?php
/**
 * Plugin Name:       Simple Product Customizer
 * Description:       Build dynamic single-product option sets — swatches, uploads, conditional logic, formula pricing and more — with deep WooCommerce cart & checkout integration.
 * Version:           1.0.0
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Author:            WPDeveloper
 * Author URI:        https://wpdeveloper.com
 * Text Domain:       simple-product-customizer
 * Domain Path:       /languages
 * Requires Plugins:  woocommerce
 * License:           GPLv3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package SPCUS
 */

defined( 'ABSPATH' ) || exit;

define( 'SPCUS_VERSION', '1.0.0' );
define( 'SPCUS_FILE', __FILE__ );
define( 'SPCUS_PATH', plugin_dir_path( __FILE__ ) );
define( 'SPCUS_URL', plugin_dir_url( __FILE__ ) );
define( 'SPCUS_BASENAME', plugin_basename( __FILE__ ) );
define( 'SPCUS_ASSETS', SPCUS_URL . 'assets/build/' );
define( 'SPCUS_MIN_WC', '7.0' );
define( 'SPCUS_MIN_PHP', '7.4' );

/**
 * PSR-4 autoloader for the SPCUS\ namespace.
 *
 * Maps SPCUS\Sub\Space\ClassName to includes/Sub/Space/ClassName.php.
 * Deliberately uses StudlyCase filenames (PSR-4 canonical form), not a
 * hyphenated/`class-` convention, so the layout is self-describing.
 *
 * @param string $fqcn Fully-qualified class name.
 * @return void
 */
spl_autoload_register(
	static function ( $fqcn ) {
		$prefix = 'SPCUS\\';
		if ( 0 !== strpos( $fqcn, $prefix ) ) {
			return;
		}
		$relative = substr( $fqcn, strlen( $prefix ) );
		$path     = SPCUS_PATH . 'includes/' . str_replace( '\\', '/', $relative ) . '.php';
		if ( is_readable( $path ) ) {
			require_once $path;
		}
	}
);

// Composer autoload, when present, takes precedence for third-party libs.
if ( is_readable( SPCUS_PATH . 'vendor/autoload.php' ) ) {
	require_once SPCUS_PATH . 'vendor/autoload.php';
}

register_activation_hook( __FILE__, array( \SPCUS\Core\Installer::class, 'activate' ) );
register_deactivation_hook( __FILE__, array( \SPCUS\Core\Installer::class, 'deactivate' ) );

/**
 * Boot the plugin once all plugins are loaded (so WooCommerce is available).
 *
 * @return void
 */
function spcus() { // phpcs:ignore WordPress.NamingConventions
	return \SPCUS\Core\Plugin::instance();
}

add_action( 'plugins_loaded', 'spcus', 9 );

// Declare WooCommerce feature compatibility (HPOS + Cart/Checkout blocks).
add_action(
	'before_woocommerce_init',
	static function () {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', __FILE__, true );
		}
	}
);
