/**
 * A single option-set table row.
 *
 * The list API returns id / title / published / fields-count only, so the
 * Category and Products cells render an honest neutral placeholder rather
 * than fabricated data — the layout still matches the design 1:1.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import useId from '../../app/useId';
import { Avatar, Badge, ProgressBar } from '../../components';

/**
 * OptionSetRow.
 *
 * @param {Object}   props                Component props.
 * @param {Object}   props.item           List row { id, title, published, fields }.
 * @param {boolean}  props.selected       Whether the row is selected.
 * @param {boolean}  props.busy           Whether a mutation is in flight.
 * @param {Function} props.onSelect       (id) => void.
 * @param {Function} props.onToggleStatus (item) => void.
 * @param {Function} props.onDuplicate    (id) => void.
 * @param {Function} props.onDelete       (id) => void.
 * @param {Function} props.onOpen         (id) => void.
 * @return {JSX.Element} The row.
 */
export default function OptionSetRow( {
	item,
	selected,
	busy,
	onSelect,
	onToggleStatus,
	onDuplicate,
	onDelete,
	onOpen,
} ) {
	const switchId = useId( 'dpo-os-switch' );
	const title =
		item.title ||
		__( '(untitled)', 'dynamic-product-options-for-woocommerce' );

	/**
	 * Action icon button.
	 *
	 * @param {Object}   cfg          Button config.
	 * @param {string}   cfg.icon     Dashicon slug.
	 * @param {string}   cfg.label    Accessible label.
	 * @param {Function} cfg.onClick  Click handler.
	 * @param {boolean}  [cfg.danger] Destructive styling.
	 * @return {JSX.Element} The button.
	 */
	const action = ( { icon, label, onClick, danger } ) => (
		<button
			type="button"
			className={ `dpo-os-iconbtn${
				danger ? ' dpo-os-iconbtn--danger' : ''
			}` }
			title={ label }
			aria-label={ label }
			onClick={ onClick }
			disabled={ busy }
		>
			<span
				className={ `dashicons dashicons-${ icon }` }
				aria-hidden="true"
			/>
		</button>
	);

	return (
		<tr
			className={ `dpo-os-row${ selected ? ' is-selected' : '' }${
				item.published ? '' : ' is-draft'
			}` }
		>
			<td className="dpo-os-cell dpo-os-cell--check">
				<input
					type="checkbox"
					className="dpo-os-check"
					checked={ selected }
					onChange={ () => onSelect( item.id ) }
					aria-label={ sprintf(
						/* translators: %s: option set title */
						__(
							'Select %s',
							'dynamic-product-options-for-woocommerce'
						),
						title
					) }
				/>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--id"
				data-label={ __(
					'ID',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<span className="dpo-os-id">#{ item.id }</span>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--name"
				data-label={ __(
					'Option Name',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<button
					type="button"
					className="dpo-os-name"
					onClick={ () => onOpen( item.id ) }
				>
					<Avatar label={ title } seed={ item.id } />
					<span className="dpo-os-name__text">{ title }</span>
				</button>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--status"
				data-label={ __(
					'Status',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<span className="dpo-os-switch">
					<input
						id={ switchId }
						type="checkbox"
						className="dpo-os-switch__input"
						checked={ !! item.published }
						disabled={ busy }
						onChange={ () => onToggleStatus( item ) }
					/>
					<label
						className="dpo-os-switch__track"
						htmlFor={ switchId }
					>
						<span className="dpo-os-switch__thumb" />
						<span className="screen-reader-text">
							{ sprintf(
								/* translators: %s: option set title */
								__(
									'Toggle status for %s',
									'dynamic-product-options-for-woocommerce'
								),
								title
							) }
						</span>
					</label>
					<span className="dpo-os-switch__label">
						{ item.published
							? __(
									'Active',
									'dynamic-product-options-for-woocommerce'
							  )
							: __(
									'Inactive',
									'dynamic-product-options-for-woocommerce'
							  ) }
					</span>
				</span>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--category"
				data-label={ __(
					'Category',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<Badge variant="muted">—</Badge>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--products"
				data-label={ __(
					'Products',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<ProgressBar value={ null } />
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--options"
				data-label={ __(
					'Options',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<span className="dpo-os-count">
					<span
						className="dashicons dashicons-screenoptions"
						aria-hidden="true"
					/>
					{ item.fields || 0 }
				</span>
			</td>

			<td
				className="dpo-os-cell dpo-os-cell--actions"
				data-label={ __(
					'Actions',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<div className="dpo-os-actions">
					{ action( {
						icon: 'visibility',
						label: __(
							'Open option set',
							'dynamic-product-options-for-woocommerce'
						),
						onClick: () => onOpen( item.id ),
					} ) }
					{ action( {
						icon: 'edit',
						label: __(
							'Edit option set',
							'dynamic-product-options-for-woocommerce'
						),
						onClick: () => onOpen( item.id ),
					} ) }
					{ action( {
						icon: 'admin-page',
						label: __(
							'Duplicate option set',
							'dynamic-product-options-for-woocommerce'
						),
						onClick: () => onDuplicate( item.id ),
					} ) }
					{ action( {
						icon: 'trash',
						label: __(
							'Delete option set',
							'dynamic-product-options-for-woocommerce'
						),
						onClick: () => onDelete( item.id ),
						danger: true,
					} ) }
				</div>
			</td>
		</tr>
	);
}
