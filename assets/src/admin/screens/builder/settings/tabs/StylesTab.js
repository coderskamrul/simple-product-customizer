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
		label: __( 'Circle', 'productkit-for-woocommerce' ),
	},
	{
		value: 'square',
		label: __( 'Square', 'productkit-for-woocommerce' ),
	},
	{
		value: 'rounded',
		label: __( 'Rounded', 'productkit-for-woocommerce' ),
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
			<span className="pkitfw-input-suffix">
				<TextControl
					type="number"
					value={ value ?? '' }
					placeholder={ placeholder }
					onChange={ onChange }
				/>
				<em>
					{ __( 'PX', 'productkit-for-woocommerce' ) }
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
		<div className="pkitfw-swatch-styles">
			<p className="pkitfw-field-group__title">
				{ isImage
					? __(
							'Image styles',
							'productkit-for-woocommerce'
					  )
					: __(
							'Color styles',
							'productkit-for-woocommerce'
					  ) }
			</p>

			<div
				className="pkitfw-style-picker"
				role="radiogroup"
				aria-label={ __(
					'Swatch style',
					'productkit-for-woocommerce'
				) }
			>
				{ SWATCH_SHAPES.map( ( s ) => (
					<button
						key={ s.value }
						type="button"
						role="radio"
						aria-checked={ shape === s.value }
						className={ `pkitfw-style-picker__item${
							shape === s.value ? ' is-active' : ''
						}` }
						onClick={ () => setCfg( 'shape', s.value ) }
					>
						<span
							className={ `pkitfw-style-picker__shape is-${ s.value }` }
						/>
						<span className="pkitfw-style-picker__name">
							{ s.label }
						</span>
					</button>
				) ) }
			</div>

			<div className="pkitfw-settings__grid3">
				<PxField
					label={ __(
						'Width',
						'productkit-for-woocommerce'
					) }
					value={ cfg.swatchWidth }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchWidth', v ) }
				/>
				<PxField
					label={ __(
						'Height',
						'productkit-for-woocommerce'
					) }
					value={ cfg.swatchHeight }
					placeholder={ isImage ? '72' : '44' }
					onChange={ ( v ) => setCfg( 'swatchHeight', v ) }
				/>
				<PxField
					label={ __(
						'Border radius',
						'productkit-for-woocommerce'
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
		<div className="pkitfw-settings__pane">
			<div className="pkitfw-settings__grid2">
				<Field
					label={ __(
						'Field width',
						'productkit-for-woocommerce'
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
						'productkit-for-woocommerce'
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
									'productkit-for-woocommerce'
								),
							},
							{
								value: 'below_field',
								label: __(
									'Below field',
									'productkit-for-woocommerce'
								),
							},
							{
								value: 'tooltip',
								label: __(
									'Tooltip',
									'productkit-for-woocommerce'
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
						'productkit-for-woocommerce'
					) }
					help={ __(
						'Where the per-choice price appears on the storefront.',
						'productkit-for-woocommerce'
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
									'productkit-for-woocommerce'
								),
							},
							{
								value: 'with_choice',
								label: __(
									'Next to each choice',
									'productkit-for-woocommerce'
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
					'productkit-for-woocommerce'
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
