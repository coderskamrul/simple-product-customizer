/**
 * Builder centre pane — the ordered field tree. Empty state prompts adding
 * the first field; a tail dropzone accepts palette drags / moved nodes.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { useBuilder } from '../../store/BuilderContext';
import { EmptyState } from '../../components';
import FieldNode from './FieldNode';

/**
 * Canvas.
 *
 * @return {JSX.Element} The canvas pane.
 */
export default function Canvas() {
	const { tree, dispatch } = useBuilder();

	/**
	 * Handle a drop onto the root tail (append).
	 *
	 * @param {DragEvent} e Drop event.
	 * @return {void}
	 */
	const onTailDrop = ( e ) => {
		e.preventDefault();
		const moveId = e.dataTransfer.getData( 'text/dpo-move' );
		const newType = e.dataTransfer.getData( 'text/dpo-type' );
		if ( moveId ) {
			dispatch( { type: 'MOVE', id: moveId, parentId: '' } );
		} else if ( newType ) {
			dispatch( { type: 'ADD', fieldType: newType, parentId: '' } );
		}
	};

	return (
		<div className="dpo-canvas">
			{ tree.length === 0 ? (
				<EmptyState
					icon="plus-alt2"
					title={ __(
						'This option set is empty',
						'dynamic-product-options-for-woocommerce'
					) }
					text={ __(
						'Pick a field from the palette on the left to begin building.',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			) : (
				<ul className="dpo-canvas__tree">
					{ tree.map( ( node, i ) => (
						<FieldNode
							key={ node.id }
							node={ node }
							index={ i }
							parentId=""
							siblings={ tree }
						/>
					) ) }
				</ul>
			) }
			<div
				className="dpo-canvas__tail"
				onDragOver={ ( e ) => e.preventDefault() }
				onDrop={ onTailDrop }
			>
				{ __(
					'Drop here to add at the end',
					'dynamic-product-options-for-woocommerce'
				) }
			</div>
		</div>
	);
}
