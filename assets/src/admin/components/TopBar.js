/**
 * Unified premium TopBar — single navigation chrome shared by every screen.
 *
 * Layout (matches the reference SaaS dashboard):
 *
 *   [ Logo + version pill ]  [ + context CTA ]   [ tabs… ]
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
		label: __( 'Dashboard', 'simple-product-customizer' ),
	},
	{
		route: 'sets',
		hash: '#/sets',
		label: __( 'Option Sets', 'simple-product-customizer' ),
	},
	{
		route: 'analytics',
		hash: '#/analytics',
		label: __( 'Analytics', 'simple-product-customizer' ),
	},
	{
		route: 'settings',
		hash: '#/settings',
		label: __( 'Settings', 'simple-product-customizer' ),
	},
];

/**
 * Resolve the context-aware primary CTA for the active route. Returns null
 * on screens that have no obvious "create" action (Dashboard's create lives
 * on the screen itself; Analytics is read-only).
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
					'simple-product-customizer'
				),
				onClick: () => navigate( '/set/new' ),
			};
		case 'dashboard':
			return {
				label: __(
					'New Option Set',
					'simple-product-customizer'
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
	const { version } = useConfig();
	const route = useRouter();
	const cta = resolveCTA( route.name );
	const current = activeTab( route.name );

	return (
		<header className="spcus-topbar" role="banner">
			{ /* Left — brand + version pill + (context CTA) ------------- */ }
			<div className="spcus-topbar__lead">
				<a
					href="#/"
					className="spcus-topbar__brand"
					aria-label={ __(
						'Simple Product Customizer home',
						'simple-product-customizer'
					) }
				>
					<span className="spcus-topbar__logo" aria-hidden="true">
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
						<span className="spcus-topbar__version">{ version }</span>
					) }
				</a>

				{ cta && (
					<button
						type="button"
						className="spcus-topbar__cta"
						onClick={ cta.onClick }
					>
						<span aria-hidden="true">+</span>
						<span>{ cta.label }</span>
					</button>
				) }
			</div>

			{ /* Center — tabs ------------------------------------------- */ }
			<nav
				className="spcus-topbar__tabs"
				aria-label={ __(
					'Primary',
					'simple-product-customizer'
				) }
			>
				{ TABS.map( ( t ) => {
					const isActive = current === t.route;
					return (
						<a
							key={ t.route }
							href={ t.hash }
							className={ `spcus-topbar__tab${
								isActive ? ' is-active' : ''
							}` }
							aria-current={ isActive ? 'page' : undefined }
						>
							{ t.label }
						</a>
					);
				} ) }
			</nav>

		</header>
	);
}
