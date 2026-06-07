/**
 * General-tab config for single-value priceable fields (number, range, email,
 * color picker). These price a single value, so the price (type / regular /
 * sale) is stored on the field's first choice — exactly where the storefront
 * renderer and PriceCalculator read it from — while the rest of the controls
 * live in the field's `config` bag. The layout mirrors each field's settings
 * reference design.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	Field,
	TextControl,
	ToggleField,
	ColorField,
} from '../../../components';
import ValuePricing from './ValuePricing';

/**
 * ValueFieldConfig.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The config block.
 */
export default function ValueFieldConfig( { node, patch } ) {
	const cfg = node.config || {};
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	return (
		<>
			<ValuePricing node={ node } patch={ patch } />

			{ /* ---- Color Picker ---- */ }
			{ node.type === 'colorpicker' && (
				<Field
					label={ __(
						'Default color',
						'productkit-for-woocommerce'
					) }
				>
					<ColorField
						value={ cfg.defaultColor || '#000000' }
						onChange={ ( v ) => setKey( 'defaultColor', v ) }
					/>
				</Field>
			) }

			{ /* ---- Number ---- */ }
			{ node.type === 'number' && (
				<>
					<div className="pkitfw-settings__toggle-row">
						<ToggleField
							checked={ !! cfg.enableMinMax }
							onChange={ ( v ) => setKey( 'enableMinMax', v ) }
							label={ __(
								'Enable Min/Max Restriction',
								'productkit-for-woocommerce'
							) }
						/>
					</div>
					{ cfg.enableMinMax && (
						<div className="pkitfw-settings__grid2">
							<Field
								label={ __(
									'Minimum value',
									'productkit-for-woocommerce'
								) }
							>
								<TextControl
									type="number"
									value={ cfg.min ?? '' }
									onChange={ ( v ) => setKey( 'min', v ) }
								/>
							</Field>
							<Field
								label={ __(
									'Maximum value',
									'productkit-for-woocommerce'
								) }
							>
								<TextControl
									type="number"
									value={ cfg.max ?? '' }
									onChange={ ( v ) => setKey( 'max', v ) }
								/>
							</Field>
						</div>
					) }
					<div className="pkitfw-settings__grid2">
						<Field
							label={ __(
								'Steps',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.step ?? '' }
								onChange={ ( v ) => setKey( 'step', v ) }
							/>
						</Field>
						<Field
							label={ __(
								'Default value',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.value ?? '' }
								onChange={ ( v ) => setKey( 'value', v ) }
							/>
						</Field>
					</div>
				</>
			) }

			{ /* ---- Range ---- */ }
			{ node.type === 'range' && (
				<>
					<div className="pkitfw-settings__toggle-row">
						<ToggleField
							checked={ !! cfg.enablePostfix }
							onChange={ ( v ) => setKey( 'enablePostfix', v ) }
							label={ __(
								'Enable PostFix',
								'productkit-for-woocommerce'
							) }
						/>
					</div>
					{ cfg.enablePostfix && (
						<Field
							label={ __(
								'Postfix text',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								value={ cfg.postfix ?? '' }
								onChange={ ( v ) => setKey( 'postfix', v ) }
							/>
						</Field>
					) }
					<div className="pkitfw-settings__grid2">
						<Field
							label={ __(
								'Minimum value',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.min ?? '' }
								onChange={ ( v ) => setKey( 'min', v ) }
							/>
						</Field>
						<Field
							label={ __(
								'Maximum value',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.max ?? '' }
								onChange={ ( v ) => setKey( 'max', v ) }
							/>
						</Field>
					</div>
					<div className="pkitfw-settings__grid2">
						<Field
							label={ __(
								'Steps',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.step ?? '' }
								onChange={ ( v ) => setKey( 'step', v ) }
							/>
						</Field>
						<Field
							label={ __(
								'Default value',
								'productkit-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.value ?? '' }
								onChange={ ( v ) => setKey( 'value', v ) }
							/>
						</Field>
					</div>
				</>
			) }

			{ /* ---- Email & Number placeholder ---- */ }
			{ ( node.type === 'email' || node.type === 'number' ) && (
				<Field
					label={ __(
						'Placeholder',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ node.placeholder }
						onChange={ ( v ) => patch( { placeholder: v } ) }
					/>
				</Field>
			) }
		</>
	);
}
