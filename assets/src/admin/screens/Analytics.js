/**
 * Analytics screen — composition root only. All data lives in
 * useAnalytics(); every visual concern is delegated to a presentational
 * component under ./analytics so this file stays a readable layout map.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { Spinner } from '../components';
import useAnalytics from './analytics/useAnalytics';
import AnalyticsHeader from './analytics/AnalyticsHeader';
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
		<div className="dpo-an">
			<AnalyticsHeader
				range={ range }
				onRange={ setRange }
				busy={ loading }
			/>

			{ status === 'error' ? (
				<div className="dpo-an-card dpo-an-state">
					<p className="dpo-error">{ error }</p>
				</div>
			) : loading ? (
				<div className="dpo-an-card dpo-an-state">
					<Spinner />
				</div>
			) : (
				<>
					<KpiGrid totals={ totals } deltas={ deltas } />

					<div className="dpo-an-split">
						<section className="dpo-an-card dpo-an-panel dpo-an-panel--chart">
							<header className="dpo-an-panel__head">
								<div>
									<h2 className="dpo-an-panel__title">
										{ __(
											'Performance Trend',
											'dynamic-product-options-for-woocommerce'
										) }
									</h2>
									<p className="dpo-an-panel__sub">
										{ __(
											'Daily activity breakdown',
											'dynamic-product-options-for-woocommerce'
										) }
									</p>
								</div>
								<ul className="dpo-an-legend">
									{ TREND_SERIES.map( ( s ) => (
										<li key={ s.key }>
											<span
												className={ `dpo-an-dot dpo-an-dot--${ s.tone }` }
												aria-hidden="true"
											/>
											{ s.label }
										</li>
									) ) }
								</ul>
							</header>
							<TrendChart daily={ daily } />
						</section>

						<section className="dpo-an-card dpo-an-panel dpo-an-panel--funnel">
							<header className="dpo-an-panel__head">
								<div>
									<h2 className="dpo-an-panel__title">
										{ __(
											'Conversion Funnel',
											'dynamic-product-options-for-woocommerce'
										) }
									</h2>
									<p className="dpo-an-panel__sub">
										{ __(
											'User journey breakdown',
											'dynamic-product-options-for-woocommerce'
										) }
									</p>
								</div>
							</header>
							<ConversionFunnel funnel={ funnel } />
						</section>
					</div>
				</>
			) }

			<OptionTable status={ status } error={ error } rows={ table } />
		</div>
	);
}
