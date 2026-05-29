/**
 * Search + status filter + export / import / new-set actions.
 *
 * @package DPO\Admin
 */

import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/** Status filter choices (client-side over the loaded page). */
const FILTERS = [
	{ id: 'all', label: __( 'All', 'dynamic-product-options-for-woocommerce' ) },
	{
		id: 'active',
		label: __( 'Active', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		id: 'inactive',
		label: __( 'Inactive', 'dynamic-product-options-for-woocommerce' ),
	},
];

/**
 * OptionSetToolbar.
 *
 * @param {Object}   props            Component props.
 * @param {string}   props.term       Search term.
 * @param {Function} props.onSearch   (value) => void.
 * @param {string}   props.filter     Active status filter id.
 * @param {Function} props.onFilter   (id) => void.
 * @param {Function} props.onExport   Export handler.
 * @param {Function} props.onImport   Import handler (opens file picker).
 * @return {JSX.Element} The toolbar.
 */
export default function OptionSetToolbar( {
	term,
	onSearch,
	filter,
	onFilter,
	onExport,
	onImport,
} ) {
	const [ open, setOpen ] = useState( false );
	const filterRef = useRef( null );

	useEffect( () => {
		if ( ! open ) {
			return undefined;
		}
		const onDoc = ( e ) => {
			if (
				filterRef.current &&
				! filterRef.current.contains( e.target )
			) {
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

	const activeFilter =
		FILTERS.find( ( f ) => f.id === filter ) || FILTERS[ 0 ];

	return (
		<div className="dpo-os-toolbar">
			<div className="dpo-os-search">
				<span
					className="dashicons dashicons-search dpo-os-search__icon"
					aria-hidden="true"
				/>
				<input
					type="search"
					className="dpo-os-search__input"
					placeholder={ __(
						'Search options…',
						'dynamic-product-options-for-woocommerce'
					) }
					value={ term }
					onChange={ ( e ) => onSearch( e.target.value ) }
					aria-label={ __(
						'Search option sets',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			</div>

			<div className="dpo-os-filter" ref={ filterRef }>
				<button
					type="button"
					className={ `dpo-os-btn dpo-os-btn--ghost${
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
						'dynamic-product-options-for-woocommerce'
					) }
					{ filter !== 'all' && (
						<span className="dpo-os-filter__tag">
							{ activeFilter.label }
						</span>
					) }
				</button>
				{ open && (
					<ul className="dpo-os-menu" role="menu">
						{ FILTERS.map( ( f ) => (
							<li key={ f.id } role="none">
								<button
									type="button"
									role="menuitemradio"
									aria-checked={ f.id === filter }
									className={ `dpo-os-menu__item${
										f.id === filter
											? ' is-active'
											: ''
									}` }
									onClick={ () => {
										onFilter( f.id );
										setOpen( false );
									} }
								>
									<span
										className="dashicons dashicons-yes dpo-os-menu__tick"
										aria-hidden="true"
									/>
									{ f.label }
								</button>
							</li>
						) ) }
					</ul>
				) }
			</div>

			<div className="dpo-os-toolbar__spacer" />

			<button
				type="button"
				className="dpo-os-btn dpo-os-btn--ghost"
				onClick={ onExport }
			>
				<span
					className="dashicons dashicons-download"
					aria-hidden="true"
				/>
				{ __( 'Export', 'dynamic-product-options-for-woocommerce' ) }
			</button>
			<button
				type="button"
				className="dpo-os-btn dpo-os-btn--ghost"
				onClick={ onImport }
			>
				<span
					className="dashicons dashicons-upload"
					aria-hidden="true"
				/>
				{ __( 'Import', 'dynamic-product-options-for-woocommerce' ) }
			</button>
		</div>
	);
}
