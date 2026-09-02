/**
 * Primary admin navigation rail.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/** Nav items: { route, hash, label, icon }. */
const NAV = [
	{
		route: 'dashboard',
		hash: '#/',
		label: __( 'Dashboard', 'simple-product-customizer' ),
		icon: 'dashboard',
	},
	{
		route: 'sets',
		hash: '#/sets',
		label: __( 'Option Sets', 'simple-product-customizer' ),
		icon: 'screenoptions',
	},
	{
		route: 'settings',
		hash: '#/settings',
		label: __( 'Settings', 'simple-product-customizer' ),
		icon: 'admin-generic',
	},
	{
		route: 'analytics',
		hash: '#/analytics',
		label: __( 'Analytics', 'simple-product-customizer' ),
		icon: 'chart-bar',
	},
];

/**
 * Sidebar.
 *
 * @param {Object} props        Component props.
 * @param {string} props.active Active route name.
 * @return {JSX.Element} The sidebar.
 */
export default function Sidebar( { active } ) {
	// Builder/assignment screens highlight the Option Sets entry.
	const current =
		active === 'builder' || active === 'assignment' ? 'sets' : active;

	return (
		<nav
			className="spcus-sidebar"
			aria-label={ __(
				'Simple Product Customizer navigation',
				'simple-product-customizer'
			) }
		>
			<div className="spcus-sidebar__brand">
				<span
					className="dashicons dashicons-cart spcus-sidebar__logo"
					aria-hidden="true"
				/>
				<span className="spcus-sidebar__name">
					{ __(
						'Dynamic Options',
						'simple-product-customizer'
					) }
				</span>
			</div>
			<ul className="spcus-sidebar__nav">
				{ NAV.map( ( item ) => (
					<li key={ item.route }>
						<a
							href={ item.hash }
							className={ `spcus-sidebar__link${
								current === item.route ? ' is-active' : ''
							}` }
							aria-current={
								current === item.route ? 'page' : undefined
							}
						>
							<span
								className={ `dashicons dashicons-${ item.icon }` }
								aria-hidden="true"
							/>
							<span>{ item.label }</span>
						</a>
					</li>
				) ) }
			</ul>
		</nav>
	);
}
