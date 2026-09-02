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
			label: __( 'Total', 'simple-product-customizer' ),
			value: stats.total,
		},
		{
			key: 'active',
			tone: 'green',
			label: __( 'Active', 'simple-product-customizer' ),
			value: stats.active,
		},
		{
			key: 'inactive',
			tone: 'muted',
			label: __( 'Inactive', 'simple-product-customizer' ),
			value: stats.inactive,
		},
		{
			key: 'fields',
			tone: 'icon',
			label: __( 'Fields', 'simple-product-customizer' ),
			value: stats.fields,
		},
	];

	return (
		<dl
			className="spcus-os-stats"
			aria-label={ __(
				'Option set summary',
				'simple-product-customizer'
			) }
		>
			{ items.map( ( s ) => (
				<div
					key={ s.key }
					className={ `spcus-os-stat spcus-os-stat--${ s.tone }` }
				>
					{ s.tone === 'icon' ? (
						<span
							className="dashicons dashicons-screenoptions spcus-os-stat__icon"
							aria-hidden="true"
						/>
					) : (
						<span className="spcus-os-stat__dot" aria-hidden="true" />
					) }
					<dt className="spcus-os-stat__label">{ s.label }:</dt>
					<dd className="spcus-os-stat__value">{ s.value }</dd>
				</div>
			) ) }
		</dl>
	);
}
