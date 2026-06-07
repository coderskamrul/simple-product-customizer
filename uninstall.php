<?php
/**
 * Uninstall routine — removes all plugin data.
 *
 * @package ProductKit
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

require_once __DIR__ . '/includes/Core/Uninstaller.php';

\ProductKit\Core\Uninstaller::purge();
