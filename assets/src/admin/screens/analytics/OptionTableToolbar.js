/**
 * Option-table toolbar: live search, a filter popover and a CSV export.
 * Reuses the shared `spcus-os-btn` system so it stays visually consistent
 * with the Option Sets screen.
 *
 * @package
 */

import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/** Client-side filters over the (all-time) per-set table. */
export const FILTERS = [
	{
		id: 'all',
		label: __( 'All options', 'simple-product-customizer' ),
	},
	{
		id: 'orders',
		label: __( 'With orders', 'simple-product-customizer' ),
	},
	{
		id: 'revenue',
		label: __( 'With revenue', 'simple-product-customizer' ),
	},
];

/**
 * OptionTableToolbar.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.term      Search term.
 * @param {Function} props.onSearch  (value) => void.
 * @param {string}   props.filter    Active filter id.
 * @param {Function} props.onFilter  (id) => void.
 * @param {Function} props.onExport  Export handler.
 * @param {boolean}  props.canExport Whether there is data to export.
 * @return {JSX.Element} The toolbar.
 */
export default function OptionTableToolbar( {
	term,
	onSearch,
	filter,
	onFilter,
	onExport,
	canExport,
} ) {
	const [ open, setOpen ] = useState( false );
	const wrapRef = useRef( null );

	useEffect( () => {
		if ( ! open ) {
			return undefined;
		}
		const onDoc = ( e ) => {
			if ( wrapRef.current && ! wrapRef.current.contains( e.target ) ) {
				setOpen( false );
			}
		};
		const onKey = ( e ) => e.key === 'Escape' && setOpen( false );
		document.addEventListener( 'mousedown', onDoc );
		document.addEventListener( 'keydown', onKey );
		return () => {
			document.removeEventListener( 'mousedown', onDoc );
			document.removeEventListener( 'keydown', onKey );
		};
	}, [ open ] );

	const active = FILTERS.find( ( f ) => f.id === filter ) || FILTERS[ 0 ];

	return (
		<div className="spcus-an-toolbar">
			<div className="spcus-os-search spcus-an-search">
				<span
					className="dashicons dashicons-search spcus-os-search__icon"
					aria-hidden="true"
				/>
				<input
					type="search"
					className="spcus-os-search__input"
					placeholder={ __(
						'Search options…',
						'simple-product-customizer'
					) }
					value={ term }
					onChange={ ( e ) => onSearch( e.target.value ) }
					aria-label={ __(
						'Search options',
						'simple-product-customizer'
					) }
				/>
			</div>

			<div className="spcus-os-filter" ref={ wrapRef }>
				<button
					type="button"
					className={ `spcus-os-btn spcus-os-btn--ghost${
						filter !== 'all' ? ' is-on' : ''
					}` }
					aria-haspopup="menu"
					aria-expanded={ open }
					onClick={ () => setOpen( ( v ) => ! v ) }
				>
					<span
						className="dashicons dashicons-filter"
						aria-hidden="true"
					/>
					{ __(
						'Filter',
						'simple-product-customizer'
					) }
					{ filter !== 'all' && (
						<span className="spcus-os-filter__tag">
							{ active.label }
						</span>
					) }
				</button>
				{ open && (
					<ul className="spcus-os-menu" role="menu">
						{ FILTERS.map( ( f ) => (
							<li key={ f.id } role="none">
								<button
									type="button"
									role="menuitemradio"
									aria-checked={ f.id === filter }
									className={ `spcus-os-menu__item${
										f.id === filter ? ' is-active' : ''
									}` }
									onClick={ () => {
										onFilter( f.id );
										setOpen( false );
									} }
								>
									<span
										className="dashicons dashicons-yes spcus-os-menu__tick"
										aria-hidden="true"
									/>
									{ f.label }
								</button>
							</li>
						) ) }
					</ul>
				) }
			</div>

			<button
				type="button"
				className="spcus-os-btn spcus-os-btn--ghost"
				onClick={ onExport }
				disabled={ ! canExport }
			>
				<span
					className="dashicons dashicons-download"
					aria-hidden="true"
				/>
				{ __( 'Export', 'simple-product-customizer' ) }
			</button>
		</div>
	);
}
