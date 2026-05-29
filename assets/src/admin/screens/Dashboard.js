/**
 * Dashboard screen — wired into the unified PageFrame. The top-level
 * welcome / CTA used to live in DashboardHeader; that role moved to the
 * shared TopBar (logo + version + tabs + context CTA), so here we just
 * render the page title row and the data widgets.
 *
 * @package DPO\Admin
 */

import { __, sprintf } from '@wordpress/i18n';
import { useConfig } from '../store/ConfigContext';
import { PageFrame } from '../components';
import useDashboard from './dashboard/useDashboard';
import StatStrip from './dashboard/StatStrip';
import GettingStarted from './dashboard/GettingStarted';
import QuickActions from './dashboard/QuickActions';
import RecentActivity from './dashboard/RecentActivity';
import TopPerformers from './dashboard/TopPerformers';
import ProCard from './dashboard/ProCard';
import { StripSkeleton, PanelSkeleton } from './dashboard/Skeletons';

/**
 * Dashboard.
 *
 * @return {JSX.Element} The dashboard screen.
 */
export default function Dashboard() {
	const { proActive, user } = useConfig();
	const name = user && user.name ? user.name : '';

	const {
		status,
		error,
		totals,
		deltas,
		setsCount,
		publishedCount,
		cartRate,
		activity,
		performers,
		checklist,
		progress,
	} = useDashboard();

	const loading = status === 'loading';
	const failed = status === 'error';

	const title = name
		? sprintf(
				/* translators: %s: display name */
				__( 'Welcome back, %s', 'dynamic-product-options-for-woocommerce' ),
				name
		  )
		: __( 'Welcome back', 'dynamic-product-options-for-woocommerce' );

	return (
		<PageFrame
		>
			{ failed ? (
				<div className="dpo-db-card dpo-db-state">
					<p className="dpo-error">{ error }</p>
				</div>
			) : loading ? (
				<StripSkeleton />
			) : (
				<StatStrip
					totals={ totals }
					deltas={ deltas }
					setsCount={ setsCount }
					publishedCount={ publishedCount }
					cartRate={ cartRate }
				/>
			) }

			<div className="dpo-db-grid dpo-db-grid--main">
				{ loading ? (
					<PanelSkeleton rows={ 4 } />
				) : (
					! failed && (
						<GettingStarted
							checklist={ checklist }
							progress={ progress }
						/>
					)
				) }
				<QuickActions />
			</div>

			<div className="dpo-db-grid dpo-db-grid--bottom">
				{ loading ? (
					<>
						<PanelSkeleton rows={ 4 } />
						<PanelSkeleton rows={ 3 } />
					</>
				) : (
					! failed && (
						<>
							<RecentActivity activity={ activity } />
							<TopPerformers performers={ performers } />
						</>
					)
				) }

				{ ! proActive && <ProCard /> }
			</div>
		</PageFrame>
	);
}
