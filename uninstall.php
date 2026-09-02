<?php
/**
 * Uninstall routine — removes all plugin data.
 *
 * @package SPCUS
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

require_once __DIR__ . '/includes/Core/Uninstaller.php';

\SPCUS\Core\Uninstaller::purge();
