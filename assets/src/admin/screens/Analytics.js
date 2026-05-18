/**
 * Analytics screen — per-set table (impressions/clicks/atc/orders/revenue/
 * ctr) plus a hand-rolled inline SVG line+bar chart of the daily series.
 * No chart library.
 *
 * @package DPO\Admin
 */

import { useState, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import { useConfig } from '../store/ConfigContext';
import { Panel, Spinner, EmptyState } from '../components';

/**
 * Hand-rolled SVG chart: revenue line over a daily impressions bar series.
 *
 * @param {Object} props       Component props.
 * @param {Array}  props.daily Daily rows [{day,impressions,revenue,...}].
 * @return {JSX.Element} The chart.
 */
function Chart( { daily } ) {
	const W = 720;
	const H = 220;
	const pad = 32;

	const { bars, line, maxImp, maxRev } = useMemo( () => {
		const maxI = Math.max( 1, ...daily.map( ( d ) => d.impressions ) );
		const maxR = Math.max( 1, ...daily.map( ( d ) => d.revenue ) );
		const innerW = W - pad * 2;
		const innerH = H - pad * 2;
		const step = daily.length > 1 ? innerW / ( daily.length - 1 ) : 0;
		const bw = Math.max(
			2,
			Math.min( 28, ( innerW / Math.max( daily.length, 1 ) ) * 0.6 )
		);

		const barRects = daily.map( ( d, i ) => {
			const h = ( d.impressions / maxI ) * innerH;
			return {
				x: pad + i * step - bw / 2,
				y: H - pad - h,
				w: bw,
				h,
				day: d.day,
			};
		} );

		const pts = daily.map( ( d, i ) => {
			const x = pad + i * step;
			const y = H - pad - ( d.revenue / maxR ) * innerH;
			return `${ x },${ y }`;
		} );

		return {
			bars: barRects,
			line: pts.join( ' ' ),
			maxImp: maxI,
			maxRev: maxR,
		};
	}, [ daily ] );

	if ( ! daily.length ) {
		return (
			<p className="dpo-hint">
				{ __(
					'No daily data yet.',
					'dynamic-product-options-for-woocommerce'
				) }
			</p>
		);
	}

	return (
		<svg
			className="dpo-chart"
			viewBox={ `0 0 ${ W } ${ H }` }
			role="img"
			aria-label={ __(
				'Daily impressions and revenue chart',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<line
				x1={ pad }
				y1={ H - pad }
				x2={ W - pad }
				y2={ H - pad }
				className="dpo-chart__axis"
			/>
			{ bars.map( ( b, i ) => (
				<rect
					key={ i }
					x={ b.x }
					y={ b.y }
					width={ b.w }
					height={ b.h }
					className="dpo-chart__bar"
				>
					<title>{ b.day }</title>
				</rect>
			) ) }
			<polyline
				className="dpo-chart__line"
				fill="none"
				points={ line }
			/>
			<text x={ pad } y={ 16 } className="dpo-chart__legend">
				{ __(
					'Bars: impressions',
					'dynamic-product-options-for-woocommerce'
				) }{ ' ' }
				· { __(
					'Line: revenue',
					'dynamic-product-options-for-woocommerce'
				) }{ ' ' }
				({ maxImp } / { maxRev })
			</text>
		</svg>
	);
}

/**
 * Analytics.
 *
 * @return {JSX.Element} The screen.
 */
export default function Analytics() {
	const { formatPrice } = useConfig();
	const [ status, setStatus ] = useState( 'loading' );
	const [ error, setError ] = useState( '' );
	const [ table, setTable ] = useState( [] );
	const [ daily, setDaily ] = useState( [] );

	useEffect( () => {
		let cancelled = false;
		api.getAnalytics()
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				setTable( res.table || [] );
				setDaily( res.daily || [] );
				setStatus( 'ready' );
			} )
			.catch( ( e ) => {
				if ( cancelled ) {
					return;
				}
				setError( errorMessage( e ) );
				setStatus( 'error' );
			} );
		return () => {
			cancelled = true;
		};
	}, [] );

	return (
		<div className="dpo-analytics">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Analytics',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
					<p className="dpo-screen-sub">
						{ __(
							'Impressions, clicks, add-to-cart and revenue per option set.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
			</header>

			{ status === 'loading' && (
				<Panel>
					<Spinner />
				</Panel>
			) }
			{ status === 'error' && (
				<Panel>
					<p className="dpo-error">{ error }</p>
				</Panel>
			) }

			{ status === 'ready' && (
				<>
					<Panel
						title={ __(
							'Daily trend',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<Chart daily={ daily } />
					</Panel>

					<Panel
						title={ __(
							'By option set',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						{ table.length === 0 ? (
							<EmptyState
								icon="chart-bar"
								title={ __(
									'No data recorded yet',
									'dynamic-product-options-for-woocommerce'
								) }
								text={ __(
									'Stats appear once shoppers view products with option sets.',
									'dynamic-product-options-for-woocommerce'
								) }
							/>
						) : (
							<table className="dpo-table">
								<thead>
									<tr>
										<th>
											{ __(
												'Option set',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'Impressions',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'Clicks',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'Add to cart',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'Orders',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'Revenue',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
										<th>
											{ __(
												'CTR',
												'dynamic-product-options-for-woocommerce'
											) }
										</th>
									</tr>
								</thead>
								<tbody>
									{ table.map( ( row ) => (
										<tr key={ row.set_id }>
											<td>
												{ row.title ||
													`#${ row.set_id }` }
											</td>
											<td>
												{ row.impressions }
											</td>
											<td>{ row.clicks }</td>
											<td>
												{ row.add_to_cart }
											</td>
											<td>{ row.orders }</td>
											<td>
												{ formatPrice(
													row.revenue
												) }
											</td>
											<td>{ row.ctr }%</td>
										</tr>
									) ) }
								</tbody>
							</table>
						) }
					</Panel>
				</>
			) }
		</div>
	);
}
