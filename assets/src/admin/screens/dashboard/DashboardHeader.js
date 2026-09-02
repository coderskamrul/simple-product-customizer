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
		<header className="spcus-db-head">
			<div className="spcus-db-head__intro">
				<h1 className="spcus-db-head__h1">
					{ name
						? sprintf(
								/* translators: %s: display name */
								__(
									'Welcome back, %s',
									'simple-product-customizer'
								),
								name
						  )
						: __(
								'Welcome back',
								'simple-product-customizer'
						  ) }
				</h1>
				<p className="spcus-db-head__sub">
					{ __(
						'Create dynamic pricing options for your WooCommerce products',
						'simple-product-customizer'
					) }
				</p>
			</div>

			<button
				type="button"
				className="spcus-db-cta"
				onClick={ () => navigate( '/set/new' ) }
			>
				<span
					className="dashicons dashicons-plus-alt2"
					aria-hidden="true"
				/>
				{ __(
					'New Option Set',
					'simple-product-customizer'
				) }
			</button>
		</header>
	);
}
