/**
 * Inspector → Pricing tab. Controls where the price appears for the field
 * (§6 `pricePlacement`).
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { Field, SelectControl } from '../../../components';

/**
 * PricingTab.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function PricingTab( { node, patch } ) {
	return (
		<div className="dpo-inspector__pane">
			<Field
				label={ __(
					'Price placement',
					'dynamic-product-options-for-woocommerce'
				) }
				help={ __(
					'Where the per-choice price appears on the storefront.',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<SelectControl
					value={ node.pricePlacement }
					onChange={ ( v ) =>
						patch( { pricePlacement: v } )
					}
					options={ [
						{
							value: 'with_label',
							label: __(
								'Next to the field label',
								'dynamic-product-options-for-woocommerce'
							),
						},
						{
							value: 'with_choice',
							label: __(
								'Next to each choice',
								'dynamic-product-options-for-woocommerce'
							),
						},
					] }
				/>
			</Field>
		</div>
	);
}
