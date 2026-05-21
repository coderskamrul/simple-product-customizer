/**
 * Root application: providers + layout (topbar / screen outlet)
 * and the hash-route → screen mapping.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { ConfigProvider, useConfig } from '../store/ConfigContext';
import { ToastProvider } from '../store/ToastContext';
import { useRouter } from './router';
import { ToastStack } from '../components';
import Dashboard from '../screens/Dashboard';
import OptionSet from '../screens/OptionSet';
import Builder from '../screens/Builder';
import Assignment from '../screens/Assignment';
import GlobalStyle from '../screens/GlobalStyle';
import Settings from '../screens/Settings';
import Analytics from '../screens/Analytics';
import License from '../screens/License';

/**
 * Resolve the active route to a screen element.
 *
 * @param {Object} route Router descriptor.
 * @return {JSX.Element} The screen.
 */
function Screen( { route } ) {
	switch ( route.name ) {
		case 'sets':
			return <OptionSet />;
		case 'builder':
			return <Builder setId={ route.params.id } />;
		case 'assignment':
			return <Assignment setId={ route.params.id } />;
		case 'style':
			return <GlobalStyle />;
		case 'settings':
			return <Settings />;
		case 'analytics':
			return <Analytics />;
		case 'license':
			return <License />;
		case 'dashboard':
		default:
			return <Dashboard />;
	}
}

/**
 * Layout shell — topbar + outlet. The builder is a
 * full-bleed screen (no inner padding) so its three panes can fill height.
 *
 * @return {JSX.Element} The shell.
 */
function Shell() {
	const route = useRouter();
	const { proActive } = useConfig();
	const isBuilder = route.name === 'builder';

	return (
		<div className="dpo-app">
			<header className="dpo-app__topbar" role="banner">
				<div className="dpo-app__brand">
					<span className="dpo-app__brand-icon" aria-hidden="true">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 2.5 3 7v10l9 4.5L21 17V7l-9-4.5Z"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinejoin="round"
							/>
							<path
								d="M3 7l9 4.5L21 7M12 11.5V21"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinejoin="round"
							/>
							<path
								d="M7.5 4.75 16.5 9.25"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
							/>
						</svg>
					</span>
					<div className="dpo-app__brand-text">
						<span className="dpo-app__brand-title">
							{ __(
								'Product Options Manager',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
						<span className="dpo-app__brand-sub">
							{ __(
								'for WooCommerce',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
					</div>
				</div>
				<div className="dpo-app__topbar-actions">
					{ proActive ? (
						<span className="dpo-app__plan dpo-app__plan--pro">
							{ __(
								'Pro',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
					) : (
						<a
							className="dpo-app__upgrade"
							href="https://wpdeveloper.com/in/upgrade-dynamic-product-options"
							target="_blank"
							rel="noopener noreferrer"
						>
							<svg
								className="dpo-app__upgrade-icon"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									d="M3 7.5 7.5 12 12 5l4.5 7L21 7.5 19 18H5L3 7.5Z"
									fill="currentColor"
								/>
							</svg>
							<span>
								{ __(
									'Upgrade',
									'dynamic-product-options-for-woocommerce'
								) }
							</span>
						</a>
					) }
				</div>
			</header>
			<main
				className={ `dpo-app__outlet${
					isBuilder
						? ' dpo-app__outlet--bleed'
						: ''
				}` }
			>
				<Screen route={ route } />
			</main>
			<ToastStack />
		</div>
	);
}

/**
 * App — top-level provider stack.
 *
 * @return {JSX.Element} The application.
 */
export default function App() {
	return (
		<ConfigProvider>
			<ToastProvider>
				<Shell />
			</ToastProvider>
		</ConfigProvider>
	);
}
