/**
 * Screen header — branded icon tile, title/subtitle and the range control.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import RangeTabs from './RangeTabs';

/**
 * AnalyticsHeader.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.range    Active range id.
 * @param {Function} props.onRange  (id) => void.
 * @param {boolean}  [props.busy]   Whether a fetch is in flight.
 * @return {JSX.Element} The header.
 */
export default function AnalyticsHeader( { range, onRange, busy } ) {
	return (
		<header className="dpo-an-head">
			<div className="dpo-an-head__title">
				<span className="dpo-an-head__icon" aria-hidden="true">
					<span className="dashicons dashicons-chart-bar" />
				</span>
				<div>
					<h1 className="dpo-an-head__h1">
						{ __(
							'Analytics Overview',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
					<p className="dpo-an-head__sub">
						{ __(
							'Track your option performance',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
			</div>
			<RangeTabs value={ range } onChange={ onRange } busy={ busy } />
		</header>
	);
}
