/**
 * A single KPI stat card: tinted surface, icon tile, big figure, a signed
 * period delta and a thin meter encoding the relevant conversion rate.
 *
 * @package DPO\Admin
 */

import { formatDelta } from './helpers';

/**
 * KpiCard.
 *
 * @param {Object}      props          Component props.
 * @param {string}      props.tone     blue|purple|pink|green.
 * @param {string}      props.icon     Dashicon slug.
 * @param {string}      props.label    Metric name.
 * @param {string}      props.value    Formatted figure.
 * @param {number|null} props.delta    Signed % change (null → hidden).
 * @param {number}      props.meter    Meter fill 0–100 (conversion rate).
 * @param {string}      props.meterLabel Accessible meter description.
 * @return {JSX.Element} The card.
 */
export default function KpiCard( {
	tone,
	icon,
	label,
	value,
	delta,
	meter,
	meterLabel,
} ) {
	const up = delta !== null && delta >= 0;
	const deltaTone = delta === null ? 'flat' : up ? 'up' : 'down';

	return (
		<article className={ `dpo-an-kpi dpo-an-kpi--${ tone }` }>
			<div className="dpo-an-kpi__top">
				<span className="dpo-an-kpi__label">{ label }</span>
				<span className="dpo-an-kpi__icon" aria-hidden="true">
					<span className={ `dashicons dashicons-${ icon }` } />
				</span>
			</div>

			<div className="dpo-an-kpi__value">{ value }</div>

			{ delta !== null && (
				<div
					className={ `dpo-an-kpi__delta dpo-an-kpi__delta--${ deltaTone }` }
				>
					<span
						className={ `dashicons dashicons-arrow-${
							up ? 'up' : 'down'
						}-alt` }
						aria-hidden="true"
					/>
					<span>{ formatDelta( delta ) }</span>
				</div>
			) }

			<span
				className="dpo-an-kpi__meter"
				role="progressbar"
				aria-valuenow={ meter }
				aria-valuemin={ 0 }
				aria-valuemax={ 100 }
				aria-label={ meterLabel }
			>
				<span
					className="dpo-an-kpi__meterfill"
					style={ { width: `${ meter }%` } }
				/>
			</span>
		</article>
	);
}
