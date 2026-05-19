/**
 * Performance trend — a hand-rolled, dependency-free SVG area chart of the
 * daily Clicks / Carts / Sales series with smooth Bézier curves, gradient
 * fills, a labelled grid, an entrance animation and an interactive
 * crosshair + tooltip. An accessible data-table fallback mirrors the data.
 *
 * No chart library: keeps the bundle lean and the styling on-system.
 *
 * @package DPO\Admin
 */

import { useMemo, useState, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { EmptyState } from '../../components';
import { niceCeil, dayLabel, smoothPath } from './helpers';

/** Series descriptors (paint order: first = back). */
const SERIES = [
	{
		key: 'clicks',
		tone: 'blue',
		label: __( 'Clicks', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		key: 'add_to_cart',
		tone: 'purple',
		label: __( 'Carts', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		key: 'orders',
		tone: 'green',
		label: __( 'Sales', 'dynamic-product-options-for-woocommerce' ),
	},
];

const W = 760;
const H = 300;
const PAD = { t: 16, r: 16, b: 34, l: 40 };

/**
 * TrendChart.
 *
 * @param {Object} props       Component props.
 * @param {Array}  props.daily Daily rows (ascending).
 * @return {JSX.Element} The chart card body.
 */
export default function TrendChart( { daily } ) {
	const { formatPrice } = useConfig();
	const svgRef = useRef( null );
	const [ hover, setHover ] = useState( null );

	const model = useMemo( () => {
		if ( ! daily.length ) {
			return null;
		}
		const innerW = W - PAD.l - PAD.r;
		const innerH = H - PAD.t - PAD.b;
		const max = niceCeil(
			Math.max(
				1,
				...daily.flatMap( ( d ) =>
					SERIES.map( ( s ) => Number( d[ s.key ] ) || 0 )
				)
			)
		);
		const n = daily.length;
		const xAt = ( i ) =>
			PAD.l + ( n === 1 ? innerW / 2 : ( i / ( n - 1 ) ) * innerW );
		const yAt = ( v ) => PAD.t + innerH - ( v / max ) * innerH;

		const series = SERIES.map( ( s ) => {
			const pts = daily.map( ( d, i ) => ( {
				x: xAt( i ),
				y: yAt( Number( d[ s.key ] ) || 0 ),
			} ) );
			const line = smoothPath( pts );
			const area =
				line +
				` L ${ pts[ pts.length - 1 ].x } ${ PAD.t + innerH }` +
				` L ${ pts[ 0 ].x } ${ PAD.t + innerH } Z`;
			return { ...s, pts, line, area };
		} );

		const yTicks = [ 0, 0.25, 0.5, 0.75, 1 ].map( ( f ) => ( {
			y: PAD.t + innerH - f * innerH,
			label: Math.round( max * f ),
		} ) );

		const xTicks = daily.map( ( d, i ) => ( {
			x: xAt( i ),
			label: dayLabel( d.day, n ),
		} ) );

		return {
			series,
			yTicks,
			xTicks,
			n,
			xAt,
			baseline: PAD.t + innerH,
			top: PAD.t,
		};
	}, [ daily ] );

	const onMove = useCallback(
		( e ) => {
			if ( ! model || ! svgRef.current ) {
				return;
			}
			const rect = svgRef.current.getBoundingClientRect();
			if ( ! rect.width ) {
				return;
			}
			const vbX = ( ( e.clientX - rect.left ) / rect.width ) * W;
			const ratioX =
				( vbX - PAD.l ) / Math.max( 1, W - PAD.l - PAD.r );
			const idx = Math.max(
				0,
				Math.min(
					model.n - 1,
					Math.round( ratioX * ( model.n - 1 ) )
				)
			);
			setHover( idx );
		},
		[ model ]
	);

	const clear = useCallback( () => setHover( null ), [] );

	if ( ! model ) {
		return (
			<EmptyState
				icon="chart-area"
				title={ __(
					'No activity yet',
					'dynamic-product-options-for-woocommerce'
				) }
				text={ __(
					'The trend appears once shoppers start interacting with your option sets.',
					'dynamic-product-options-for-woocommerce'
				) }
			/>
		);
	}

	const everyNth = Math.ceil( model.xTicks.length / 8 );
	const row = hover !== null ? daily[ hover ] : null;
	const hoverX = hover !== null ? model.xAt( hover ) : 0;
	const hoverPct = ( hoverX / W ) * 100;
	const tipSide = hoverPct > 60 ? 'left' : 'right';

	/**
	 * Display value for a series key (revenue uses the money formatter).
	 *
	 * @param {string} key Series key.
	 * @param {Object} r   Daily row.
	 * @return {string} Formatted value.
	 */
	const fmt = ( key, r ) =>
		key === 'revenue'
			? formatPrice( r[ key ] || 0 )
			: Number( r[ key ] || 0 ).toLocaleString();

	return (
		<figure className="dpo-an-chart">
			<svg
				ref={ svgRef }
				viewBox={ `0 0 ${ W } ${ H }` }
				className="dpo-an-chart__svg"
				preserveAspectRatio="none"
				role="img"
				aria-label={ __(
					'Daily clicks, cart additions and sales trend',
					'dynamic-product-options-for-woocommerce'
				) }
				onMouseMove={ onMove }
				onMouseLeave={ clear }
			>
				<defs>
					{ SERIES.map( ( s ) => (
						<linearGradient
							key={ s.tone }
							id={ `dpo-an-grad-${ s.tone }` }
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="0%"
								className={ `dpo-an-grad__a dpo-an-grad__a--${ s.tone }` }
							/>
							<stop
								offset="100%"
								className={ `dpo-an-grad__b dpo-an-grad__b--${ s.tone }` }
							/>
						</linearGradient>
					) ) }
				</defs>

				{ model.yTicks.map( ( tk, i ) => (
					<g key={ `y-${ i }` }>
						<line
							x1={ PAD.l }
							y1={ tk.y }
							x2={ W - PAD.r }
							y2={ tk.y }
							className="dpo-an-chart__grid"
						/>
						<text
							x={ PAD.l - 10 }
							y={ tk.y + 4 }
							className="dpo-an-chart__ylabel"
						>
							{ tk.label }
						</text>
					</g>
				) ) }

				<g className="dpo-an-chart__plot">
					{ model.series.map( ( s ) => (
						<path
							key={ `area-${ s.tone }` }
							d={ s.area }
							fill={ `url(#dpo-an-grad-${ s.tone })` }
							className="dpo-an-chart__area"
						/>
					) ) }
					{ model.series.map( ( s ) => (
						<path
							key={ `line-${ s.tone }` }
							d={ s.line }
							fill="none"
							className={ `dpo-an-chart__line dpo-an-chart__line--${ s.tone }` }
						/>
					) ) }
				</g>

				{ hover !== null && (
					<g className="dpo-an-chart__cursor">
						<line
							x1={ hoverX }
							y1={ model.top }
							x2={ hoverX }
							y2={ model.baseline }
							className="dpo-an-chart__crosshair"
						/>
						{ model.series.map( ( s ) => (
							<circle
								key={ `pt-${ s.tone }` }
								cx={ s.pts[ hover ].x }
								cy={ s.pts[ hover ].y }
								r={ 4 }
								className={ `dpo-an-chart__pt dpo-an-chart__pt--${ s.tone }` }
							/>
						) ) }
					</g>
				) }

				{ model.xTicks.map( ( tk, i ) =>
					i % everyNth === 0 ? (
						<text
							key={ `x-${ i }` }
							x={ tk.x }
							y={ H - 10 }
							className="dpo-an-chart__xlabel"
						>
							{ tk.label }
						</text>
					) : null
				) }
			</svg>

			{ row && (
				<div
					className={ `dpo-an-tip dpo-an-tip--${ tipSide }` }
					style={ { insetInlineStart: `${ hoverPct }%` } }
					role="status"
					aria-live="polite"
				>
					<span className="dpo-an-tip__title">
						{ row.day }
					</span>
					{ SERIES.map( ( s ) => (
						<span key={ s.key } className="dpo-an-tip__row">
							<span
								className={ `dpo-an-dot dpo-an-dot--${ s.tone }` }
								aria-hidden="true"
							/>
							<span className="dpo-an-tip__label">
								{ s.label }
							</span>
							<span className="dpo-an-tip__val">
								{ fmt( s.key, row ) }
							</span>
						</span>
					) ) }
				</div>
			) }

			<table className="dpo-visually-hidden">
				<caption>
					{ __(
						'Daily performance data',
						'dynamic-product-options-for-woocommerce'
					) }
				</caption>
				<thead>
					<tr>
						<th>
							{ __(
								'Day',
								'dynamic-product-options-for-woocommerce'
							) }
						</th>
						{ SERIES.map( ( s ) => (
							<th key={ s.key }>{ s.label }</th>
						) ) }
					</tr>
				</thead>
				<tbody>
					{ daily.map( ( d ) => (
						<tr key={ d.day }>
							<td>{ d.day }</td>
							{ SERIES.map( ( s ) => (
								<td key={ s.key }>{ d[ s.key ] || 0 }</td>
							) ) }
						</tr>
					) ) }
				</tbody>
			</table>
		</figure>
	);
}

export { SERIES as TREND_SERIES };
