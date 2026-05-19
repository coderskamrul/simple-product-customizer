<?php
/**
 * Full data purge on uninstall.
 *
 * @package DPO
 */

namespace DPO\Core;

defined( 'ABSPATH' ) || exit;

/**
 * Removes every trace of the plugin: posts, options, meta, tables, cron.
 */
final class Uninstaller {

	/**
	 * Delete all plugin data.
	 *
	 * @return void
	 */
	public static function purge() {
		global $wpdb;

		$timestamp = wp_next_scheduled( 'dpo_cleanup_uploads' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'dpo_cleanup_uploads' );
		}

		// Option sets.
		$ids = get_posts(
			array(
				'post_type'      => 'dpo_option_set',
				'post_status'    => 'any',
				'numberposts'    => -1,
				'fields'         => 'ids',
				'suppress_filters' => true,
			)
		);
		foreach ( $ids as $id ) {
			wp_delete_post( $id, true );
		}

		// Options.
		$options = array(
			'dpo_settings',
			'dpo_assign_all',
			'dpo_global_style',
			'dpo_global_style_css',
			'dpo_global_style_thematic',
			'dpo_global_style_thematic_css',
			'dpo_custom_fonts',
			'dpo_product_image_map',
			'dpo_seeded',
			'dpo_license_key',
			'dpo_license_data',
			'dpo_db_version',
		);
		foreach ( $options as $option ) {
			delete_option( $option );
		}

		// Product / term meta.
		$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE meta_key IN ('_dpo_assigned_include','_dpo_assigned_exclude')" );
		$wpdb->query( "DELETE FROM {$wpdb->termmeta} WHERE meta_key = '_dpo_term_assigned'" );

		// Stats tables.
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}dpo_stats" );
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}dpo_stats_daily" );

		// Transients.
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_dpo\_%' OR option_name LIKE '\_transient\_timeout\_dpo\_%'" );
	}
}
