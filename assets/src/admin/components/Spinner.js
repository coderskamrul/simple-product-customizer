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
	label = __( 'Loading…', 'dynamic-product-options-for-woocommerce' ),
} ) {
	return (
		<span className="dpo-spinner" role="status" aria-live="polite">
			<span className="dpo-spinner__ring" aria-hidden="true" />
			<span className="screen-reader-text">{ label }</span>
		</span>
	);
}
