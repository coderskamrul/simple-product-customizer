/**
 * Quick actions — a compact, keyboard-navigable launcher list that deep
 * links to the most-used admin screens.
 *
 * @package
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
				'productkit-for-woocommerce'
			),
			desc: __(
				'Customise appearance',
				'productkit-for-woocommerce'
			),
		},
		{
			icon: 'admin-generic',
			to: '/settings',
			title: __( 'Settings', 'productkit-for-woocommerce' ),
			desc: __(
				'Configure the plugin',
				'productkit-for-woocommerce'
			),
		},
		{
			icon: 'chart-bar',
			to: '/analytics',
			title: __( 'Analytics', 'productkit-for-woocommerce' ),
			desc: __(
				'View performance reports',
				'productkit-for-woocommerce'
			),
		},
		{
			icon: 'admin-network',
			to: '/license',
			title: __( 'License', 'productkit-for-woocommerce' ),
			desc: proActive
				? __(
						'Manage activation',
						'productkit-for-woocommerce'
				  )
				: __(
						'Activate Pro',
						'productkit-for-woocommerce'
				  ),
		},
	];

	return (
		<section className="pkitfw-db-card pkitfw-db-panel">
			<header className="pkitfw-db-panel__head">
				<h2 className="pkitfw-db-panel__title">
					<span
						className="dashicons dashicons-superhero-alt pkitfw-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Quick Actions',
						'productkit-for-woocommerce'
					) }
				</h2>
			</header>

			<nav className="pkitfw-db-actions">
				{ actions.map( ( a ) => (
					<button
						key={ a.to }
						type="button"
						className="pkitfw-db-action"
						onClick={ () => navigate( a.to ) }
					>
						<span
							className="pkitfw-db-action__icon"
							aria-hidden="true"
						>
							<span
								className={ `dashicons dashicons-${ a.icon }` }
							/>
						</span>
						<span className="pkitfw-db-action__text">
							<span className="pkitfw-db-action__title">
								{ a.title }
							</span>
							<span className="pkitfw-db-action__desc">
								{ a.desc }
							</span>
						</span>
						<span
							className="dashicons dashicons-arrow-right-alt2 pkitfw-db-action__chev"
							aria-hidden="true"
						/>
					</button>
				) ) }
			</nav>
		</section>
	);
}
