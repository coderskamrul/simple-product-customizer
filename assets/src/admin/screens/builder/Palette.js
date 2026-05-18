/**
 * Builder left pane — the "Add Field" palette. All 30 types grouped by
 * category; clicking (or dragging) adds a node to the current selection's
 * container, or to the root.
 *
 * @package DPO\Admin
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { typesByCategory } from '../../fields/registry';
import { useBuilder } from '../../store/BuilderContext';
import { useConfig } from '../../store/ConfigContext';
import { ProBadge } from '../../components';

/**
 * Palette.
 *
 * @return {JSX.Element} The palette pane.
 */
export default function Palette() {
	const { dispatch, selected } = useBuilder();
	const { proActive } = useConfig();
	const [ filter, setFilter ] = useState( '' );
	const groups = typesByCategory();

	// Add into the selected section, else to the selected node's parent,
	// else top level.
	const targetParent =
		selected && selected.type === 'section'
			? selected.id
			: selected
			? selected.parent
			: '';

	/**
	 * Add a field type to the canvas.
	 *
	 * @param {Object} type Registry entry.
	 * @return {void}
	 */
	const add = ( type ) => {
		if ( type.proOnly && ! proActive ) {
			return;
		}
		dispatch( {
			type: 'ADD',
			fieldType: type.slug,
			parentId: targetParent,
		} );
	};

	const lower = filter.toLowerCase();

	return (
		<aside
			className="dpo-palette"
			aria-label={ __(
				'Add field',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<input
				type="search"
				className="dpo-input dpo-palette__search"
				placeholder={ __(
					'Find a field…',
					'dynamic-product-options-for-woocommerce'
				) }
				value={ filter }
				onChange={ ( e ) => setFilter( e.target.value ) }
			/>
			<div className="dpo-palette__scroll">
				{ groups.map( ( group ) => {
					const items = group.items.filter(
						( t ) =>
							! lower ||
							t.label.toLowerCase().includes( lower )
					);
					if ( ! items.length ) {
						return null;
					}
					return (
						<div
							key={ group.key }
							className="dpo-palette__group"
						>
							<h3 className="dpo-palette__cat">
								{ group.label }
							</h3>
							<div className="dpo-palette__items">
								{ items.map( ( type ) => {
									const locked =
										type.proOnly && ! proActive;
									return (
										<button
											key={ type.slug }
											type="button"
											className={ `dpo-palette__item${
												locked
													? ' is-locked'
													: ''
											}` }
											onClick={ () =>
												add( type )
											}
											draggable={ ! locked }
											onDragStart={ ( e ) =>
												e.dataTransfer.setData(
													'text/dpo-type',
													type.slug
												)
											}
											title={ type.label }
										>
											<span
												className={ `dashicons dashicons-${ type.icon }` }
												aria-hidden="true"
											/>
											<span className="dpo-palette__label">
												{ type.label }
											</span>
											{ locked && (
												<ProBadge text="" />
											) }
										</button>
									);
								} ) }
							</div>
						</div>
					);
				} ) }
			</div>
		</aside>
	);
}
