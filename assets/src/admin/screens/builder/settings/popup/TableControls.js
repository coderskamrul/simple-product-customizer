/**
 * Contextual table toolbar. Renders only while the caret sits inside a table
 * and exposes the row/column/header operations needed to build a fully dynamic
 * table — add or delete rows and columns, toggle the header row, merge/split
 * cells, and remove the whole table.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	BetweenVerticalStart,
	BetweenVerticalEnd,
	BetweenHorizontalStart,
	BetweenHorizontalEnd,
	Columns3,
	Rows3,
	Heading,
	TableCellsMerge,
	TableCellsSplit,
	Trash2,
} from 'lucide-react';

/**
 * One labelled table-op button.
 *
 * @param {Object}      props          Component props.
 * @param {Function}    props.onClick  Click handler.
 * @param {string}      props.title    Tooltip / aria-label.
 * @param {boolean}     [props.danger] Style as destructive.
 * @param {JSX.Element} props.children Icon.
 * @return {JSX.Element} The button.
 */
function TBtn( { onClick, title, danger = false, children } ) {
	return (
		<button
			type="button"
			className={ `dpo-rte__tbtn${ danger ? ' is-danger' : '' }` }
			onClick={ onClick }
			title={ title }
			aria-label={ title }
		>
			{ children }
		</button>
	);
}

/**
 * Table controls bar.
 *
 * @param {Object} props        Component props.
 * @param {Object} props.editor TipTap editor instance.
 * @return {JSX.Element|null} The bar, or null when not in a table.
 */
export default function TableControls( { editor } ) {
	if ( ! editor || ! editor.isActive( 'table' ) ) {
		return null;
	}
	const chain = () => editor.chain().focus();

	return (
		<div className="dpo-rte__tablebar" role="toolbar">
			<span className="dpo-rte__tablebar-label">
				{ __( 'Table', 'dynamic-product-options-for-woocommerce' ) }
			</span>

			<TBtn
				title={ __(
					'Add column before',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().addColumnBefore().run() }
			>
				<BetweenVerticalStart size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Add column after',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().addColumnAfter().run() }
			>
				<BetweenVerticalEnd size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Delete column',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().deleteColumn().run() }
			>
				<Columns3 size={ 15 } />
			</TBtn>

			<span className="dpo-rte__sep" aria-hidden="true" />

			<TBtn
				title={ __(
					'Add row above',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().addRowBefore().run() }
			>
				<BetweenHorizontalStart size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Add row below',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().addRowAfter().run() }
			>
				<BetweenHorizontalEnd size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Delete row',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().deleteRow().run() }
			>
				<Rows3 size={ 15 } />
			</TBtn>

			<span className="dpo-rte__sep" aria-hidden="true" />

			<TBtn
				title={ __(
					'Toggle header row',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().toggleHeaderRow().run() }
			>
				<Heading size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Merge cells',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().mergeCells().run() }
			>
				<TableCellsMerge size={ 15 } />
			</TBtn>
			<TBtn
				title={ __(
					'Split cell',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().splitCell().run() }
			>
				<TableCellsSplit size={ 15 } />
			</TBtn>

			<span className="dpo-rte__sep" aria-hidden="true" />

			<TBtn
				danger
				title={ __(
					'Delete table',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ () => chain().deleteTable().run() }
			>
				<Trash2 size={ 15 } />
			</TBtn>
		</div>
	);
}
