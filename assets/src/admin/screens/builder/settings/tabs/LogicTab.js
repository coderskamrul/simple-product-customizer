/**
 * Settings drawer → Conditional Logic tab. Toggle conditional visibility,
 * choose all/any matching, and build source/operator/value rules referencing
 * any other field in the set (ARCHITECTURE §6).
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { OPERATORS } from '../../../../fields/registry';
import { useBuilder } from '../../../../store/BuilderContext';
import { flatten } from '../../../../store/treeOps';
import {
	Field,
	SelectControl,
	TextControl,
	ToggleField,
	Repeater,
} from '../../../../components';

/** Operators that don't need a value input. */
const NO_VALUE = [ 'empty', 'not_empty', 'checked' ];

/**
 * LogicTab.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function LogicTab( { node, patch } ) {
	const { tree } = useBuilder();
	const logic = node.logic || { match: 'all', rules: [] };

	const sources = flatten( tree )
		.filter( ( f ) => f.id !== node.id )
		.map( ( f ) => ( {
			value: f.id,
			label: f.label || `${ f.type } (${ f.id.slice( 0, 6 ) })`,
		} ) );

	const setLogic = ( delta ) => patch( { logic: { ...logic, ...delta } } );

	return (
		<div className="dpo-settings__pane">
			<div className="dpo-settings__toggle-row">
				<ToggleField
					checked={ node.logicEnabled }
					onChange={ ( v ) => patch( { logicEnabled: v } ) }
					label={ __(
						'Enable conditional logic',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			</div>

			{ node.logicEnabled && (
				<>
					<Field
						label={ __(
							'Show this field when',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<SelectControl
							value={ logic.match }
							onChange={ ( v ) => setLogic( { match: v } ) }
							options={ [
								{
									value: 'all',
									label: __(
										'All rules match',
										'dynamic-product-options-for-woocommerce'
									),
								},
								{
									value: 'any',
									label: __(
										'Any rule matches',
										'dynamic-product-options-for-woocommerce'
									),
								},
							] }
						/>
					</Field>

					{ sources.length === 0 ? (
						<p className="dpo-hint">
							{ __(
								'Add another field first to reference it in a rule.',
								'dynamic-product-options-for-woocommerce'
							) }
						</p>
					) : (
						<Repeater
							rows={ logic.rules || [] }
							onChange={ ( rules ) => setLogic( { rules } ) }
							makeRow={ () => ( {
								source: sources[ 0 ].value,
								operator: 'is',
								value: '',
							} ) }
							addLabel={ __(
								'Add rule',
								'dynamic-product-options-for-woocommerce'
							) }
							renderRow={ ( rule, idx ) => {
								const setRule = ( delta ) =>
									setLogic( {
										rules: ( logic.rules || [] ).map(
											( r, i ) =>
												i === idx
													? { ...r, ...delta }
													: r
										),
									} );
								return (
									<div className="dpo-logic-rule">
										<SelectControl
											value={ rule.source }
											onChange={ ( v ) =>
												setRule( { source: v } )
											}
											options={ sources }
										/>
										<SelectControl
											value={ rule.operator }
											onChange={ ( v ) =>
												setRule( { operator: v } )
											}
											options={ OPERATORS }
										/>
										{ ! NO_VALUE.includes(
											rule.operator
										) && (
											<TextControl
												value={ rule.value }
												placeholder={ __(
													'Value',
													'dynamic-product-options-for-woocommerce'
												) }
												onChange={ ( v ) =>
													setRule( { value: v } )
												}
											/>
										) }
									</div>
								);
							} }
						/>
					) }
				</>
			) }
		</div>
	);
}
