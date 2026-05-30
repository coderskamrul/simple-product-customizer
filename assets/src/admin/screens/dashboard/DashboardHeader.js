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
		<header className="dpo-db-head">
			<div className="dpo-db-head__intro">
				<h1 className="dpo-db-head__h1">
					{ name
						? sprintf(
								/* translators: %s: display name */
								__(
									'Welcome back, %s',
									'dynamic-product-options-for-woocommerce'
								),
								name
						  )
						: __(
								'Welcome back',
								'dynamic-product-options-for-woocommerce'
						  ) }
				</h1>
				<p className="dpo-db-head__sub">
					{ __(
						'Create dynamic pricing options for your WooCommerce products',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
			</div>

			<button
				type="button"
				className="dpo-db-cta"
				onClick={ () => navigate( '/set/new' ) }
			>
				<span
					className="dashicons dashicons-plus-alt2"
					aria-hidden="true"
				/>
				{ __(
					'New Option Set',
					'dynamic-product-options-for-woocommerce'
				) }
			</button>
		</header>
	);
}
