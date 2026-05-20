/**
 * The four-up headline stat strip — a single card divided into tinted
 * metric tiles (option sets, impressions, cart adds, revenue). Each tile
 * carries an honest secondary chip: real period deltas where the daily
 * series supports it, otherwise a contextual figure (live count / rate).
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { int, formatDelta } from './helpers';

/**
 * A signed trend chip (▲/▼ + %). Hidden entirely when the delta is null
 * (series too short) so we never show a misleading 0%.
 *
 * @param {Object}      props       Props.
 * @param {number|null} props.value Signed percentage.
 * @return {JSX.Element|null} The chip.
 */
function TrendChip( { value } ) {
	if ( value === null || value === undefined ) {
		return null;
	}
	const up = value >= 0;
	return (
		<span className={ `dpo-db-chip dpo-db-chip--${ up ? 'up' : 'down' }` }>
			<span
				className={ `dashicons dashicons-arrow-${
					up ? 'up' : 'down'
				}-alt` }
				aria-hidden="true"
			/>
			{ formatDelta( value ) }
		</span>
	);
}

/**
 * One stat tile.
 *
 * @param {Object}      props       Props.
 * @param {string}      props.tone  blue|purple|amber|green (icon theming).
 * @param {string}      props.icon  Dashicon slug.
 * @param {string}      props.label Metric name.
 * @param {string}      props.value Formatted figure.
 * @param {JSX.Element} props.chip  Secondary chip element (or falsy).
 * @return {JSX.Element} The tile.
 */
function StatTile( { tone, icon, label, value, chip } ) {
	return (
		<div className="dpo-db-stat">
			<span
				className={ `dpo-db-stat__icon dpo-db-stat__icon--${ tone }` }
				aria-hidden="true"
			>
				<span className={ `dashicons dashicons-${ icon }` } />
			</span>
			<div className="dpo-db-stat__body">
				<div className="dpo-db-stat__top">
					<span className="dpo-db-stat__value">{ value }</span>
					{ chip }
				</div>
				<span className="dpo-db-stat__label">{ label }</span>
			</div>
		</div>
	);
}

/**
 * StatStrip.
 *
 * @param {Object} props                Props.
 * @param {Object} props.totals         Summed metrics.
 * @param {Object} props.deltas         Signed deltas + revenueAbs.
 * @param {number} props.setsCount      Total option sets.
 * @param {number} props.publishedCount Published option sets.
 * @param {number} props.cartRate       Add-to-cart rate (%).
 * @return {JSX.Element} The strip.
 */
export default function StatStrip( {
	totals,
	deltas,
	setsCount,
	publishedCount,
	cartRate,
} ) {
	const { formatPrice } = useConfig();
	const revUp = deltas.revenueAbs >= 0;

	const cards = [
		{
			tone: 'blue',
			icon: 'screenoptions',
			label: __(
				'Option Sets',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( setsCount ),
			chip: publishedCount > 0 && (
				<span className="dpo-db-chip dpo-db-chip--neutral">
					{ /* translators: %d: published count */ }
					{ `${ int( publishedCount ) } ${ __(
						'live',
						'dynamic-product-options-for-woocommerce'
					) }` }
				</span>
			),
		},
		{
			tone: 'purple',
			icon: 'visibility',
			label: __(
				'Total Impressions',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( totals.impressions ),
			chip: <TrendChip value={ deltas.impressions } />,
		},
		{
			tone: 'amber',
			icon: 'cart',
			label: __(
				'Add to Cart',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( totals.add_to_cart ),
			chip: ( totals.impressions || 0 ) > 0 && (
				<span className="dpo-db-chip dpo-db-chip--neutral">
					{ `${ cartRate }%` }
				</span>
			),
		},
		{
			tone: 'green',
			icon: 'money-alt',
			label: __(
				'Revenue Generated',
				'dynamic-product-options-for-woocommerce'
			),
			value: formatPrice( totals.revenue ),
			chip: deltas.revenueAbs !== 0 && (
				<span
					className={ `dpo-db-chip dpo-db-chip--${
						revUp ? 'up' : 'down'
					}` }
				>
					<span
						className={ `dashicons dashicons-arrow-${
							revUp ? 'up' : 'down'
						}-alt` }
						aria-hidden="true"
					/>
					{ `${ revUp ? '+' : '-' }${ formatPrice(
						Math.abs( deltas.revenueAbs )
					) }` }
				</span>
			),
		},
	];

	return (
		<section
			className="dpo-db-strip"
			aria-label={ __(
				'Key metrics',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			{ cards.map( ( c ) => (
				<StatTile key={ c.label } { ...c } />
			) ) }
		</section>
	);
}
