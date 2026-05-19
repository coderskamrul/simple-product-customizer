/**
 * The four-up KPI row. Each meter encodes the funnel-stage conversion the
 * card represents (real ratios, not decoration) so the bar stays honest.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { ratio } from './helpers';
import KpiCard from './KpiCard';

/**
 * Locale integer with thousands grouping.
 *
 * @param {number} n Value.
 * @return {string} Grouped integer.
 */
const int = ( n ) => Number( n || 0 ).toLocaleString();

/**
 * KpiGrid.
 *
 * @param {Object} props        Component props.
 * @param {Object} props.totals Summed metrics for the range.
 * @param {Object} props.deltas Signed period deltas per metric.
 * @return {JSX.Element} The KPI grid.
 */
export default function KpiGrid( { totals, deltas } ) {
	const { formatPrice } = useConfig();
	const t = totals;

	const cards = [
		{
			tone: 'blue',
			icon: 'buddicons-activity',
			label: __(
				'Total Clicks',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( t.clicks ),
			delta: deltas.clicks,
			meter: ratio( t.clicks, t.impressions ),
			meterLabel: __(
				'Click-through rate',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			tone: 'purple',
			icon: 'cart',
			label: __(
				'Cart Additions',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( t.add_to_cart ),
			delta: deltas.add_to_cart,
			meter: ratio( t.add_to_cart, t.clicks ),
			meterLabel: __(
				'Add-to-cart rate',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			tone: 'pink',
			icon: 'products',
			label: __(
				'Completed Sales',
				'dynamic-product-options-for-woocommerce'
			),
			value: int( t.orders ),
			delta: deltas.orders,
			meter: ratio( t.orders, t.add_to_cart ),
			meterLabel: __(
				'Checkout rate',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			tone: 'green',
			icon: 'money-alt',
			label: __(
				'Revenue',
				'dynamic-product-options-for-woocommerce'
			),
			value: formatPrice( t.revenue ),
			delta: deltas.revenue,
			meter: ratio( t.orders, t.impressions ),
			meterLabel: __(
				'Overall conversion rate',
				'dynamic-product-options-for-woocommerce'
			),
		},
	];

	return (
		<div className="dpo-an-kpis">
			{ cards.map( ( c ) => (
				<KpiCard key={ c.tone } { ...c } />
			) ) }
		</div>
	);
}
