<?php
/**
 * Uninstall routine — removes all plugin data.
 *
 * @package DPO
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

require_once __DIR__ . '/includes/Core/Uninstaller.php';

\DPO\Core\Uninstaller::purge();
