/**
 * "Option Performance" card — header + toolbar, a sortable per-set table
 * and a paginated footer. Owns the client-side search / filter / sort /
 * page state and the CSV export. The data is the lifetime per-set
 * aggregate (the API does not range-filter it), which the subtitle and
 * column labels stay honest about.
 *
 * @package
 */

import { useMemo, useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { SkeletonTable, EmptyState, Pagination } from '../../components';
import { ratio, tableToCsv, downloadFile } from './helpers';
import OptionTableToolbar from './OptionTableToolbar';
import OptionRow from './OptionRow';

const PER_PAGE = 8;

/** Column descriptors. `sort` keys map to sortValue() below. */
const COLUMNS = [
	{
		key: 'option',
		sort: 'option',
		label: __(
			'Option details',
			'simple-product-customizer'
		),
	},
	{
		key: 'clicks',
		sort: 'clicks',
		label: __( 'Clicks', 'simple-product-customizer' ),
	},
	{
		key: 'cart',
		sort: 'cart',
		label: __( 'Cart rate', 'simple-product-customizer' ),
	},
	{
		key: 'conversion',
		sort: 'conversion',
		label: __( 'Conversion', 'simple-product-customizer' ),
	},
	{
		key: 'revenue',
		sort: 'revenue',
		label: __( 'Revenue', 'simple-product-customizer' ),
	},
	{
		key: 'ctr',
		sort: 'ctr',
		label: __( 'CTR', 'simple-product-customizer' ),
		end: true,
	},
];

/**
 * Comparable value for a sort key (derived rates included).
 *
 * @param {Object} r   Row.
 * @param {string} key Sort key.
 * @return {number|string} Sortable value.
 */
function sortValue( r, key ) {
	switch ( key ) {
		case 'option':
			return String( r.title || `#${ r.set_id }` ).toLowerCase();
		case 'cart':
			return ratio( r.add_to_cart, r.clicks );
		case 'conversion':
			return ratio( r.orders, r.add_to_cart );
		case 'ctr':
			return Number( r.ctr ) || 0;
		default:
			return Number( r[ key ] ) || 0;
	}
}

/**
 * OptionTable.
 *
 * @param {Object} props        Component props.
 * @param {string} props.status loading|error|ready.
 * @param {string} props.error  Error message.
 * @param {Array}  props.rows   Analytics table rows.
 * @return {JSX.Element} The card.
 */
export default function OptionTable( { status, error, rows } ) {
	const [ term, setTerm ] = useState( '' );
	const [ filter, setFilter ] = useState( 'all' );
	const [ sort, setSort ] = useState( { key: 'revenue', dir: 'desc' } );
	const [ page, setPage ] = useState( 1 );

	const onSearch = useCallback( ( v ) => {
		setTerm( v );
		setPage( 1 );
	}, [] );

	const onFilter = useCallback( ( id ) => {
		setFilter( id );
		setPage( 1 );
	}, [] );

	const onSort = useCallback( ( key ) => {
		setPage( 1 );
		setSort( ( s ) =>
			s.key === key
				? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
				: { key, dir: key === 'option' ? 'asc' : 'desc' }
		);
	}, [] );

	/* Filtered + searched + sorted view of the full table. */
	const filtered = useMemo( () => {
		let out = rows.slice();
		const q = term.trim().toLowerCase();
		if ( q ) {
			out = out.filter( ( r ) =>
				String( r.title || `#${ r.set_id }` )
					.toLowerCase()
					.includes( q )
			);
		}
		if ( filter === 'orders' ) {
			out = out.filter( ( r ) => ( Number( r.orders ) || 0 ) > 0 );
		} else if ( filter === 'revenue' ) {
			out = out.filter( ( r ) => ( Number( r.revenue ) || 0 ) > 0 );
		}
		const sign = sort.dir === 'asc' ? 1 : -1;
		return out.sort( ( a, b ) => {
			const av = sortValue( a, sort.key );
			const bv = sortValue( b, sort.key );
			if ( typeof av === 'string' ) {
				return av.localeCompare( bv ) * sign;
			}
			return ( av - bv ) * sign;
		} );
	}, [ rows, term, filter, sort ] );

	const max = useMemo(
		() => ( {
			clicks: Math.max( 1, ...filtered.map( ( r ) => r.clicks || 0 ) ),
			revenue: Math.max( 1, ...filtered.map( ( r ) => r.revenue || 0 ) ),
		} ),
		[ filtered ]
	);

	const totalPages = Math.max( 1, Math.ceil( filtered.length / PER_PAGE ) );
	const safePage = Math.min( page, totalPages );
	const pageRows = filtered.slice(
		( safePage - 1 ) * PER_PAGE,
		safePage * PER_PAGE
	);

	const onExport = () =>
		downloadFile( 'option-performance.csv', tableToCsv( filtered ) );

	/**
	 * aria-sort for a column.
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

	const sortIcon = ( key ) => {
		if ( sort.key !== key ) {
			return 'sort';
		}
		return sort.dir === 'asc' ? 'arrow-up-alt2' : 'arrow-down-alt2';
	};

	return (
		<section className="spcus-an-card spcus-an-table">
			<header className="spcus-an-table__head">
				<div>
					<h2 className="spcus-an-table__title">
						{ __(
							'Option Performance',
							'simple-product-customizer'
						) }
					</h2>
					<p className="spcus-an-table__sub">
						{ status === 'ready'
							? sprintf(
									/* translators: 1: shown count 2: total */
									__(
										'Showing %1$d of %2$d options',
										'simple-product-customizer'
									),
									pageRows.length,
									rows.length
							  )
							: __(
									'Per-option lifetime totals',
									'simple-product-customizer'
							  ) }
					</p>
				</div>
				<OptionTableToolbar
					term={ term }
					onSearch={ onSearch }
					filter={ filter }
					onFilter={ onFilter }
					onExport={ onExport }
					canExport={ status === 'ready' && filtered.length > 0 }
				/>
			</header>

			{ status === 'loading' && <SkeletonTable rows={ 6 } cols={ 5 } /> }

			{ status === 'error' && (
				<div className="spcus-an-state">
					<p className="spcus-error">{ error }</p>
				</div>
			) }

			{ status === 'ready' && filtered.length === 0 && (
				<div className="spcus-an-state">
					<EmptyState
						icon="chart-bar"
						title={ __(
							'No options to show',
							'simple-product-customizer'
						) }
						text={
							rows.length === 0
								? __(
										'Stats appear once shoppers view products with option sets.',
										'simple-product-customizer'
								  )
								: __(
										'No options match the current search or filter.',
										'simple-product-customizer'
								  )
						}
					/>
				</div>
			) }

			{ status === 'ready' && filtered.length > 0 && (
				<>
					<div className="spcus-an-tablewrap">
						<table className="spcus-an-grid">
							<thead>
								<tr>
									{ COLUMNS.map( ( col ) => (
										<th
											key={ col.key }
											scope="col"
											className={ `spcus-an-th${
												col.end ? ' spcus-an-th--end' : ''
											}` }
											aria-sort={ ariaSort( col.sort ) }
										>
											<button
												type="button"
												className={ `spcus-an-sort${
													sort.key === col.sort
														? ' is-active'
														: ''
												}` }
												onClick={ () =>
													onSort( col.sort )
												}
											>
												{ col.label }
												<span
													className={ `dashicons dashicons-${ sortIcon(
														col.sort
													) } spcus-an-sort__icon` }
													aria-hidden="true"
												/>
											</button>
										</th>
									) ) }
								</tr>
							</thead>
							<tbody>
								{ pageRows.map( ( r ) => (
									<OptionRow
										key={ r.set_id }
										row={ r }
										max={ max }
									/>
								) ) }
							</tbody>
						</table>
					</div>

					<footer className="spcus-an-foot">
						<span className="spcus-an-foot__info">
							{ sprintf(
								/* translators: 1: current page 2: total pages */
								__(
									'Page %1$d of %2$d',
									'simple-product-customizer'
								),
								safePage,
								totalPages
							) }
						</span>
						<Pagination
							page={ safePage }
							total={ totalPages }
							onChange={ setPage }
						/>
					</footer>
				</>
			) }
		</section>
	);
}
