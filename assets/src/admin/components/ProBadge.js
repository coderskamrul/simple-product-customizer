/**
 * "Pro" pill + optional upsell hint. Used to gate Pro-only field types,
 * price modes, and free-tier caps when `!proActive`.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * ProBadge.
 *
 * @param {Object} props        Component props.
 * @param {string} [props.text] Override label (default "Pro").
 * @param {string} [props.hint] Tooltip / title text explaining the gate.
 * @return {JSX.Element} The badge.
 */
export default function ProBadge( {
	text = __( 'Pro', 'simple-product-customizer' ),
	hint,
} ) {
	return (
		<span
			className="spcus-pro-badge"
			title={
				hint ||
				__(
					'Available in the Pro version.',
					'simple-product-customizer'
				)
			}
		>
			<span
				className="dashicons dashicons-star-filled"
				aria-hidden="true"
			/>
			{ text }
		</span>
	);
}
