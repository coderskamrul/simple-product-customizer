/**
 * Analytics screen — wrapped in the unified PageFrame. The legacy
 * AnalyticsHeader was a bespoke branded header per screen; with the new
 * TopBar handling primary navigation, this screen now only renders its
 * title row (PageFrame) and the range-tabs control as the toolbar.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	PageFrame,
	SkeletonStatGrid,
	SkeletonChart,
	SkeletonCard,
	FadeIn,
} from '../components';
import useAnalytics from './analytics/useAnalytics';
import RangeTabs from './analytics/RangeTabs';
import KpiGrid from './analytics/KpiGrid';
import TrendChart, { TREND_SERIES } from './analytics/TrendChart';
import ConversionFunnel from './analytics/ConversionFunnel';
import OptionTable from './analytics/OptionTable';

/**
 * Analytics.
 *
 * @return {JSX.Element} The screen.
 */
export default function Analytics() {
	const {
		status,
		error,
		range,
		setRange,
		daily,
		table,
		totals,
		deltas,
		funnel,
	} = useAnalytics();

	const loading = status === 'loading';

	return (
		<PageFrame
			title={ __(
				'Analytics Overview',
				'productkit-for-woocommerce'
			) }
			subtitle={ __(
				'Track your option performance.',
				'productkit-for-woocommerce'
			) }
			toolbar={
				<RangeTabs
					value={ range }
					onChange={ setRange }
					busy={ loading }
				/>
			}
		>
			{ status === 'error' ? (
				<div className="pkitfw-an-card pkitfw-an-state">
					<p className="pkitfw-error">{ error }</p>
				</div>
			) : loading ? (
				<>
					<SkeletonStatGrid count={ 4 } />
					<div className="pkitfw-an-split">
						<SkeletonChart />
						<SkeletonChart />
					</div>
				</>
			) : (
				<FadeIn>
					<KpiGrid totals={ totals } deltas={ deltas } />

					<div className="pkitfw-an-split">
						<section className="pkitfw-an-card pkitfw-an-panel pkitfw-an-panel--chart">
							<header className="pkitfw-an-panel__head">
								<div>
									<h2 className="pkitfw-an-panel__title">
										{ __(
											'Performance Trend',
											'productkit-for-woocommerce'
										) }
									</h2>
									<p className="pkitfw-an-panel__sub">
										{ __(
											'Daily activity breakdown',
											'productkit-for-woocommerce'
										) }
									</p>
								</div>
								<ul className="pkitfw-an-legend">
									{ TREND_SERIES.map( ( s ) => (
										<li key={ s.key }>
											<span
												className={ `pkitfw-an-dot pkitfw-an-dot--${ s.tone }` }
												aria-hidden="true"
											/>
											{ s.label }
										</li>
									) ) }
								</ul>
							</header>
							<TrendChart daily={ daily } />
						</section>

						<section className="pkitfw-an-card pkitfw-an-panel pkitfw-an-panel--funnel">
							<header className="pkitfw-an-panel__head">
								<div>
									<h2 className="pkitfw-an-panel__title">
										{ __(
											'Conversion Funnel',
											'productkit-for-woocommerce'
										) }
									</h2>
									<p className="pkitfw-an-panel__sub">
										{ __(
											'User journey breakdown',
											'productkit-for-woocommerce'
										) }
									</p>
								</div>
							</header>
							<ConversionFunnel funnel={ funnel } />
						</section>
					</div>
				</FadeIn>
			) }

			{ loading ? (
				<SkeletonCard lines={ 6 } />
			) : (
				<FadeIn>
					<OptionTable
						status={ status }
						error={ error }
						rows={ table }
					/>
				</FadeIn>
			) }
		</PageFrame>
	);
}
