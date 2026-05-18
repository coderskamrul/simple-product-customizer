/**
 * Builder right pane — tabbed inspector for the selected field. Tabs adapt
 * to the field type (Choices only for choice types; Pricing only for
 * priceable types).
 *
 * @package DPO\Admin
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { getType } from '../../fields/registry';
import { useBuilder } from '../../store/BuilderContext';
import { EmptyState } from '../../components';
import GeneralTab from './inspector/GeneralTab';
import ChoicesTab from './inspector/ChoicesTab';
import PricingTab from './inspector/PricingTab';
import LogicTab from './inspector/LogicTab';
import AdvancedTab from './inspector/AdvancedTab';

/**
 * Inspector.
 *
 * @return {JSX.Element} The inspector pane.
 */
export default function Inspector() {
	const { selected, dispatch } = useBuilder();
	const [ tab, setTab ] = useState( 'general' );

	// Reset to General whenever a different field is selected.
	useEffect( () => {
		setTab( 'general' );
	}, [ selected && selected.id ] );

	if ( ! selected ) {
		return (
			<aside className="dpo-inspector">
				<EmptyState
					icon="admin-settings"
					title={ __(
						'No field selected',
						'dynamic-product-options-for-woocommerce'
					) }
					text={ __(
						'Select a field in the canvas to edit its settings.',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			</aside>
		);
	}

	const def = getType( selected.type );
	const tabs = [
		{
			key: 'general',
			label: __(
				'General',
				'dynamic-product-options-for-woocommerce'
			),
		},
	];
	if ( def.hasChoices ) {
		tabs.push( {
			key: 'choices',
			label: __(
				'Choices',
				'dynamic-product-options-for-woocommerce'
			),
		} );
	}
	if ( def.priceable ) {
		tabs.push( {
			key: 'pricing',
			label: __(
				'Pricing',
				'dynamic-product-options-for-woocommerce'
			),
		} );
	}
	tabs.push(
		{
			key: 'logic',
			label: __(
				'Logic',
				'dynamic-product-options-for-woocommerce'
			),
		},
		{
			key: 'advanced',
			label: __(
				'Advanced',
				'dynamic-product-options-for-woocommerce'
			),
		}
	);

	/**
	 * Apply a partial patch to the selected node.
	 *
	 * @param {Object} patchObj Partial node.
	 * @return {void}
	 */
	const patch = ( patchObj ) =>
		dispatch( {
			type: 'UPDATE',
			id: selected.id,
			patch: patchObj,
		} );

	const active = tabs.find( ( t ) => t.key === tab )
		? tab
		: 'general';

	return (
		<aside
			className="dpo-inspector"
			aria-label={ __(
				'Field settings',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<header className="dpo-inspector__head">
				<span
					className={ `dashicons dashicons-${ def.icon }` }
					aria-hidden="true"
				/>
				<span className="dpo-inspector__title">
					{ selected.label || def.label }
				</span>
			</header>
			<div
				className="dpo-inspector__tabs"
				role="tablist"
			>
				{ tabs.map( ( t ) => (
					<button
						key={ t.key }
						type="button"
						role="tab"
						aria-selected={ active === t.key }
						className={ `dpo-inspector__tab${
							active === t.key ? ' is-active' : ''
						}` }
						onClick={ () => setTab( t.key ) }
					>
						{ t.label }
					</button>
				) ) }
			</div>
			<div className="dpo-inspector__content">
				{ active === 'general' && (
					<GeneralTab node={ selected } patch={ patch } />
				) }
				{ active === 'choices' && (
					<ChoicesTab node={ selected } patch={ patch } />
				) }
				{ active === 'pricing' && (
					<PricingTab node={ selected } patch={ patch } />
				) }
				{ active === 'logic' && (
					<LogicTab node={ selected } patch={ patch } />
				) }
				{ active === 'advanced' && (
					<AdvancedTab node={ selected } patch={ patch } />
				) }
			</div>
		</aside>
	);
}
