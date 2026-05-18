/**
 * Reorderable repeatable rows with add/remove. Used by the Choices inspector
 * tab. Rows are reordered by drag (via DragList) and rendered by the caller.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import DragList, { reorder } from './DragList';

/**
 * Repeater.
 *
 * @param {Object}   props             Component props.
 * @param {Array}    props.rows        Row data array.
 * @param {Function} props.onChange    (nextRows) => void.
 * @param {Function} props.renderRow   (row, index) => JSX (row body).
 * @param {Function} props.makeRow     () => newRow.
 * @param {string}   [props.addLabel]  Add button label.
 * @param {boolean}  [props.canAdd]    Whether adding is allowed.
 * @param {JSX.Element} [props.addHint] Node shown next to a disabled add.
 * @return {JSX.Element} The repeater.
 */
export default function Repeater( {
	rows,
	onChange,
	renderRow,
	makeRow,
	addLabel = __( 'Add row', 'dynamic-product-options-for-woocommerce' ),
	canAdd = true,
	addHint = null,
} ) {
	/**
	 * Remove a row by index.
	 *
	 * @param {number} idx Row index.
	 * @return {void}
	 */
	const removeAt = ( idx ) =>
		onChange( rows.filter( ( _, i ) => i !== idx ) );

	return (
		<div className="dpo-repeater">
			<DragList
				items={ rows.map( ( r, i ) => ( {
					...r,
					key: r.uid || i,
				} ) ) }
				onReorder={ ( from, to ) =>
					onChange( reorder( rows, from, to ) )
				}
				renderItem={ ( row, idx, handleProps ) => (
					<div className="dpo-repeater__row">
						<span
							className="dpo-repeater__handle dashicons dashicons-move"
							{ ...handleProps }
							aria-label={ __(
								'Drag to reorder',
								'dynamic-product-options-for-woocommerce'
							) }
						/>
						<div className="dpo-repeater__body">
							{ renderRow( rows[ idx ], idx ) }
						</div>
						<button
							type="button"
							className="dpo-icon-btn dpo-repeater__remove"
							onClick={ () => removeAt( idx ) }
							aria-label={ __(
								'Remove row',
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<span
								className="dashicons dashicons-trash"
								aria-hidden="true"
							/>
						</button>
					</div>
				) }
			/>
			<div className="dpo-repeater__foot">
				<button
					type="button"
					className="dpo-btn dpo-btn--ghost"
					disabled={ ! canAdd }
					onClick={ () => onChange( [ ...rows, makeRow() ] ) }
				>
					<span
						className="dashicons dashicons-plus-alt2"
						aria-hidden="true"
					/>
					{ addLabel }
				</button>
				{ ! canAdd && addHint }
			</div>
		</div>
	);
}
