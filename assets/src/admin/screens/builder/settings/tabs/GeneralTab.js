/**
 * Settings drawer → General tab. The everyday controls: visibility toggles,
 * title & help text, the choices table (for choice fields) or type-specific
 * config (for everything else), and multi-select where it applies.
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
import TypeConfig from '../TypeConfig';

/** Types that support an "Allow multiple" selection. */
const MULTI_TYPES = [
	'checkbox',
	'select',
	'buttongroup',
	'imageswatch',
	'colorswatch',
];

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
								'Enable formula value',
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

			{ def.hasChoices ? (
				<ChoiceTable node={ node } patch={ patch } />
			) : (
				<TypeConfig node={ node } patch={ patch } />
			) }

			{ MULTI_TYPES.includes( node.type ) && (
				<div className="dpo-settings__toggle-row">
					<ToggleField
						checked={ !! cfg.multiple }
						onChange={ ( v ) => setKey( 'multiple', v ) }
						label={ __(
							'Allow multiple',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
			) }
		</div>
	);
}
