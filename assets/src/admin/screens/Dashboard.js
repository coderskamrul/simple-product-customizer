/**
 * Dashboard screen — wired into the unified PageFrame. The top-level
 * welcome / CTA used to live in DashboardHeader; that role moved to the
 * shared TopBar (logo + version + tabs + context CTA), so here we just
 * render the page title row and the data widgets.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { useConfig } from '../store/ConfigContext';
import {
	PageFrame,
	SkeletonStatGrid,
	SkeletonCard,
	FadeIn,
} from '../components';
import useDashboard from './dashboard/useDashboard';
import StatStrip from './dashboard/StatStrip';
import GettingStarted from './dashboard/GettingStarted';
import QuickActions from './dashboard/QuickActions';
import RecentActivity from './dashboard/RecentActivity';
import TopPerformers from './dashboard/TopPerformers';
import ProCard from './dashboard/ProCard';

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
				__(
					'Welcome back, %s',
					'simple-product-customizer'
				),
				name
		  )
		: __( 'Welcome back', 'simple-product-customizer' );

	return (
		<PageFrame>
			{ failed ? (
				<div className="spcus-db-card spcus-db-state">
					<p className="spcus-error">{ error }</p>
				</div>
			) : loading ? (
				<SkeletonStatGrid count={ 4 } />
			) : (
				<FadeIn>
					<StatStrip
						totals={ totals }
						deltas={ deltas }
						setsCount={ setsCount }
						publishedCount={ publishedCount }
						cartRate={ cartRate }
					/>
				</FadeIn>
			) }

			<div className="spcus-db-grid spcus-db-grid--main">
				{ loading ? (
					<SkeletonCard lines={ 4 } action />
				) : (
					! failed && (
						<FadeIn>
							<GettingStarted
								checklist={ checklist }
								progress={ progress }
							/>
						</FadeIn>
					)
				) }
				<QuickActions />
			</div>

			<div className="spcus-db-grid spcus-db-grid--bottom">
				{ loading ? (
					<>
						<SkeletonCard lines={ 4 } />
						<SkeletonCard lines={ 3 } />
					</>
				) : (
					! failed && (
						<>
							<FadeIn>
								<RecentActivity activity={ activity } />
							</FadeIn>
							<FadeIn>
								<TopPerformers performers={ performers } />
							</FadeIn>
						</>
					)
				) }

				{ ! proActive && <ProCard /> }
			</div>
		</PageFrame>
	);
}
