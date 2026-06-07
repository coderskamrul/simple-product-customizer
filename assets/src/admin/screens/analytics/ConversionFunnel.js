/**
 * Conversion funnel — a segmented SVG donut over the four journey stages
 * (Viewed → Clicked → Added to Cart → Purchased). Hovering or focusing a
 * segment (or its legend row) highlights it and swaps the centre readout;
 * the ring sweeps in on mount.
 *
 * @package
 */

import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { EmptyState } from '../../components';

const SIZE = 200;
const STROKE = 26;
const R = ( SIZE - STROKE ) / 2;
const C = 2 * Math.PI * R;
const GAP = 0.04 * C; // visual separator between arcs

/**
 * ConversionFunnel.
 *
 * @param {Object} props        Component props.
 * @param {Object} props.funnel { viewed, clicked, carted, purchased }.
 * @return {JSX.Element} The funnel card body.
 */
export default function ConversionFunnel( { funnel } ) {
	const [ active, setActive ] = useState( null );

	const stages = useMemo(
		() => [
			{
				key: 'viewed',
				tone: 'blue',
				label: __(
					'Viewed',
					'productkit-for-woocommerce'
				),
				value: funnel.viewed,
			},
			{
				key: 'clicked',
				tone: 'purple',
				label: __(
					'Clicked',
					'productkit-for-woocommerce'
				),
				value: funnel.clicked,
			},
			{
				key: 'carted',
				tone: 'violet',
				label: __(
					'Added to Cart',
					'productkit-for-woocommerce'
				),
				value: funnel.carted,
			},
			{
				key: 'purchased',
				tone: 'pink',
				label: __(
					'Purchased',
					'productkit-for-woocommerce'
				),
				value: funnel.purchased,
			},
		],
		[ funnel ]
	);

	const total = stages.reduce( ( a, s ) => a + ( s.value || 0 ), 0 );

	const arcs = useMemo( () => {
		if ( total <= 0 ) {
			return [];
		}
		let offset = 0;
		return stages.map( ( s ) => {
			const frac = ( s.value || 0 ) / total;
			const len = Math.max( 0, frac * C - GAP );
			const arc = {
				...s,
				dash: `${ len } ${ C - len }`,
				offset: -offset,
			};
			offset += frac * C;
			return arc;
		} );
	}, [ stages, total ] );

	if ( total <= 0 ) {
		return (
			<EmptyState
				icon="chart-pie"
				title={ __(
					'No journey data yet',
					'productkit-for-woocommerce'
				) }
				text={ __(
					'Stages populate as shoppers move from view to purchase.',
					'productkit-for-woocommerce'
				) }
			/>
		);
	}

	const focused = active ? stages.find( ( s ) => s.key === active ) : null;
	const centerValue = focused
		? focused.value
		: stages[ 0 ].value; /* default: Viewed */
	const centerLabel = focused
		? focused.label
		: __( 'Total viewed', 'productkit-for-woocommerce' );
	const centerPct =
		focused && total > 0
			? Math.round( ( focused.value / total ) * 100 )
			: null;

	return (
		<div className="pkitfw-an-funnel">
			<div className="pkitfw-an-funnel__chart">
				<svg
					viewBox={ `0 0 ${ SIZE } ${ SIZE }` }
					role="img"
					aria-label={ __(
						'Conversion funnel from viewed to purchased',
						'productkit-for-woocommerce'
					) }
				>
					<circle
						cx={ SIZE / 2 }
						cy={ SIZE / 2 }
						r={ R }
						className="pkitfw-an-funnel__track"
						strokeWidth={ STROKE }
						fill="none"
					/>
					<g className="pkitfw-an-funnel__ring">
						{ arcs.map( ( a ) => {
							const dim = active && active !== a.key;
							return (
								<circle
									key={ a.key }
									cx={ SIZE / 2 }
									cy={ SIZE / 2 }
									r={ R }
									fill="none"
									strokeWidth={ STROKE }
									strokeLinecap="round"
									strokeDasharray={ a.dash }
									strokeDashoffset={ a.offset }
									tabIndex={ 0 }
									role="img"
									aria-label={ `${ a.label }: ${ Number(
										a.value || 0
									).toLocaleString() }` }
									onMouseEnter={ () => setActive( a.key ) }
									onMouseLeave={ () => setActive( null ) }
									onFocus={ () => setActive( a.key ) }
									onBlur={ () => setActive( null ) }
									className={ `pkitfw-an-funnel__arc pkitfw-an-funnel__arc--${
										a.tone
									}${ active === a.key ? ' is-active' : '' }${
										dim ? ' is-dim' : ''
									}` }
								>
									<title>
										{ a.label }:{ ' ' }
										{ Number(
											a.value || 0
										).toLocaleString() }
									</title>
								</circle>
							);
						} ) }
					</g>
				</svg>

				<div className="pkitfw-an-funnel__center" aria-hidden="true">
					<span className="pkitfw-an-funnel__cval">
						{ Number( centerValue || 0 ).toLocaleString() }
					</span>
					<span className="pkitfw-an-funnel__clabel">
						{ centerLabel }
					</span>
					{ centerPct !== null && (
						<span className="pkitfw-an-funnel__cpct">
							{ centerPct }%
						</span>
					) }
				</div>
			</div>

			<dl className="pkitfw-an-funnel__legend">
				{ stages.map( ( s ) => (
					<div
						key={ s.key }
						className={ `pkitfw-an-funnel__item${
							active === s.key ? ' is-active' : ''
						}` }
						onMouseEnter={ () => setActive( s.key ) }
						onMouseLeave={ () => setActive( null ) }
					>
						<dt>
							<span
								className={ `pkitfw-an-dot pkitfw-an-dot--${ s.tone }` }
								aria-hidden="true"
							/>
							{ s.label }
						</dt>
						<dd>{ Number( s.value || 0 ).toLocaleString() }</dd>
					</div>
				) ) }
			</dl>
		</div>
	);
}
