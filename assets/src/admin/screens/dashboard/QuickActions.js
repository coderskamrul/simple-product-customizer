/**
 * Quick actions — a compact, keyboard-navigable launcher list that deep
 * links to the most-used admin screens.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { navigate } from '../../app/router';

/**
 * QuickActions.
 *
 * @return {JSX.Element} The panel.
 */
export default function QuickActions() {
	const { proActive } = useConfig();

	const actions = [
		{
			icon: 'art',
			to: '/style',
			title: __(
				'Global Styles',
				'dynamic-product-options-for-woocommerce'
			),
			desc: __(
				'Customise appearance',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			icon: 'admin-generic',
			to: '/settings',
			title: __( 'Settings', 'dynamic-product-options-for-woocommerce' ),
			desc: __(
				'Configure the plugin',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			icon: 'chart-bar',
			to: '/analytics',
			title: __( 'Analytics', 'dynamic-product-options-for-woocommerce' ),
			desc: __(
				'View performance reports',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			icon: 'admin-network',
			to: '/license',
			title: __( 'License', 'dynamic-product-options-for-woocommerce' ),
			desc: proActive
				? __(
						'Manage activation',
						'dynamic-product-options-for-woocommerce'
				  )
				: __(
						'Activate Pro',
						'dynamic-product-options-for-woocommerce'
				  ),
		},
	];

	return (
		<section className="dpo-db-card dpo-db-panel">
			<header className="dpo-db-panel__head">
				<h2 className="dpo-db-panel__title">
					<span
						className="dashicons dashicons-superhero-alt dpo-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Quick Actions',
						'dynamic-product-options-for-woocommerce'
					) }
				</h2>
			</header>

			<nav className="dpo-db-actions">
				{ actions.map( ( a ) => (
					<button
						key={ a.to }
						type="button"
						className="dpo-db-action"
						onClick={ () => navigate( a.to ) }
					>
						<span
							className="dpo-db-action__icon"
							aria-hidden="true"
						>
							<span
								className={ `dashicons dashicons-${ a.icon }` }
							/>
						</span>
						<span className="dpo-db-action__text">
							<span className="dpo-db-action__title">
								{ a.title }
							</span>
							<span className="dpo-db-action__desc">
								{ a.desc }
							</span>
						</span>
						<span
							className="dashicons dashicons-arrow-right-alt2 dpo-db-action__chev"
							aria-hidden="true"
						/>
					</button>
				) ) }
			</nav>
		</section>
	);
}
