/**
 * Inspector → General tab. Edits the §6 base node keys shared by every
 * field type (label, description + placement, placeholder, required,
 * hideLabel, width, cssClass).
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { WIDTHS } from '../../../fields/registry';
import {
	Field,
	TextControl,
	SelectControl,
	ToggleField,
} from '../../../components';

/**
 * GeneralTab.
 *
 * @param {Object}   props        Component props.
 * @param {Object}   props.node   Selected node.
 * @param {Function} props.patch  (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function GeneralTab( { node, patch } ) {
	return (
		<div className="dpo-inspector__pane">
			<Field
				label={ __(
					'Label',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<TextControl
					value={ node.label }
					onChange={ ( v ) => patch( { label: v } ) }
				/>
			</Field>

			<Field
				label={ __(
					'Description',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<TextControl
					type="textarea"
					rows={ 2 }
					value={ node.description }
					onChange={ ( v ) => patch( { description: v } ) }
				/>
			</Field>

			<Field
				label={ __(
					'Description placement',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<SelectControl
					value={ node.descriptionPlacement }
					onChange={ ( v ) =>
						patch( { descriptionPlacement: v } )
					}
					options={ [
						{
							value: 'below_label',
							label: __(
								'Below label',
								'dynamic-product-options-for-woocommerce'
							),
						},
						{
							value: 'below_field',
							label: __(
								'Below field',
								'dynamic-product-options-for-woocommerce'
							),
						},
						{
							value: 'tooltip',
							label: __(
								'Tooltip',
								'dynamic-product-options-for-woocommerce'
							),
						},
					] }
				/>
			</Field>

			<Field
				label={ __(
					'Placeholder',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<TextControl
					value={ node.placeholder }
					onChange={ ( v ) => patch( { placeholder: v } ) }
				/>
			</Field>

			<Field
				label={ __(
					'Width',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<SelectControl
					value={ node.width }
					onChange={ ( v ) => patch( { width: v } ) }
					options={ WIDTHS }
				/>
			</Field>

			<Field
				label={ __(
					'CSS class',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<TextControl
					value={ node.cssClass }
					onChange={ ( v ) => patch( { cssClass: v } ) }
				/>
			</Field>

			<div className="dpo-inspector__row">
				<ToggleField
					checked={ node.required }
					onChange={ ( v ) => patch( { required: v } ) }
					label={ __(
						'Required',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
				<ToggleField
					checked={ node.hideLabel }
					onChange={ ( v ) => patch( { hideLabel: v } ) }
					label={ __(
						'Hide label',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			</div>
		</div>
	);
}
