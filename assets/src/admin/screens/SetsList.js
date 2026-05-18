/**
 * Option Sets screen — searchable, paginated grid with status toggle,
 * duplicate, delete (confirm), import/export and bulk actions.
 *
 * @package DPO\Admin
 */

import {
	useEffect,
	useState,
	useRef,
	useCallback,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { SetsProvider, useSets } from '../store/SetsContext';
import { useToast } from '../store/ToastContext';
import { navigate } from '../app/router';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import {
	Panel,
	Spinner,
	EmptyState,
	ConfirmDialog,
} from '../components';

/**
 * Trigger a browser download of a JSON file.
 *
 * @param {string} name Filename.
 * @param {*}      data Serializable payload.
 * @return {void}
 */
function downloadJSON( name, data ) {
	const blob = new window.Blob( [ JSON.stringify( data, null, 2 ) ], {
		type: 'application/json',
	} );
	const url = window.URL.createObjectURL( blob );
	const a = document.createElement( 'a' );
	a.href = url;
	a.download = name;
	a.click();
	window.URL.revokeObjectURL( url );
}

/**
 * The inner list (consumes SetsContext).
 *
 * @return {JSX.Element} The list body.
 */
function List() {
	const sets = useSets();
	const { notify } = useToast();
	const [ term, setTerm ] = useState( '' );
	const [ selected, setSelected ] = useState( [] );
	const [ confirm, setConfirm ] = useState( null );
	const fileRef = useRef( null );
	const searchTimer = useRef( null );

	useEffect( () => {
		sets.load( { page: 1 } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const onSearch = useCallback(
		( v ) => {
			setTerm( v );
			if ( searchTimer.current ) {
				window.clearTimeout( searchTimer.current );
			}
			searchTimer.current = window.setTimeout(
				() => sets.load( { page: 1, search: v } ),
				350
			);
		},
		[ sets ]
	);

	/**
	 * Export a single set as JSON.
	 *
	 * @param {Object} item List row.
	 * @return {Promise<void>} Resolves after download.
	 */
	const exportSet = async ( item ) => {
		try {
			const res = await api.getSet( item.id );
			downloadJSON( `option-set-${ item.id }.json`, {
				items: [ res.set ],
			} );
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		}
	};

	/**
	 * Import sets from a chosen JSON file.
	 *
	 * @param {Event} e File input change.
	 * @return {void}
	 */
	const onImportFile = ( e ) => {
		const file = e.target.files && e.target.files[ 0 ];
		if ( ! file ) {
			return;
		}
		const reader = new window.FileReader();
		reader.onload = async () => {
			try {
				const parsed = JSON.parse( reader.result );
				await sets.importSets( parsed );
				notify(
					__(
						'Import complete.',
						'dynamic-product-options-for-woocommerce'
					),
					'success'
				);
			} catch ( err ) {
				notify(
					err instanceof SyntaxError
						? __(
								'Invalid JSON file.',
								'dynamic-product-options-for-woocommerce'
						  )
						: errorMessage( err ),
					'error'
				);
			}
		};
		reader.readAsText( file );
		e.target.value = '';
	};

	/**
	 * Run a bulk operation over the current selection.
	 *
	 * @param {string} op status-publish|status-draft|delete|duplicate.
	 * @return {Promise<void>} Resolves after reload.
	 */
	const runBulk = async ( op ) => {
		if ( ! selected.length ) {
			return;
		}
		try {
			if ( op === 'delete' ) {
				await api.bulkSets( { op: 'delete', ids: selected } );
			} else if ( op === 'duplicate' ) {
				await api.bulkSets( { op: 'duplicate', ids: selected } );
			} else {
				await api.bulkSets( {
					op: 'status',
					ids: selected,
					status:
						op === 'status-publish' ? 'publish' : 'draft',
				} );
			}
			setSelected( [] );
			await sets.load();
			notify(
				__(
					'Bulk action applied.',
					'dynamic-product-options-for-woocommerce'
				),
				'success'
			);
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		}
	};

	const toggle = ( id ) =>
		setSelected( ( s ) =>
			s.includes( id ) ? s.filter( ( x ) => x !== id ) : [ ...s, id ]
		);

	return (
		<div className="dpo-sets">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Option Sets',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
					<p className="dpo-screen-sub">
						{ __(
							'Reusable groups of product fields with pricing & logic.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
				<div className="dpo-screen-head__actions">
					<input
						type="file"
						accept="application/json,.json"
						ref={ fileRef }
						className="dpo-visually-hidden"
						onChange={ onImportFile }
					/>
					<button
						type="button"
						className="dpo-btn dpo-btn--ghost"
						onClick={ () => fileRef.current.click() }
					>
						{ __(
							'Import',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
					<button
						type="button"
						className="dpo-btn dpo-btn--primary"
						onClick={ () => navigate( '/set/new' ) }
					>
						<span
							className="dashicons dashicons-plus-alt2"
							aria-hidden="true"
						/>
						{ __(
							'Add New',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
				</div>
			</header>

			<Panel>
				<div className="dpo-toolbar">
					<input
						type="search"
						className="dpo-input dpo-toolbar__search"
						placeholder={ __(
							'Search option sets…',
							'dynamic-product-options-for-woocommerce'
						) }
						value={ term }
						onChange={ ( e ) => onSearch( e.target.value ) }
					/>
					{ selected.length > 0 && (
						<div className="dpo-bulkbar">
							<span>
								{ sprintf(
									/* translators: %d: number selected */
									__(
										'%d selected',
										'dynamic-product-options-for-woocommerce'
									),
									selected.length
								) }
							</span>
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost"
								onClick={ () =>
									runBulk( 'status-publish' )
								}
							>
								{ __(
									'Publish',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost"
								onClick={ () =>
									runBulk( 'status-draft' )
								}
							>
								{ __(
									'Draft',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost"
								onClick={ () => runBulk( 'duplicate' ) }
							>
								{ __(
									'Duplicate',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
							<button
								type="button"
								className="dpo-btn dpo-btn--danger"
								onClick={ () =>
									setConfirm( { bulk: true } )
								}
							>
								{ __(
									'Delete',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
						</div>
					) }
				</div>

				{ sets.status === 'loading' && <Spinner /> }
				{ sets.status === 'error' && (
					<p className="dpo-error">{ sets.error }</p>
				) }
				{ sets.status === 'ready' &&
					sets.items.length === 0 && (
						<EmptyState
							title={ __(
								'No option sets yet',
								'dynamic-product-options-for-woocommerce'
							) }
							text={ __(
								'Create your first option set to start selling configurable products.',
								'dynamic-product-options-for-woocommerce'
							) }
							action={
								<button
									type="button"
									className="dpo-btn dpo-btn--primary"
									onClick={ () =>
										navigate( '/set/new' )
									}
								>
									{ __(
										'Add New',
										'dynamic-product-options-for-woocommerce'
									) }
								</button>
							}
						/>
					) }

				{ sets.status === 'ready' &&
					sets.items.length > 0 && (
						<div className="dpo-cardgrid">
							{ sets.items.map( ( item ) => (
								<article
									key={ item.id }
									className={ `dpo-setcard${
										item.published
											? ''
											: ' is-draft'
									}` }
								>
									<label className="dpo-setcard__check">
										<input
											type="checkbox"
											checked={ selected.includes(
												item.id
											) }
											onChange={ () =>
												toggle( item.id )
											}
											aria-label={ sprintf(
												/* translators: %s: set title */
												__(
													'Select %s',
													'dynamic-product-options-for-woocommerce'
												),
												item.title
											) }
										/>
									</label>
									<button
										type="button"
										className="dpo-setcard__main"
										onClick={ () =>
											navigate(
												`/set/${ item.id }`
											)
										}
									>
										<h3 className="dpo-setcard__title">
											{ item.title ||
												__(
													'(untitled)',
													'dynamic-product-options-for-woocommerce'
												) }
										</h3>
										<p className="dpo-setcard__meta">
											{ sprintf(
												/* translators: %d: field count */
												__(
													'%d fields',
													'dynamic-product-options-for-woocommerce'
												),
												item.fields || 0
											) }
										</p>
										<span
											className={ `dpo-status-pill dpo-status-pill--${
												item.published
													? 'live'
													: 'draft'
											}` }
										>
											{ item.published
												? __(
														'Published',
														'dynamic-product-options-for-woocommerce'
												  )
												: __(
														'Draft',
														'dynamic-product-options-for-woocommerce'
												  ) }
										</span>
									</button>
									<div className="dpo-setcard__actions">
										<button
											type="button"
											className="dpo-icon-btn"
											title={ __(
												'Toggle status',
												'dynamic-product-options-for-woocommerce'
											) }
											onClick={ async () => {
												try {
													await sets.toggleStatus(
														item
													);
												} catch ( e ) {
													notify(
														errorMessage(
															e
														),
														'error'
													);
												}
											} }
										>
											<span
												className="dashicons dashicons-visibility"
												aria-hidden="true"
											/>
										</button>
										<button
											type="button"
											className="dpo-icon-btn"
											title={ __(
												'Duplicate',
												'dynamic-product-options-for-woocommerce'
											) }
											onClick={ async () => {
												try {
													await sets.duplicate(
														item.id
													);
												} catch ( e ) {
													notify(
														errorMessage(
															e
														),
														'error'
													);
												}
											} }
										>
											<span
												className="dashicons dashicons-admin-page"
												aria-hidden="true"
											/>
										</button>
										<button
											type="button"
											className="dpo-icon-btn"
											title={ __(
												'Export',
												'dynamic-product-options-for-woocommerce'
											) }
											onClick={ () =>
												exportSet( item )
											}
										>
											<span
												className="dashicons dashicons-download"
												aria-hidden="true"
											/>
										</button>
										<button
											type="button"
											className="dpo-icon-btn dpo-icon-btn--danger"
											title={ __(
												'Delete',
												'dynamic-product-options-for-woocommerce'
											) }
											onClick={ () =>
												setConfirm( {
													id: item.id,
												} )
											}
										>
											<span
												className="dashicons dashicons-trash"
												aria-hidden="true"
											/>
										</button>
									</div>
								</article>
							) ) }
						</div>
					) }

				{ sets.status === 'ready' &&
					sets.totalPages > 1 && (
						<div className="dpo-pager">
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost"
								disabled={ sets.page <= 1 }
								onClick={ () =>
									sets.load( {
										page: sets.page - 1,
									} )
								}
							>
								{ __(
									'Previous',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
							<span>
								{ sprintf(
									/* translators: 1: current page 2: total */
									__(
										'Page %1$d of %2$d',
										'dynamic-product-options-for-woocommerce'
									),
									sets.page,
									sets.totalPages
								) }
							</span>
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost"
								disabled={
									sets.page >= sets.totalPages
								}
								onClick={ () =>
									sets.load( {
										page: sets.page + 1,
									} )
								}
							>
								{ __(
									'Next',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
						</div>
					) }
			</Panel>

			{ confirm && (
				<ConfirmDialog
					title={ __(
						'Delete option set',
						'dynamic-product-options-for-woocommerce'
					) }
					message={ __(
						'This permanently removes the option set and detaches it from all products. Continue?',
						'dynamic-product-options-for-woocommerce'
					) }
					confirmText={ __(
						'Delete',
						'dynamic-product-options-for-woocommerce'
					) }
					onCancel={ () => setConfirm( null ) }
					onConfirm={ async () => {
						try {
							if ( confirm.bulk ) {
								await runBulk( 'delete' );
							} else {
								await sets.remove( confirm.id );
								notify(
									__(
										'Option set deleted.',
										'dynamic-product-options-for-woocommerce'
									),
									'success'
								);
							}
						} catch ( e ) {
							notify( errorMessage( e ), 'error' );
						} finally {
							setConfirm( null );
						}
					} }
				/>
			) }
		</div>
	);
}

/**
 * SetsList — wraps the list in its own provider.
 *
 * @return {JSX.Element} The screen.
 */
export default function SetsList() {
	return (
		<SetsProvider>
			<List />
		</SetsProvider>
	);
}
