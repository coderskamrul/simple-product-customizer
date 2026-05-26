/**
 * Type-specific configuration block rendered inside the General tab for
 * non-choice fields. It is schema-driven (registry `inspectorSchema`) with a
 * dedicated formula editor for the formula types — so the drawer scales to
 * future field types without bespoke wiring.
 *
 * @package
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
} from '../../../components';
import ValuePricing from './ValuePricing';

/**
 * Clickable variable chips + textarea for formula / advancedformula.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.node     Selected node.
 * @param {Function} props.patch    (partialNode) => void.
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
								'Variables in [brackets]; functions and comparisons supported.',
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
						patch( { config: { ...cfg, formula: v } } )
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
 * TypeConfig.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element|null} The config block.
 */
export default function TypeConfig( { node, patch } ) {
	const { proActive } = useConfig();
	const def = getType( node.type );
	const cfg = node.config || {};

	if ( node.type === 'formula' || node.type === 'advancedformula' ) {
		return (
			<FormulaEditor
				node={ node }
				patch={ patch }
				advanced={ node.type === 'advancedformula' }
			/>
		);
	}

	const schema = ( def.inspectorSchema || [] ).filter(
		// Width/placement live on the Styles tab; price modes on choices.
		( s ) => s.control !== 'priceMode'
	);

	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	const priceModeOptions = PRICE_MODES.map( ( m ) => ( {
		value: m.value,
		label: m.label,
		disabled: m.pro && ! proActive,
	} ) );

	// Layout/special types have no placeholder; everything else does.
	const showPlaceholder = ! [
		'heading',
		'divider',
		'spacer',
		'section',
		'html',
		'shortcode',
	].includes( node.type );

	// Split the schema so compact controls sit side-by-side in a 2-col grid,
	// while toggles and full-width textareas keep their own rows.
	const toggleItems = schema.filter( ( s ) => s.control === 'toggle' );
	const wideItems = schema.filter(
		( s ) => s.control === 'textarea' || s.control === 'formula'
	);
	const compactItems = schema.filter(
		( s ) => ! [ 'toggle', 'textarea', 'formula' ].includes( s.control )
	);

	/**
	 * Render the input control for one compact schema item.
	 *
	 * @param {Object} item Schema descriptor.
	 * @return {JSX.Element} The control.
	 */
	const renderControl = ( item ) => {
		const value = cfg[ item.key ];
		if ( item.control === 'select' ) {
			return (
				<SelectControl
					value={ value ?? '' }
					onChange={ ( v ) => setKey( item.key, v ) }
					options={ item.options || [] }
				/>
			);
		}
		if ( item.control === 'priceModeFull' ) {
			return (
				<SelectControl
					value={ value ?? 'none' }
					onChange={ ( v ) => setKey( item.key, v ) }
					options={ priceModeOptions }
				/>
			);
		}
		return (
			<TextControl
				type={ item.control === 'number' ? 'number' : 'text' }
				value={ value ?? '' }
				onChange={ ( v ) => setKey( item.key, v ) }
			/>
		);
	};

	return (
		<>
			{ def.priceable && <ValuePricing node={ node } patch={ patch } /> }

			{ toggleItems.map( ( item ) => (
				<div key={ item.key } className="dpo-settings__toggle-row">
					<ToggleField
						checked={ !! cfg[ item.key ] }
						onChange={ ( v ) => setKey( item.key, v ) }
						label={ item.label }
					/>
				</div>
			) ) }

			{ ( showPlaceholder || compactItems.length > 0 ) && (
				<div className="dpo-settings__grid2">
					{ showPlaceholder && (
						<Field
							label={ __(
								'Placeholder',
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<TextControl
								value={ node.placeholder }
								onChange={ ( v ) =>
									patch( { placeholder: v } )
								}
							/>
						</Field>
					) }
					{ compactItems.map( ( item ) => (
						<Field key={ item.key } label={ item.label }>
							{ renderControl( item ) }
						</Field>
					) ) }
				</div>
			) }

			{ wideItems.map( ( item ) => (
				<Field key={ item.key } label={ item.label }>
					<TextControl
						type="textarea"
						rows={ item.control === 'formula' ? 3 : undefined }
						value={ cfg[ item.key ] ?? '' }
						onChange={ ( v ) => setKey( item.key, v ) }
					/>
				</Field>
			) ) }
		</>
	);
}
