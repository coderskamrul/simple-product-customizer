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
		label: __( 'Dashboard', 'productkit-for-woocommerce' ),
		icon: 'dashboard',
	},
	{
		route: 'sets',
		hash: '#/sets',
		label: __( 'Option Sets', 'productkit-for-woocommerce' ),
		icon: 'screenoptions',
	},
	{
		route: 'settings',
		hash: '#/settings',
		label: __( 'Settings', 'productkit-for-woocommerce' ),
		icon: 'admin-generic',
	},
	{
		route: 'analytics',
		hash: '#/analytics',
		label: __( 'Analytics', 'productkit-for-woocommerce' ),
		icon: 'chart-bar',
	},
	{
		route: 'license',
		hash: '#/license',
		label: __( 'License', 'productkit-for-woocommerce' ),
		icon: 'admin-network',
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
			className="pkitfw-sidebar"
			aria-label={ __(
				'ProductKit navigation',
				'productkit-for-woocommerce'
			) }
		>
			<div className="pkitfw-sidebar__brand">
				<span
					className="dashicons dashicons-cart pkitfw-sidebar__logo"
					aria-hidden="true"
				/>
				<span className="pkitfw-sidebar__name">
					{ __(
						'Dynamic Options',
						'productkit-for-woocommerce'
					) }
				</span>
			</div>
			<ul className="pkitfw-sidebar__nav">
				{ NAV.map( ( item ) => (
					<li key={ item.route }>
						<a
							href={ item.hash }
							className={ `pkitfw-sidebar__link${
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
