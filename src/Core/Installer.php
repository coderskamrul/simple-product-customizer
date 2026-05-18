<?php
/**
 * Activation / deactivation lifecycle.
 *
 * @package DPO
 */

namespace DPO\Core;

use DPO\Analytics\StatsRepository;

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
		require_once DPO_PATH . 'src/Analytics/StatsRepository.php';
		StatsRepository::install_tables();

		if ( ! wp_next_scheduled( 'dpo_cleanup_uploads' ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'dpo_cleanup_uploads' );
		}

		update_option( 'dpo_db_version', self::DB_VERSION );

		if ( ! get_option( 'dpo_seeded' ) ) {
			self::seed_demo();
			update_option( 'dpo_seeded', 1 );
		}

		set_transient( 'dpo_activation_redirect', 1, 30 );
	}

	/**
	 * Deactivation hook.
	 *
	 * @return void
	 */
	public static function deactivate() {
		$timestamp = wp_next_scheduled( 'dpo_cleanup_uploads' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'dpo_cleanup_uploads' );
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
				'label'     => __( 'Size', 'dynamic-product-options-for-woocommerce' ),
				'required'  => true,
				'width'     => 'full',
				'choices'   => array(
					array(
						'label'     => __( 'Small', 'dynamic-product-options-for-woocommerce' ),
						'priceMode' => 'none',
						'regular'   => '',
						'selected'  => true,
					),
					array(
						'label'     => __( 'Large', 'dynamic-product-options-for-woocommerce' ),
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
				'label'    => __( 'Gift note', 'dynamic-product-options-for-woocommerce' ),
				'width'    => 'full',
				'choices'  => array(),
				'children' => array(),
			),
		);

		$post_id = wp_insert_post(
			array(
				'post_type'    => Plugin::POST_TYPE,
				'post_status'  => 'draft',
				'post_title'   => __( 'Sample Option Set', 'dynamic-product-options-for-woocommerce' ),
				'post_content' => '',
			)
		);

		if ( $post_id && ! is_wp_error( $post_id ) ) {
			update_post_meta( $post_id, '_dpo_fields', wp_slash( wp_json_encode( $fields ) ) );
			update_post_meta( $post_id, '_dpo_assignment', wp_json_encode( array( 'scope' => 'none', 'include' => array(), 'exclude' => array() ) ) );
		}
	}
}
