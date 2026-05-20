/**
 * Dashboard screen — composition root only. All data lives in
 * useDashboard(); every visual concern is delegated to a presentational
 * component under ./dashboard so this file stays a readable layout map
 * (mirrors the Analytics screen architecture).
 *
 * @package DPO\Admin
 */

import { useConfig } from '../store/ConfigContext';
import useDashboard from './dashboard/useDashboard';
import DashboardHeader from './dashboard/DashboardHeader';
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
	const { proActive } = useConfig();
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

	return (
		<div className="dpo-db">
			<DashboardHeader />

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
		</div>
	);
}
