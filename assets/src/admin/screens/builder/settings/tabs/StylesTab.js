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
	const isSwatch = [ 'colorswatch', 'imageswatch' ].includes( node.type );

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
				<Field
					label={ __(
						'Swatch shape',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<SelectControl
						value={ cfg.shape || 'circle' }
						onChange={ ( v ) =>
							patch( { config: { ...cfg, shape: v } } )
						}
						options={ [ 'circle', 'square', 'rounded' ] }
					/>
				</Field>
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
