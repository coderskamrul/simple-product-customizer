/**
 * Shared "Price Type / Regular / Sales" panel for single-value priceable
 * fields (number, range, email, color picker, file upload). The price lives
 * on the field's first choice — exactly where the storefront renderer and
 * PriceCalculator read it from.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { priceModeOptionsFor, makeChoice } from '../../../fields/registry';
import { useConfig } from '../../../store/ConfigContext';
import { TextControl, SelectControl } from '../../../components';

/**
 * ValuePricing.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The pricing panel.
 */
export default function ValuePricing( { node, patch } ) {
	const { proActive } = useConfig();
	const choice = ( node.choices && node.choices[ 0 ] ) || {};

	// Filter by field type / Enable Quantity (allowedPriceModes in
	// fields/registry), keep any saved value visible, then layer the Pro
	// gate on top.
	const priceOptions = priceModeOptionsFor( node, choice.priceMode ).map(
		( m ) => ( {
			value: m.value,
			label: m.pro && ! proActive ? `${ m.label } (Pro)` : m.label,
			disabled: m.pro && ! proActive,
		} )
	);

	const setPrice = ( delta ) => {
		const base =
			node.choices && node.choices.length
				? node.choices.slice()
				: [ makeChoice() ];
		base[ 0 ] = { ...( base[ 0 ] || makeChoice() ), ...delta };
		patch( { choices: base } );
	};

	return (
		<div className="dpo-vprice">
			<div className="dpo-vprice__head">
				<span>
					{ __(
						'Price Type',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<span>
					{ __(
						'Regular',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<span className="dpo-vprice__pro">
					{ __( 'Sales', 'dynamic-product-options-for-woocommerce' ) }
					{ ! proActive && <em className="dpo-pro-tag">Pro</em> }
				</span>
			</div>
			<div className="dpo-vprice__row">
				<SelectControl
					value={ choice.priceMode || 'none' }
					options={ priceOptions }
					onChange={ ( v ) => setPrice( { priceMode: v } ) }
				/>
				<TextControl
					type="number"
					value={ choice.regular }
					onChange={ ( v ) => setPrice( { regular: v } ) }
				/>
				<TextControl
					type="number"
					value={ choice.sale }
					disabled={ ! proActive }
					placeholder={
						proActive
							? ''
							: __(
									'Pro',
									'dynamic-product-options-for-woocommerce'
							  )
					}
					onChange={ ( v ) => setPrice( { sale: v } ) }
				/>
			</div>
		</div>
	);
}
