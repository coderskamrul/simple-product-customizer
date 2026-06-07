<?php
/**
 * Activation / deactivation lifecycle.
 *
 * @package ProductKit
 */

namespace ProductKit\Core;

use ProductKit\Analytics\StatsRepository;

defined( 'ABSPATH' ) || exit;

/**
 * Creates database tables, schedules cron, seeds demo content.
 */
final class Installer {

	const DB_VERSION = '1';

	/**
	 * Activation hook.
	 *
	 * @return void
	 */
	public static function activate() {
		require_once PKITFW_PATH . 'includes/Analytics/StatsRepository.php';
		StatsRepository::install_tables();

		if ( ! wp_next_scheduled( 'pkitfw_cleanup_uploads' ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'pkitfw_cleanup_uploads' );
		}

		update_option( 'pkitfw_db_version', self::DB_VERSION );

		if ( ! get_option( 'pkitfw_seeded' ) ) {
			self::seed_demo();
			update_option( 'pkitfw_seeded', 1 );
		}

		set_transient( 'pkitfw_activation_redirect', 1, 30 );
	}

	/**
	 * Deactivation hook.
	 *
	 * @return void
	 */
	public static function deactivate() {
		$timestamp = wp_next_scheduled( 'pkitfw_cleanup_uploads' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'pkitfw_cleanup_uploads' );
		}
	}

	/**
	 * Seed one example option set so the builder is never empty on install.
	 *
	 * @return void
	 */
	private static function seed_demo() {
		$fields = array(
			array(
				'id'        => 'f_demo_size',
				'type'      => 'radio',
				'parent'    => '',
				'label'     => __( 'Size', 'productkit-for-woocommerce' ),
				'required'  => true,
				'width'     => 'full',
				'choices'   => array(
					array(
						'label'     => __( 'Small', 'productkit-for-woocommerce' ),
						'priceMode' => 'none',
						'regular'   => '',
						'selected'  => true,
					),
					array(
						'label'     => __( 'Large', 'productkit-for-woocommerce' ),
						'priceMode' => 'flat',
						'regular'   => '5',
					),
				),
				'children'  => array(),
			),
			array(
				'id'       => 'f_demo_note',
				'type'     => 'textarea',
				'parent'   => '',
				'label'    => __( 'Gift note', 'productkit-for-woocommerce' ),
				'width'    => 'full',
				'choices'  => array(),
				'children' => array(),
			),
		);

		$post_id = wp_insert_post(
			array(
				'post_type'    => Plugin::POST_TYPE,
				'post_status'  => 'draft',
				'post_title'   => __( 'Sample Option Set', 'productkit-for-woocommerce' ),
				'post_content' => '',
			)
		);

		if ( $post_id && ! is_wp_error( $post_id ) ) {
			update_post_meta( $post_id, '_pkitfw_fields', wp_slash( wp_json_encode( $fields ) ) );
			// phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- JSON storage key, not a query argument.
			update_post_meta( $post_id, '_pkitfw_assignment', wp_json_encode( array( 'scope' => 'none', 'include' => array(), 'exclude' => array() ) ) );
		}
	}
}
