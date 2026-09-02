/**
 * Quick actions — a compact, keyboard-navigable launcher list that deep
 * links to the most-used admin screens.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { navigate } from '../../app/router';

/**
 * QuickActions.
 *
 * @return {JSX.Element} The panel.
 */
export default function QuickActions() {
	const actions = [
		{
			icon: 'art',
			to: '/style',
			title: __(
				'Global Styles',
				'simple-product-customizer'
			),
			desc: __(
				'Customise appearance',
				'simple-product-customizer'
			),
		},
		{
			icon: 'admin-generic',
			to: '/settings',
			title: __( 'Settings', 'simple-product-customizer' ),
			desc: __(
				'Configure the plugin',
				'simple-product-customizer'
			),
		},
		{
			icon: 'chart-bar',
			to: '/analytics',
			title: __( 'Analytics', 'simple-product-customizer' ),
			desc: __(
				'View performance reports',
				'simple-product-customizer'
			),
		},
	];

	return (
		<section className="spcus-db-card spcus-db-panel">
			<header className="spcus-db-panel__head">
				<h2 className="spcus-db-panel__title">
					<span
						className="dashicons dashicons-superhero-alt spcus-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Quick Actions',
						'simple-product-customizer'
					) }
				</h2>
			</header>

			<nav className="spcus-db-actions">
				{ actions.map( ( a ) => (
					<button
						key={ a.to }
						type="button"
						className="spcus-db-action"
						onClick={ () => navigate( a.to ) }
					>
						<span
							className="spcus-db-action__icon"
							aria-hidden="true"
						>
							<span
								className={ `dashicons dashicons-${ a.icon }` }
							/>
						</span>
						<span className="spcus-db-action__text">
							<span className="spcus-db-action__title">
								{ a.title }
							</span>
							<span className="spcus-db-action__desc">
								{ a.desc }
							</span>
						</span>
						<span
							className="dashicons dashicons-arrow-right-alt2 spcus-db-action__chev"
							aria-hidden="true"
						/>
					</button>
				) ) }
			</nav>
		</section>
	);
}
