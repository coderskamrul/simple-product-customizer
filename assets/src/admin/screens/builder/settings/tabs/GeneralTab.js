/**
 * Settings drawer → General tab. The everyday controls: visibility toggles,
 * title & help text, then the field-shaped body — the choices table plus its
 * per-type extras for choice fields, a single-value pricing block for priced
 * value fields (number/range/email/color picker), or the schema-driven config
 * for everything else.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { getType } from '../../../../fields/registry';
import { useConfig } from '../../../../store/ConfigContext';
import {
	Field,
	TextControl,
	ToggleField,
	ProBadge,
} from '../../../../components';
import ChoiceTable from '../ChoiceTable';
import ChoiceFieldExtras from '../ChoiceFieldExtras';
import ValueFieldConfig from '../ValueFieldConfig';
import FileUploadConfig from '../FileUploadConfig';
import DateConfig from '../DateConfig';
import TimeConfig from '../TimeConfig';
import TypeConfig from '../TypeConfig';

/** Single-value fields that price one value (stored on choices[0]). */
const VALUE_PRICE_TYPES = [ 'number', 'range', 'email', 'colorpicker' ];

/**
 * GeneralTab.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function GeneralTab( { node, patch } ) {
	const { proActive } = useConfig();
	const def = getType( node.type );
	const cfg = node.config || {};
	const isLayout = [ 'heading', 'divider', 'spacer', 'section' ].includes(
		node.type
	);

	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	return (
		<div className="dpo-settings__pane">
			<div className="dpo-settings__switches">
				<ToggleField
					checked={ node.hideLabel }
					onChange={ ( v ) => patch( { hideLabel: v } ) }
					label={ __(
						'Hide title',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
				{ ! isLayout && (
					<ToggleField
						checked={ node.required }
						onChange={ ( v ) => patch( { required: v } ) }
						label={ __(
							'Required',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				) }
				{ def.priceable && def.hasChoices && (
					<span
						className={ `dpo-settings__switch-pro${
							proActive ? '' : ' is-locked'
						}` }
					>
						<ToggleField
							checked={ proActive && !! cfg.formulaValue }
							onChange={ ( v ) =>
								proActive && setKey( 'formulaValue', v )
							}
							label={ __(
								'Enable Formula Value',
								'dynamic-product-options-for-woocommerce'
							) }
						/>
						{ ! proActive && <ProBadge text="" /> }
					</span>
				) }
			</div>

			<div className="dpo-settings__grid2">
				<Field
					label={ __(
						'Title',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ node.label }
						placeholder={ def.label }
						onChange={ ( v ) => patch( { label: v } ) }
					/>
				</Field>
				<Field
					label={ __(
						'Help text',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ node.description }
						onChange={ ( v ) => patch( { description: v } ) }
					/>
				</Field>
			</div>

			{ def.hasChoices && (
				<>
					<ChoiceTable node={ node } patch={ patch } />
					<ChoiceFieldExtras node={ node } patch={ patch } />
				</>
			) }

			{ ! def.hasChoices && VALUE_PRICE_TYPES.includes( node.type ) && (
				<ValueFieldConfig node={ node } patch={ patch } />
			) }

			{ ! def.hasChoices && node.type === 'fileupload' && (
				<FileUploadConfig node={ node } patch={ patch } />
			) }

			{ ! def.hasChoices && node.type === 'date' && (
				<DateConfig node={ node } patch={ patch } />
			) }

			{ ! def.hasChoices && node.type === 'time' && (
				<TimeConfig node={ node } patch={ patch } />
			) }

			{ ! def.hasChoices &&
				! VALUE_PRICE_TYPES.includes( node.type ) &&
				node.type !== 'fileupload' &&
				node.type !== 'date' &&
				node.type !== 'time' && (
					<TypeConfig node={ node } patch={ patch } />
				) }
		</div>
	);
}
