/**
 * Minimal inline loading spinner with an accessible label.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * Spinner.
 *
 * @param {Object} props         Component props.
 * @param {string} [props.label] Visually-hidden status text.
 * @return {JSX.Element} The spinner.
 */
export default function Spinner( {
	label = __( 'Loading…', 'simple-product-customizer' ),
} ) {
	return (
		<span className="spcus-spinner" role="status" aria-live="polite">
			<span className="spcus-spinner__ring" aria-hidden="true" />
			<span className="screen-reader-text">{ label }</span>
		</span>
	);
}
