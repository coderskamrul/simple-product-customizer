/**
 * One row in the builder canvas tree. Handles selection, inline
 * duplicate/delete/move, and HTML5 drag-reorder + drop-to-nest into
 * `section` nodes. Recurses for section children.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { getType } from '../../fields/registry';
import { useBuilder } from '../../store/BuilderContext';

/**
 * FieldNode.
 *
 * @param {Object} props        Component props.
 * @param {Object} props.node   The field node.
 * @param {number} props.index  Index within its sibling list.
 * @param {string} props.parentId Parent id ('' for root).
 * @param {Array}  props.siblings Sibling list (for move bounds).
 * @return {JSX.Element} The node row.
 */
export default function FieldNode( {
	node,
	index,
	parentId,
	siblings,
} ) {
	const { selectedId, dispatch } = useBuilder();
	const def = getType( node.type );
	const isSection = node.type === 'section';
	const selected = selectedId === node.id;

	/**
	 * Move this node up/down within its current parent.
	 *
	 * @param {number} delta -1 up, +1 down.
	 * @return {void}
	 */
	const move = ( delta ) => {
		const to = index + delta;
		if ( to < 0 || to >= siblings.length ) {
			return;
		}
		dispatch( {
			type: 'MOVE',
			id: node.id,
			parentId,
			index: to,
		} );
	};

	return (
		<li
			className={ `dpo-node dpo-node--${ node.type }${
				selected ? ' is-selected' : ''
			}` }
			draggable
			onDragStart={ ( e ) => {
				e.stopPropagation();
				e.dataTransfer.setData( 'text/dpo-move', node.id );
				e.dataTransfer.effectAllowed = 'move';
			} }
			onDragOver={ ( e ) => {
				if (
					e.dataTransfer.types.includes( 'text/dpo-move' ) ||
					e.dataTransfer.types.includes( 'text/dpo-type' )
				) {
					e.preventDefault();
				}
			} }
			onDrop={ ( e ) => {
				e.preventDefault();
				e.stopPropagation();
				const moveId = e.dataTransfer.getData( 'text/dpo-move' );
				const newType = e.dataTransfer.getData( 'text/dpo-type' );
				// Drop onto a section nests inside it; otherwise reorder.
				const dropParent = isSection ? node.id : parentId;
				const dropIndex = isSection ? undefined : index;
				if ( moveId && moveId !== node.id ) {
					dispatch( {
						type: 'MOVE',
						id: moveId,
						parentId: dropParent,
						index: dropIndex,
					} );
				} else if ( newType ) {
					dispatch( {
						type: 'ADD',
						fieldType: newType,
						parentId: dropParent,
						index: dropIndex,
					} );
				}
			} }
		>
			<div
				className="dpo-node__bar"
				onClick={ () =>
					dispatch( { type: 'SELECT', id: node.id } )
				}
				role="button"
				tabIndex={ 0 }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						dispatch( { type: 'SELECT', id: node.id } );
					}
				} }
			>
				<span
					className="dpo-node__handle dashicons dashicons-move"
					aria-hidden="true"
				/>
				<span
					className={ `dpo-node__icon dashicons dashicons-${ def.icon }` }
					aria-hidden="true"
				/>
				<span className="dpo-node__label">
					{ node.label ||
						def.label ||
						__(
							'(no label)',
							'dynamic-product-options-for-woocommerce'
						) }
				</span>
				<span className="dpo-node__type">{ node.type }</span>
				{ node.required && (
					<span
						className="dpo-node__req"
						title={ __(
							'Required',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						*
					</span>
				) }
				<span className="dpo-node__tools">
					<button
						type="button"
						className="dpo-icon-btn"
						aria-label={ __(
							'Move up',
							'dynamic-product-options-for-woocommerce'
						) }
						onClick={ ( e ) => {
							e.stopPropagation();
							move( -1 );
						} }
					>
						<span
							className="dashicons dashicons-arrow-up-alt2"
							aria-hidden="true"
						/>
					</button>
					<button
						type="button"
						className="dpo-icon-btn"
						aria-label={ __(
							'Move down',
							'dynamic-product-options-for-woocommerce'
						) }
						onClick={ ( e ) => {
							e.stopPropagation();
							move( 1 );
						} }
					>
						<span
							className="dashicons dashicons-arrow-down-alt2"
							aria-hidden="true"
						/>
					</button>
					<button
						type="button"
						className="dpo-icon-btn"
						aria-label={ __(
							'Duplicate',
							'dynamic-product-options-for-woocommerce'
						) }
						onClick={ ( e ) => {
							e.stopPropagation();
							dispatch( {
								type: 'DUPLICATE',
								id: node.id,
							} );
						} }
					>
						<span
							className="dashicons dashicons-admin-page"
							aria-hidden="true"
						/>
					</button>
					<button
						type="button"
						className="dpo-icon-btn dpo-icon-btn--danger"
						aria-label={ __(
							'Delete',
							'dynamic-product-options-for-woocommerce'
						) }
						onClick={ ( e ) => {
							e.stopPropagation();
							dispatch( {
								type: 'REMOVE',
								id: node.id,
							} );
						} }
					>
						<span
							className="dashicons dashicons-trash"
							aria-hidden="true"
						/>
					</button>
				</span>
			</div>

			{ isSection && (
				<ul className="dpo-node__children">
					{ ( node.children || [] ).length === 0 && (
						<li className="dpo-node__dropzone">
							{ __(
								'Drop fields here',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
					) }
					{ ( node.children || [] ).map( ( child, i ) => (
						<FieldNode
							key={ child.id }
							node={ child }
							index={ i }
							parentId={ node.id }
							siblings={ node.children }
						/>
					) ) }
				</ul>
			) }
		</li>
	);
}
