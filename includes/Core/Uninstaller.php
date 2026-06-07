<?php
/**
 * Full data purge on uninstall.
 *
 * @package ProductKit
 */

namespace ProductKit\Core;

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

		$timestamp = wp_next_scheduled( 'pkitfw_cleanup_uploads' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'pkitfw_cleanup_uploads' );
		}

		// Option sets.
		$ids = get_posts(
			array(
				'post_type'   => 'pkitfw_option_set',
				'post_status' => 'any',
				'numberposts' => -1,
				'fields'      => 'ids',
			)
		);
		foreach ( $ids as $id ) {
			wp_delete_post( $id, true );
		}

		// Options.
		$options = array(
			'pkitfw_settings',
			'pkitfw_assign_all',
			'pkitfw_global_style',
			'pkitfw_global_style_css',
			'pkitfw_global_style_thematic',
			'pkitfw_global_style_thematic_css',
			'pkitfw_custom_fonts',
			'pkitfw_product_image_map',
			'pkitfw_seeded',
			'pkitfw_license_key',
			'pkitfw_license_data',
			'pkitfw_db_version',
		);
		foreach ( $options as $option ) {
			delete_option( $option );
		}

		// One-time uninstall cleanup of plugin-owned rows and tables. Direct
		// queries are intentional here: there is nothing to cache on teardown
		// and the schema drops have no Core API equivalent.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange

		// Product / term meta.
		$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE meta_key IN ('_pkitfw_assigned_include','_pkitfw_assigned_exclude')" );
		$wpdb->query( "DELETE FROM {$wpdb->termmeta} WHERE meta_key = '_pkitfw_term_assigned'" );

		// Stats tables.
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pkitfw_stats" );
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}pkitfw_stats_daily" );

		// Transients.
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_pkitfw\_%' OR option_name LIKE '\_transient\_timeout\_pkitfw\_%'" );

		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
	}
}
