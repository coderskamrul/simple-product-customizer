/**
 * Summary counters shown beside the screen title. Values are derived from
 * the loaded page (the list API does not expose global aggregates), so the
 * component stays honest about what it can show.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * OptionSetStats.
 *
 * @param {Object} props       Component props.
 * @param {Object} props.stats { total, active, inactive, fields }.
 * @return {JSX.Element} The stat cluster.
 */
export default function OptionSetStats( { stats } ) {
	const items = [
		{
			key: 'total',
			tone: 'blue',
			label: __( 'Total', 'productkit-for-woocommerce' ),
			value: stats.total,
		},
		{
			key: 'active',
			tone: 'green',
			label: __( 'Active', 'productkit-for-woocommerce' ),
			value: stats.active,
		},
		{
			key: 'inactive',
			tone: 'muted',
			label: __( 'Inactive', 'productkit-for-woocommerce' ),
			value: stats.inactive,
		},
		{
			key: 'fields',
			tone: 'icon',
			label: __( 'Fields', 'productkit-for-woocommerce' ),
			value: stats.fields,
		},
	];

	return (
		<dl
			className="pkitfw-os-stats"
			aria-label={ __(
				'Option set summary',
				'productkit-for-woocommerce'
			) }
		>
			{ items.map( ( s ) => (
				<div
					key={ s.key }
					className={ `pkitfw-os-stat pkitfw-os-stat--${ s.tone }` }
				>
					{ s.tone === 'icon' ? (
						<span
							className="dashicons dashicons-screenoptions pkitfw-os-stat__icon"
							aria-hidden="true"
						/>
					) : (
						<span className="pkitfw-os-stat__dot" aria-hidden="true" />
					) }
					<dt className="pkitfw-os-stat__label">{ s.label }:</dt>
					<dd className="pkitfw-os-stat__value">{ s.value }</dd>
				</div>
			) ) }
		</dl>
	);
}
