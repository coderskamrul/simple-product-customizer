/**
 * Primary admin navigation rail.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';

/** Nav items: { route, hash, label, icon }. */
const NAV = [
	{ route: 'dashboard', hash: '#/', label: __( 'Dashboard', 'dynamic-product-options-for-woocommerce' ), icon: 'dashboard' },
	{ route: 'sets', hash: '#/sets', label: __( 'Option Sets', 'dynamic-product-options-for-woocommerce' ), icon: 'screenoptions' },
	{ route: 'style', hash: '#/style', label: __( 'Global Style', 'dynamic-product-options-for-woocommerce' ), icon: 'admin-customizer' },
	{ route: 'settings', hash: '#/settings', label: __( 'Settings', 'dynamic-product-options-for-woocommerce' ), icon: 'admin-generic' },
	{ route: 'analytics', hash: '#/analytics', label: __( 'Analytics', 'dynamic-product-options-for-woocommerce' ), icon: 'chart-bar' },
	{ route: 'license', hash: '#/license', label: __( 'License', 'dynamic-product-options-for-woocommerce' ), icon: 'admin-network' },
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
			className="dpo-sidebar"
			aria-label={ __(
				'Dynamic Product Options navigation',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<div className="dpo-sidebar__brand">
				<span
					className="dashicons dashicons-cart dpo-sidebar__logo"
					aria-hidden="true"
				/>
				<span className="dpo-sidebar__name">
					{ __(
						'Dynamic Options',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
			</div>
			<ul className="dpo-sidebar__nav">
				{ NAV.map( ( item ) => (
					<li key={ item.route }>
						<a
							href={ item.hash }
							className={ `dpo-sidebar__link${
								current === item.route
									? ' is-active'
									: ''
							}` }
							aria-current={
								current === item.route
									? 'page'
									: undefined
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
