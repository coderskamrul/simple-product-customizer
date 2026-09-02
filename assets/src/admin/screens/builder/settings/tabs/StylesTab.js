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
	{
		value: 'circle',
		label: __( 'Circle', 'simple-product-customizer' ),
	},
	{
		value: 'square',
		label: __( 'Square', 'simple-product-customizer' ),
	},
	{
		value: 'rounded',
		label: __( 'Rounded', 'simple-product-customizer' ),
	},
];

/**
 * A px number field with a trailing "PX" suffix.
 *
 * @param {Object}   props               Component props.
 * @param {string}   props.label         Field label.
 * @param {*}        props.value         Current value.
 * @param {Function} props.onChange      (value) => void.
 * @param {string}   [props.placeholder] Placeholder.
 * @return {JSX.Element} The field.
 */
function PxField( { label, value, onChange, placeholder } ) {
	return (
		<Field label={ label }>
			<span className="spcus-input-suffix">
				<TextControl
					type="number"
					value={ value ?? '' }
					placeholder={ placeholder }
					onChange={ onChange }
				/>
				<em>
					{ __( 'PX', 'simple-product-customizer' ) }
				</em>
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
		<div className="spcus-swatch-styles">
			<p className="spcus-field-group__title">
				{ isImage
					? __(
							'Image styles',
							'simple-product-customizer'
					  )
					: __(
							'Color styles',
							'simple-product-customizer'
					  ) }
			</p>

			<div
				className="spcus-style-picker"
				role="radiogroup"
				aria-label={ __(
					'Swatch style',
					'simple-product-customizer'
				) }
			>
				{ SWATCH_SHAPES.map( ( s ) => (
					<button
						key={ s.value }
						type="button"
						role="radio"
						aria-checked={ shape === s.value }
						className={ `spcus-style-picker__item${
							shape === s.value ? ' is-active' : ''
						}` }
						onClick={ () => setCfg( 'shape', s.value ) }
					>
						<span
							className={ `spcus-style-picker__shape is-${ s.value }` }
						/>
						<span className="spcus-style-picker__name">
							{ s.label }
						</span>
					</button>
				) ) }
			</div>

			<div className="spcus-settings__grid3">
				<PxField
					label={ __(
						'Width',
						'simple-product-customizer'
					) }
					value={ cfg.swatchWidth }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchWidth', v ) }
				/>
				<PxField
					label={ __(
						'Height',
						'simple-product-customizer'
					) }
					value={ cfg.swatchHeight }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchHeight', v ) }
				/>
				<PxField
					label={ __(
						'Border radius',
						'simple-product-customizer'
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
		<div className="spcus-settings__pane">
			<div className="spcus-settings__grid2">
				<Field
					label={ __(
						'Field width',
						'simple-product-customizer'
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
						'simple-product-customizer'
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
									'simple-product-customizer'
								),
							},
							{
								value: 'below_field',
								label: __(
									'Below field',
									'simple-product-customizer'
								),
							},
							{
								value: 'tooltip',
								label: __(
									'Tooltip',
									'simple-product-customizer'
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
						'simple-product-customizer'
					) }
					help={ __(
						'Where the per-choice price appears on the storefront.',
						'simple-product-customizer'
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
									'simple-product-customizer'
								),
							},
							{
								value: 'with_choice',
								label: __(
									'Next to each choice',
									'simple-product-customizer'
								),
							},
						] }
					/>
				</Field>
			) }

			{ isSwatch && <SwatchStyles node={ node } patch={ patch } /> }

			<Field
				label={ __(
					'CSS class',
					'simple-product-customizer'
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
