/**
 * Dashboard header — personalised welcome, supporting copy and the
 * primary "New Option Set" call to action.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { navigate } from '../../app/router';

/**
 * DashboardHeader.
 *
 * @return {JSX.Element} The header.
 */
export default function DashboardHeader() {
	const { user } = useConfig();
	const name = user && user.name ? user.name : '';

	return (
		<header className="pkitfw-db-head">
			<div className="pkitfw-db-head__intro">
				<h1 className="pkitfw-db-head__h1">
					{ name
						? sprintf(
								/* translators: %s: display name */
								__(
									'Welcome back, %s',
									'productkit-for-woocommerce'
								),
								name
						  )
						: __(
								'Welcome back',
								'productkit-for-woocommerce'
						  ) }
				</h1>
				<p className="pkitfw-db-head__sub">
					{ __(
						'Create dynamic pricing options for your WooCommerce products',
						'productkit-for-woocommerce'
					) }
				</p>
			</div>

			<button
				type="button"
				className="pkitfw-db-cta"
				onClick={ () => navigate( '/set/new' ) }
			>
				<span
					className="dashicons dashicons-plus-alt2"
					aria-hidden="true"
				/>
				{ __(
					'New Option Set',
					'productkit-for-woocommerce'
				) }
			</button>
		</header>
	);
}
