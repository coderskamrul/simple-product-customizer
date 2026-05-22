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
import { PRICE_MODES, makeChoice } from '../../../fields/registry';
import { useConfig } from '../../../store/ConfigContext';
import {
	Field,
	TextControl,
	SelectControl,
	ToggleField,
	ColorField,
} from '../../../components';

/**
 * The shared "Price Type / Regular / Sales" panel, writing to choices[0].
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The pricing panel.
 */
function ValuePricing( { node, patch } ) {
	const { proActive } = useConfig();
	const choice = ( node.choices && node.choices[ 0 ] ) || {};

	const priceOptions = PRICE_MODES.map( ( m ) => ( {
		value: m.value,
		label: m.pro && ! proActive ? `${ m.label } (Pro)` : m.label,
		disabled: m.pro && ! proActive,
	} ) );

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
						'dynamic-product-options-for-woocommerce'
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
					<div className="dpo-settings__toggle-row">
						<ToggleField
							checked={ !! cfg.enableMinMax }
							onChange={ ( v ) => setKey( 'enableMinMax', v ) }
							label={ __(
								'Enable Min/Max Restriction',
								'dynamic-product-options-for-woocommerce'
							) }
						/>
					</div>
					{ cfg.enableMinMax && (
						<div className="dpo-settings__grid2">
							<Field
								label={ __(
									'Minimum value',
									'dynamic-product-options-for-woocommerce'
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
									'dynamic-product-options-for-woocommerce'
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
					<div className="dpo-settings__grid2">
						<Field
							label={ __(
								'Steps',
								'dynamic-product-options-for-woocommerce'
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
								'dynamic-product-options-for-woocommerce'
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
					<div className="dpo-settings__toggle-row">
						<ToggleField
							checked={ !! cfg.enablePostfix }
							onChange={ ( v ) => setKey( 'enablePostfix', v ) }
							label={ __(
								'Enable PostFix',
								'dynamic-product-options-for-woocommerce'
							) }
						/>
					</div>
					{ cfg.enablePostfix && (
						<Field
							label={ __(
								'Postfix text',
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<TextControl
								value={ cfg.postfix ?? '' }
								onChange={ ( v ) => setKey( 'postfix', v ) }
							/>
						</Field>
					) }
					<div className="dpo-settings__grid2">
						<Field
							label={ __(
								'Minimum value',
								'dynamic-product-options-for-woocommerce'
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
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<TextControl
								type="number"
								value={ cfg.max ?? '' }
								onChange={ ( v ) => setKey( 'max', v ) }
							/>
						</Field>
					</div>
					<div className="dpo-settings__grid2">
						<Field
							label={ __(
								'Steps',
								'dynamic-product-options-for-woocommerce'
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
								'dynamic-product-options-for-woocommerce'
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
						'dynamic-product-options-for-woocommerce'
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
