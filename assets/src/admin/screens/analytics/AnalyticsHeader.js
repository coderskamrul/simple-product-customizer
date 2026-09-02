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
		<header className="spcus-an-head">
			<div className="spcus-an-head__title">
				<span className="spcus-an-head__icon" aria-hidden="true">
					<span className="dashicons dashicons-chart-bar" />
				</span>
				<div>
					<h1 className="spcus-an-head__h1">
						{ __(
							'Analytics Overview',
							'simple-product-customizer'
						) }
					</h1>
					<p className="spcus-an-head__sub">
						{ __(
							'Track your option performance',
							'simple-product-customizer'
						) }
					</p>
				</div>
			</div>
			<RangeTabs value={ range } onChange={ onRange } busy={ busy } />
		</header>
	);
}
