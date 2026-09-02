<?php
/**
 * Full data purge on uninstall.
 *
 * @package SPCUS
 */

namespace SPCUS\Core;

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

		$timestamp = wp_next_scheduled( 'spcus_cleanup_uploads' );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, 'spcus_cleanup_uploads' );
		}

		// Option sets.
		$ids = get_posts(
			array(
				'post_type'      => 'spcus_option_set',
				'post_status'    => 'any',
				'numberposts'    => -1,
				'fields'      => 'ids',
			)
		);
		foreach ( $ids as $id ) {
			wp_delete_post( $id, true );
		}

		// Options.
		$options = array(
			'spcus_settings',
			'spcus_assign_all',
			'spcus_global_style',
			'spcus_global_style_css',
			'spcus_global_style_thematic',
			'spcus_global_style_thematic_css',
			'spcus_custom_fonts',
			'spcus_product_image_map',
			'spcus_seeded',
			'spcus_db_version',
		);
		foreach ( $options as $option ) {
			delete_option( $option );
		}

		/*
		 * Uninstall teardown. These are one-shot bulk deletes over the plugin's
		 * own meta keys, tables and transients: there is no core API for them,
		 * every value is a literal (no user input is interpolated), and caching
		 * is meaningless because the plugin is being removed.
		 */
		// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange

		// Product / term meta.
		$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE meta_key IN ('_spcus_assigned_include','_spcus_assigned_exclude')" );
		$wpdb->query( "DELETE FROM {$wpdb->termmeta} WHERE meta_key = '_spcus_term_assigned'" );

		// Stats tables.
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}spcus_stats" );
		$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}spcus_stats_daily" );

		// Transients.
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_spcus\_%' OR option_name LIKE '\_transient\_timeout\_spcus\_%'" );

		// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange
	}
}
