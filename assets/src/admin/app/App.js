/**
 * Root application: providers + layout (topbar / screen outlet)
 * and the hash-route → screen mapping.
 *
 * @package DPO\Admin
 */

import { ConfigProvider } from '../store/ConfigContext';
import { ToastProvider } from '../store/ToastContext';
import { useRouter } from './router';
import { ToastStack, TopBar } from '../components';
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
	const isBuilder = route.name === 'builder';

	// The top nav is hidden on the builder (option create) and
	// settings screens so they get the full canvas.
	const hideTopBar = isBuilder || route.name === 'settings';

	return (
		<div className="dpo-app">
			{ ! hideTopBar && <TopBar /> }
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
