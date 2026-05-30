/**
 * Unified premium TopBar — single navigation chrome shared by every screen.
 *
 * Layout (matches the reference SaaS dashboard):
 *
 *   [ Logo + version pill ]  [ + context CTA ]   [ tabs… ]   [ Upgrade Pro ]
 *
 * The TopBar is the ONLY top-level navigation in the admin SPA. All previous
 * per-screen headers (DashboardHeader, AnalyticsHeader, SettingsHeader, the
 * Option Sets head block) are superseded by it.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useConfig } from '../store/ConfigContext';
import { useRouter, navigate } from '../app/router';

/** Top-level tab registry. */
const TABS = [
	{
		route: 'dashboard',
		hash: '#/',
		label: __( 'Dashboard', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		route: 'sets',
		hash: '#/sets',
		label: __( 'Option Sets', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		route: 'analytics',
		hash: '#/analytics',
		label: __( 'Analytics', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		route: 'settings',
		hash: '#/settings',
		label: __( 'Settings', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		route: 'license',
		hash: '#/license',
		label: __( 'License', 'dynamic-product-options-for-woocommerce' ),
	},
];

/**
 * Resolve the context-aware primary CTA for the active route. Returns null
 * on screens that have no obvious "create" action (Dashboard's create lives
 * on the screen itself; Analytics/License are read-only).
 *
 * @param {string} routeName Active route descriptor name.
 * @return {?{label:string, onClick:Function}} CTA or null.
 */
function resolveCTA( routeName ) {
	switch ( routeName ) {
		case 'sets':
			return {
				label: __(
					'Create Option Set',
					'dynamic-product-options-for-woocommerce'
				),
				onClick: () => navigate( '/set/new' ),
			};
		case 'dashboard':
			return {
				label: __(
					'New Option Set',
					'dynamic-product-options-for-woocommerce'
				),
				onClick: () => navigate( '/set/new' ),
			};
		default:
			return null;
	}
}

/**
 * Match the active tab when nested routes are in play (builder/assignment
 * highlight "Option Sets").
 *
 * @param {string} routeName Active route name.
 * @return {string} Tab route key.
 */
function activeTab( routeName ) {
	if ( routeName === 'builder' || routeName === 'assignment' ) {
		return 'sets';
	}
	return routeName;
}

/**
 * TopBar.
 *
 * @return {JSX.Element} The unified top bar.
 */
export default function TopBar() {
	const { proActive, version } = useConfig();
	const route = useRouter();
	const cta = resolveCTA( route.name );
	const current = activeTab( route.name );

	return (
		<header className="dpo-topbar" role="banner">
			{ /* Left — brand + version pill + (context CTA) ------------- */ }
			<div className="dpo-topbar__lead">
				<a
					href="#/"
					className="dpo-topbar__brand"
					aria-label={ __(
						'Dynamic Product Options home',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<span className="dpo-topbar__logo" aria-hidden="true">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M12 2.5 3 7v10l9 4.5L21 17V7l-9-4.5Z"
								stroke="currentColor"
								strokeWidth="1.7"
								strokeLinejoin="round"
							/>
							<path
								d="M3 7l9 4.5L21 7M12 11.5V21"
								stroke="currentColor"
								strokeWidth="1.7"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					{ version && (
						<span className="dpo-topbar__version">{ version }</span>
					) }
				</a>

				{ cta && (
					<button
						type="button"
						className="dpo-topbar__cta"
						onClick={ cta.onClick }
					>
						<span aria-hidden="true">+</span>
						<span>{ cta.label }</span>
					</button>
				) }
			</div>

			{ /* Center — tabs ------------------------------------------- */ }
			<nav
				className="dpo-topbar__tabs"
				aria-label={ __(
					'Primary',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				{ TABS.map( ( t ) => {
					const isActive = current === t.route;
					return (
						<a
							key={ t.route }
							href={ t.hash }
							className={ `dpo-topbar__tab${
								isActive ? ' is-active' : ''
							}` }
							aria-current={ isActive ? 'page' : undefined }
						>
							{ t.label }
						</a>
					);
				} ) }
			</nav>

			{ /* Right — upgrade pill ------------------------------------ */ }
			<div className="dpo-topbar__trail">
				{ proActive ? (
					<span className="dpo-topbar__plan">
						{ __(
							'Pro',
							'dynamic-product-options-for-woocommerce'
						) }
					</span>
				) : (
					<a
						className="dpo-topbar__upgrade"
						href="https://wpdeveloper.com/in/upgrade-dynamic-product-options"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span>
							{ __(
								'Upgrade Pro',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M5 4h11l-1.5 4H18l-7 12 1.5-8H7l-2-8Z" />
						</svg>
					</a>
				) }
			</div>
		</header>
	);
}
