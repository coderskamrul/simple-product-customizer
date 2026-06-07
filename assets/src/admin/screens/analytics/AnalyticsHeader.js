/**
 * Screen header — branded icon tile, title/subtitle and the range control.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import RangeTabs from './RangeTabs';

/**
 * AnalyticsHeader.
 *
 * @param {Object}   props         Component props.
 * @param {string}   props.range   Active range id.
 * @param {Function} props.onRange (id) => void.
 * @param {boolean}  [props.busy]  Whether a fetch is in flight.
 * @return {JSX.Element} The header.
 */
export default function AnalyticsHeader( { range, onRange, busy } ) {
	return (
		<header className="pkitfw-an-head">
			<div className="pkitfw-an-head__title">
				<span className="pkitfw-an-head__icon" aria-hidden="true">
					<span className="dashicons dashicons-chart-bar" />
				</span>
				<div>
					<h1 className="pkitfw-an-head__h1">
						{ __(
							'Analytics Overview',
							'productkit-for-woocommerce'
						) }
					</h1>
					<p className="pkitfw-an-head__sub">
						{ __(
							'Track your option performance',
							'productkit-for-woocommerce'
						) }
					</p>
				</div>
			</div>
			<RangeTabs value={ range } onChange={ onRange } busy={ busy } />
		</header>
	);
}
