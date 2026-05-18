/**
 * Inspector → Advanced tab. Renders type-specific config controls driven
 * by the registry's `inspectorSchema`. Formula / advancedformula get a
 * dedicated expression editor with a variable hint list.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { getType, PRICE_MODES } from '../../../fields/registry';
import { useConfig } from '../../../store/ConfigContext';
import { useBuilder } from '../../../store/BuilderContext';
import { flatten } from '../../../store/treeOps';
import {
	Field,
	TextControl,
	SelectControl,
	ToggleField,
	ProBadge,
} from '../../../components';

/**
 * Formula editor with a clickable variable hint list.
 *
 * @param {Object}   props        Component props.
 * @param {Object}   props.node   Selected node.
 * @param {Function} props.patch  (partialNode) => void.
 * @param {boolean}  props.advanced Whether this is the Pro advancedformula.
 * @return {JSX.Element} The editor.
 */
function FormulaEditor( { node, patch, advanced } ) {
	const { tree } = useBuilder();
	const cfg = node.config || {};
	const vars = flatten( tree ).filter( ( f ) => f.id !== node.id );
	const token = ( id ) => ( advanced ? `[${ id }]` : `{{${ id }}}` );

	return (
		<>
			<Field
				label={
					advanced
						? __(
								'Expression',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Formula',
								'dynamic-product-options-for-woocommerce'
						  )
				}
				help={
					advanced
						? __(
								'Variables in [brackets]; supports functions and comparisons.',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Variables in {{double braces}}; arithmetic and % only.',
								'dynamic-product-options-for-woocommerce'
						  )
				}
			>
				<TextControl
					type="textarea"
					rows={ 4 }
					value={ cfg.formula || '' }
					onChange={ ( v ) =>
						patch( {
							config: { ...cfg, formula: v },
						} )
					}
				/>
			</Field>
			<div className="dpo-formula-vars">
				<span className="dpo-formula-vars__title">
					{ __(
						'Available variables',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<div className="dpo-formula-vars__list">
					{ vars.length === 0 && (
						<span className="dpo-hint">
							{ __(
								'No other fields yet.',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
					) }
					{ vars.map( ( v ) => (
						<button
							key={ v.id }
							type="button"
							className="dpo-token"
							onClick={ () =>
								patch( {
									config: {
										...cfg,
										formula: `${
											cfg.formula || ''
										}${ token( v.id ) }`,
									},
								} )
							}
						>
							{ v.label || v.type } → { token( v.id ) }
						</button>
					) ) }
				</div>
			</div>
		</>
	);
}

/**
 * AdvancedTab.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function AdvancedTab( { node, patch } ) {
	const { proActive } = useConfig();
	const def = getType( node.type );
	const cfg = node.config || {};

	if ( node.type === 'formula' || node.type === 'advancedformula' ) {
		return (
			<div className="dpo-inspector__pane">
				<FormulaEditor
					node={ node }
					patch={ patch }
					advanced={ node.type === 'advancedformula' }
				/>
			</div>
		);
	}

	const schema = def.inspectorSchema || [];
	if ( schema.length === 0 ) {
		return (
			<div className="dpo-inspector__pane">
				<p className="dpo-hint">
					{ __(
						'No advanced options for this field type.',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
			</div>
		);
	}

	/**
	 * Patch one config key.
	 *
	 * @param {string} key   Config key.
	 * @param {*}      value New value.
	 * @return {void}
	 */
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	const priceModeOptions = PRICE_MODES.map( ( m ) => ( {
		value: m.value,
		label: m.label,
		disabled: m.pro && ! proActive,
	} ) );

	return (
		<div className="dpo-inspector__pane">
			{ schema.map( ( item ) => {
				const value = cfg[ item.key ];
				if ( item.control === 'toggle' ) {
					return (
						<div
							key={ item.key }
							className="dpo-inspector__row"
						>
							<ToggleField
								checked={ !! value }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
								label={ item.label }
							/>
						</div>
					);
				}
				return (
					<Field key={ item.key } label={ item.label }>
						{ item.control === 'select' && (
							<SelectControl
								value={ value ?? '' }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
								options={ item.options || [] }
							/>
						) }
						{ item.control === 'priceMode' && (
							<SelectControl
								value={ value ?? 'none' }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
								options={ priceModeOptions }
							/>
						) }
						{ item.control === 'number' && (
							<TextControl
								type="number"
								value={ value ?? '' }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
							/>
						) }
						{ item.control === 'textarea' && (
							<TextControl
								type="textarea"
								value={ value ?? '' }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
							/>
						) }
						{ item.control === 'text' && (
							<TextControl
								value={ value ?? '' }
								onChange={ ( v ) =>
									setKey( item.key, v )
								}
							/>
						) }
					</Field>
				);
			} ) }
			{ def.proOnly && ! proActive && (
				<ProBadge
					hint={ __(
						'This field type requires the Pro version to render on the storefront.',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			) }
		</div>
	);
}
