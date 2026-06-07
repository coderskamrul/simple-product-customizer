/**
 * The option-set data table: a sortable header, selectable rows and the
 * loading / error / empty states — all inside the card surface.
 *
 * @package
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SkeletonTable, EmptyState } from '../../components';
import OptionSetRow from './OptionSetRow';

/** Column descriptors. `sort` keys map to OptionSetScreen's comparator. */
const COLUMNS = [
	{
		key: 'id',
		label: __( 'ID', 'productkit-for-woocommerce' ),
		sort: 'id',
	},
	{
		key: 'name',
		label: __( 'Option Name', 'productkit-for-woocommerce' ),
		sort: 'title',
	},
	{
		key: 'status',
		label: __( 'Status', 'productkit-for-woocommerce' ),
		sort: 'published',
	},
	{
		key: 'category',
		label: __( 'Category', 'productkit-for-woocommerce' ),
	},
	{
		key: 'products',
		label: __( 'Products', 'productkit-for-woocommerce' ),
	},
	{
		key: 'options',
		label: __( 'Options', 'productkit-for-woocommerce' ),
		sort: 'fields',
	},
	{
		key: 'actions',
		label: __( 'Actions', 'productkit-for-woocommerce' ),
		end: true,
	},
];

/**
 * OptionSetTable.
 *
 * @param {Object} props Component props (see OptionSetScreen for wiring).
 * @return {JSX.Element} The table card body.
 */
export default function OptionSetTable( props ) {
	const {
		status,
		error,
		items,
		sort,
		onSort,
		selected,
		onSelectAll,
		onCreate,
		busyId,
	} = props;

	const allRef = useRef( null );
	const allChecked = items.length > 0 && selected.length === items.length;
	const someChecked = selected.length > 0 && ! allChecked;

	useEffect( () => {
		if ( allRef.current ) {
			allRef.current.indeterminate = someChecked;
		}
	}, [ someChecked ] );

	if ( status === 'loading' ) {
		return <SkeletonTable rows={ 8 } cols={ 5 } />;
	}

	if ( status === 'error' ) {
		return (
			<div className="pkitfw-os-state">
				<p className="pkitfw-error">{ error }</p>
			</div>
		);
	}

	if ( status === 'ready' && items.length === 0 ) {
		return (
			<div className="pkitfw-os-state">
				<EmptyState
					title={ __(
						'No option sets found',
						'productkit-for-woocommerce'
					) }
					text={ __(
						'Create your first option set to start selling configurable products.',
						'productkit-for-woocommerce'
					) }
					action={
						<button
							type="button"
							className="pkitfw-os-btn pkitfw-os-btn--primary"
							onClick={ onCreate }
						>
							<span
								className="dashicons dashicons-plus-alt2"
								aria-hidden="true"
							/>
							{ __(
								'New Option',
								'productkit-for-woocommerce'
							) }
						</button>
					}
				/>
			</div>
		);
	}

	/**
	 * Aria-sort value for a column.
	 *
	 * @param {string} key Sort key.
	 * @return {string} ascending|descending|none.
	 */
	const ariaSort = ( key ) => {
		if ( sort.key !== key ) {
			return 'none';
		}
		return sort.dir === 'asc' ? 'ascending' : 'descending';
	};

	/**
	 * Dashicon slug for a column's sort affordance.
	 *
	 * @param {string} key Sort key.
	 * @return {string} Dashicon slug.
	 */
	const sortIcon = ( key ) => {
		if ( sort.key !== key ) {
			return 'sort';
		}
		return sort.dir === 'asc' ? 'arrow-up-alt2' : 'arrow-down-alt2';
	};

	return (
		<div className="pkitfw-os-tablewrap">
			<table className="pkitfw-os-table">
				<thead>
					<tr>
						<th scope="col" className="pkitfw-os-th pkitfw-os-th--check">
							<input
								ref={ allRef }
								type="checkbox"
								className="pkitfw-os-check"
								checked={ allChecked }
								onChange={ onSelectAll }
								aria-label={ __(
									'Select all option sets',
									'productkit-for-woocommerce'
								) }
							/>
						</th>
						{ COLUMNS.map( ( col ) => (
							<th
								key={ col.key }
								scope="col"
								className={ `pkitfw-os-th pkitfw-os-th--${ col.key }${
									col.end ? ' pkitfw-os-th--end' : ''
								}` }
								aria-sort={
									col.sort ? ariaSort( col.sort ) : undefined
								}
							>
								{ col.sort ? (
									<button
										type="button"
										className={ `pkitfw-os-sort${
											sort.key === col.sort
												? ' is-active'
												: ''
										}` }
										onClick={ () => onSort( col.sort ) }
									>
										{ col.label }
										<span
											className={ `dashicons dashicons-${ sortIcon(
												col.sort
											) } pkitfw-os-sort__icon` }
											aria-hidden="true"
										/>
									</button>
								) : (
									col.label
								) }
							</th>
						) ) }
					</tr>
				</thead>
				<tbody>
					{ items.map( ( item ) => (
						<OptionSetRow
							key={ item.id }
							item={ item }
							busy={ busyId === item.id }
							selected={ selected.includes( item.id ) }
							onSelect={ props.onSelect }
							onToggleStatus={ props.onToggleStatus }
							onDuplicate={ props.onDuplicate }
							onDelete={ props.onDelete }
							onOpen={ props.onOpen }
						/>
					) ) }
				</tbody>
			</table>
		</div>
	);
}
