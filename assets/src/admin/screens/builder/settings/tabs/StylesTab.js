/**
 * Settings drawer → Styles tab. Presentation-only controls: field width,
 * description placement, price placement (priceable types), per-choice
 * swatch shape, and a custom CSS class escape hatch.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { getType, WIDTHS } from '../../../../fields/registry';
import { Field, SelectControl, TextControl } from '../../../../components';

/** Swatch style presets (shape) offered in the visual picker. */
const SWATCH_SHAPES = [
	{ value: 'circle', label: __( 'Circle', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'square', label: __( 'Square', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'rounded', label: __( 'Rounded', 'dynamic-product-options-for-woocommerce' ) },
];

/**
 * A px number field with a trailing "PX" suffix.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Field label.
 * @param {*}        props.value    Current value.
 * @param {Function} props.onChange (value) => void.
 * @param {string}   [props.placeholder] Placeholder.
 * @return {JSX.Element} The field.
 */
function PxField( { label, value, onChange, placeholder } ) {
	return (
		<Field label={ label }>
			<span className="dpo-input-suffix">
				<TextControl
					type="number"
					value={ value ?? '' }
					placeholder={ placeholder }
					onChange={ onChange }
				/>
				<em>{ __( 'PX', 'dynamic-product-options-for-woocommerce' ) }</em>
			</span>
		</Field>
	);
}

/**
 * Swatch presentation controls — a visual style (shape) picker plus
 * width / height / border-radius. Writes to the field `config` bag; both the
 * canvas preview and the PHP renderers read the same keys so it stays in sync.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The section.
 */
function SwatchStyles( { node, patch } ) {
	const cfg = node.config || {};
	const setCfg = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );
	const shape = cfg.shape || 'square';
	const isImage = [ 'imageswatch', 'linkedproducts' ].includes( node.type );

	return (
		<div className="dpo-swatch-styles">
			<p className="dpo-field-group__title">
				{ isImage
					? __(
							'Image styles',
							'dynamic-product-options-for-woocommerce'
					  )
					: __(
							'Color styles',
							'dynamic-product-options-for-woocommerce'
					  ) }
			</p>

			<div
				className="dpo-style-picker"
				role="radiogroup"
				aria-label={ __(
					'Swatch style',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				{ SWATCH_SHAPES.map( ( s ) => (
					<button
						key={ s.value }
						type="button"
						role="radio"
						aria-checked={ shape === s.value }
						className={ `dpo-style-picker__item${
							shape === s.value ? ' is-active' : ''
						}` }
						onClick={ () => setCfg( 'shape', s.value ) }
					>
						<span
							className={ `dpo-style-picker__shape is-${ s.value }` }
						/>
						<span className="dpo-style-picker__name">
							{ s.label }
						</span>
					</button>
				) ) }
			</div>

			<div className="dpo-settings__grid3">
				<PxField
					label={ __(
						'Width',
						'dynamic-product-options-for-woocommerce'
					) }
					value={ cfg.swatchWidth }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchWidth', v ) }
				/>
				<PxField
					label={ __(
						'Height',
						'dynamic-product-options-for-woocommerce'
					) }
					value={ cfg.swatchHeight }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchHeight', v ) }
				/>
				<PxField
					label={ __(
						'Border radius',
						'dynamic-product-options-for-woocommerce'
					) }
					value={ cfg.swatchRadius }
					onChange={ ( v ) => setCfg( 'swatchRadius', v ) }
				/>
			</div>
		</div>
	);
}

/**
 * StylesTab.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function StylesTab( { node, patch } ) {
	const def = getType( node.type );
	const cfg = node.config || {};
	const isSwatch = [
		'colorswatch',
		'imageswatch',
		'linkedproducts',
	].includes( node.type );

	return (
		<div className="dpo-settings__pane">
			<div className="dpo-settings__grid2">
				<Field
					label={ __(
						'Field width',
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
			</div>

			{ def.priceable && (
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
						onChange={ ( v ) => patch( { pricePlacement: v } ) }
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
			) }

			{ isSwatch && (
				<SwatchStyles node={ node } patch={ patch } />
			) }

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
		</div>
	);
}
