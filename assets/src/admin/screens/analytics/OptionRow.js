/**
 * One option-performance row. Cells carry `data-label` so the table can
 * reflow into stacked cards on small screens (same pattern as Option Sets).
 *
 * The "CTR" column reuses the reference's trend-pill styling but stays
 * honestly labelled — per-set time series are not exposed by the API.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { Avatar } from '../../components';
import { ratio } from './helpers';
import Ring from './Ring';

/**
 * OptionRow.
 *
 * @param {Object} props     Component props.
 * @param {Object} props.row Analytics table row.
 * @param {Object} props.max { clicks, revenue } column maxima for meters.
 * @return {JSX.Element} The table row.
 */
export default function OptionRow( { row, max } ) {
	const { formatPrice } = useConfig();
	const title =
		row.title ||
		sprintf(
			/* translators: %d: option set id */
			__( 'Option set #%d', 'productkit-for-woocommerce' ),
			row.set_id
		);

	const cartRate = ratio( row.add_to_cart, row.clicks );
	const conversion = ratio( row.orders, row.add_to_cart );
	const ctr = Math.round( Number( row.ctr ) || 0 );
	const clicksW = ratio( row.clicks, max.clicks );
	const revW = ratio( row.revenue, max.revenue );
	const ctrUp = ctr > 0;

	const code = `OPT-${ String( row.set_id ).padStart( 3, '0' ) }`;

	return (
		<tr className="pkitfw-an-row">
			<td
				className="pkitfw-an-cell pkitfw-an-cell--option"
				data-label={ __(
					'Option details',
					'productkit-for-woocommerce'
				) }
			>
				<span className="pkitfw-an-option">
					<Avatar label={ title } seed={ row.set_id } />
					<span className="pkitfw-an-option__meta">
						<span className="pkitfw-an-option__name">{ title }</span>
						<span className="pkitfw-an-option__code">{ code }</span>
					</span>
				</span>
			</td>

			<td
				className="pkitfw-an-cell pkitfw-an-cell--num"
				data-label={ __(
					'Clicks',
					'productkit-for-woocommerce'
				) }
			>
				<span className="pkitfw-an-metric">
					<strong>
						{ Number( row.clicks || 0 ).toLocaleString() }
					</strong>
					<span className="pkitfw-an-bar">
						<span
							className="pkitfw-an-bar__fill pkitfw-an-bar__fill--blue"
							style={ { width: `${ clicksW }%` } }
						/>
					</span>
				</span>
			</td>

			<td
				className="pkitfw-an-cell pkitfw-an-cell--ring"
				data-label={ __(
					'Cart rate',
					'productkit-for-woocommerce'
				) }
			>
				<Ring value={ cartRate } tone="purple" />
			</td>

			<td
				className="pkitfw-an-cell pkitfw-an-cell--ring"
				data-label={ __(
					'Conversion',
					'productkit-for-woocommerce'
				) }
			>
				<Ring value={ conversion } tone="green" />
			</td>

			<td
				className="pkitfw-an-cell pkitfw-an-cell--num"
				data-label={ __(
					'Revenue',
					'productkit-for-woocommerce'
				) }
			>
				<span className="pkitfw-an-metric">
					<strong className="pkitfw-an-revenue">
						{ formatPrice( row.revenue ) }
					</strong>
					<span className="pkitfw-an-bar">
						<span
							className="pkitfw-an-bar__fill pkitfw-an-bar__fill--green"
							style={ { width: `${ revW }%` } }
						/>
					</span>
				</span>
			</td>

			<td
				className="pkitfw-an-cell pkitfw-an-cell--end"
				data-label={ __(
					'CTR',
					'productkit-for-woocommerce'
				) }
			>
				<span
					className={ `pkitfw-an-pill pkitfw-an-pill--${
						ctrUp ? 'up' : 'flat'
					}` }
				>
					<span
						className={ `dashicons dashicons-arrow-${
							ctrUp ? 'up' : 'right'
						}-alt` }
						aria-hidden="true"
					/>
					{ ctr }%
				</span>
			</td>
		</tr>
	);
}
