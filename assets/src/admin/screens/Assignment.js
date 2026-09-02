/**
 * Assignment screen — choose where an option set applies (all / specific
 * products / category / tag / brand / none), with async pickers, an
 * exclude list, and a resolved product-link preview.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import { useToast } from '../store/ToastContext';
import { useConfig } from '../store/ConfigContext';
import { navigate } from '../app/router';
import {
	Panel,
	Field,
	AsyncSelect,
	ProBadge,
	SkeletonForm,
} from '../components';

/** Scope radio definitions. */
const SCOPES = [
	{
		value: 'all',
		label: __( 'All products', 'simple-product-customizer' ),
	},
	{
		value: 'products',
		label: __(
			'Specific products',
			'simple-product-customizer'
		),
	},
	{
		value: 'category',
		label: __(
			'Product category',
			'simple-product-customizer'
		),
	},
	{
		value: 'tag',
		label: __( 'Product tag', 'simple-product-customizer' ),
	},
	{
		value: 'brand',
		label: __( 'Product brand', 'simple-product-customizer' ),
	},
	{
		value: 'none',
		label: __(
			'None (disabled)',
			'simple-product-customizer'
		),
	},
];

const FREE_PRODUCT_CAP = 2;

/**
 * Assignment.
 *
 * @param {Object} props       Component props.
 * @param {string} props.setId Route set id.
 * @return {JSX.Element} The screen.
 */
export default function Assignment( { setId } ) {
	const { notify } = useToast();
	const { proActive } = useConfig();
	const [ status, setStatus ] = useState( 'loading' );
	const [ error, setError ] = useState( '' );
	const [ scope, setScope ] = useState( 'none' );
	const [ include, setInclude ] = useState( [] );
	const [ exclude, setExclude ] = useState( [] );
	const [ link, setLink ] = useState( {
		published: false,
		productLink: '',
	} );
	const [ saving, setSaving ] = useState( false );

	const numericId = parseInt( setId, 10 );
	const isNew = ! numericId || setId === 'new';

	useEffect( () => {
		if ( isNew ) {
			setStatus( 'ready' );
			return undefined;
		}
		let cancelled = false;
		api.getAssignment( numericId )
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				const a = res.assignment || {};
				setScope( a.scope || 'none' );
				setInclude( res.include || [] );
				setExclude( res.exclude || [] );
				setStatus( 'ready' );
			} )
			.catch( ( e ) => {
				if ( cancelled ) {
					return;
				}
				setError( errorMessage( e ) );
				setStatus( 'error' );
			} );
		return () => {
			cancelled = true;
		};
	}, [ numericId, isNew ] );

	// Refresh the resolved product link whenever the assignment changes.
	useEffect( () => {
		if ( isNew || status !== 'ready' ) {
			return;
		}
		api.productLink( numericId, {
			scope,
			include: include.map( ( i ) => i.id ),
			exclude: exclude.map( ( i ) => i.id ),
		} )
			.then( ( res ) =>
				setLink( {
					published: res.published,
					productLink: res.productLink,
				} )
			)
			.catch( () => setLink( { published: false, productLink: '' } ) );
	}, [ scope, include, exclude, numericId, isNew, status ] );

	const termKind =
		scope === 'category' || scope === 'tag' || scope === 'brand'
			? scope
			: null;

	/**
	 * Persist the assignment.
	 *
	 * @return {Promise<void>} Resolves after save.
	 */
	const onSave = async () => {
		setSaving( true );
		try {
			await api.saveAssignment( {
				set_id: numericId,
				scope,
				include: include.map( ( i ) => i.id ),
				exclude: exclude.map( ( i ) => i.id ),
				product_image: JSON.stringify( [] ),
			} );
			notify(
				__(
					'Assignment saved.',
					'simple-product-customizer'
				),
				'success'
			);
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		} finally {
			setSaving( false );
		}
	};

	if ( isNew ) {
		return (
			<Panel
				title={ __(
					'Assignment',
					'simple-product-customizer'
				) }
			>
				<p className="spcus-hint">
					{ __(
						'Save the option set first, then assign it to products.',
						'simple-product-customizer'
					) }
				</p>
				<button
					type="button"
					className="spcus-btn spcus-btn--ghost"
					onClick={ () => navigate( `/set/${ setId }` ) }
				>
					{ __(
						'Back to builder',
						'simple-product-customizer'
					) }
				</button>
			</Panel>
		);
	}

	return (
		<div className="spcus-assignment">
			<header className="spcus-screen-head">
				<div>
					<h1 className="spcus-screen-title">
						{ __(
							'Assignment',
							'simple-product-customizer'
						) }
					</h1>
					<p className="spcus-screen-sub">
						{ __(
							'Decide which products show this option set.',
							'simple-product-customizer'
						) }
					</p>
				</div>
				<div className="spcus-screen-head__actions">
					<a
						className="spcus-btn spcus-btn--ghost"
						href={ `#/set/${ setId }` }
					>
						{ __(
							'Back to builder',
							'simple-product-customizer'
						) }
					</a>
					<button
						type="button"
						className="spcus-btn spcus-btn--primary"
						disabled={ saving || status !== 'ready' }
						onClick={ onSave }
					>
						{ saving
							? __(
									'Saving…',
									'simple-product-customizer'
							  )
							: __(
									'Save assignment',
									'simple-product-customizer'
							  ) }
					</button>
				</div>
			</header>

			{ status === 'loading' && (
				<Panel>
					<SkeletonForm fields={ 4 } />
				</Panel>
			) }
			{ status === 'error' && (
				<Panel>
					<p className="spcus-error">{ error }</p>
				</Panel>
			) }

			{ status === 'ready' && (
				<>
					<Panel
						title={ __(
							'Scope',
							'simple-product-customizer'
						) }
					>
						<div className="spcus-radio-grid">
							{ SCOPES.map( ( s ) => (
								<label
									key={ s.value }
									className={ `spcus-radio-card${
										scope === s.value ? ' is-active' : ''
									}` }
								>
									<input
										type="radio"
										name="spcus-scope"
										value={ s.value }
										checked={ scope === s.value }
										onChange={ () => setScope( s.value ) }
									/>
									<span>{ s.label }</span>
								</label>
							) ) }
						</div>
					</Panel>

					{ scope === 'products' && (
						<Panel
							title={ __(
								'Products',
								'simple-product-customizer'
							) }
						>
							<Field
								label={ __(
									'Include products',
									'simple-product-customizer'
								) }
							>
								<AsyncSelect
									value={ include }
									onChange={ setInclude }
									max={ proActive ? 0 : FREE_PRODUCT_CAP }
									fetcher={ async ( t ) => {
										const r = await api.searchProducts( t );
										return r.items;
									} }
								/>
							</Field>
							{ ! proActive && (
								<ProBadge
									hint={ sprintf(
										/* translators: %d: free product cap */
										__(
											'Free version links up to %d products.',
											'simple-product-customizer'
										),
										FREE_PRODUCT_CAP
									) }
								/>
							) }
						</Panel>
					) }

					{ termKind && (
						<Panel
							title={
								SCOPES.find( ( s ) => s.value === scope ).label
							}
						>
							<Field
								label={ __(
									'Terms',
									'simple-product-customizer'
								) }
							>
								<AsyncSelect
									value={ include }
									onChange={ setInclude }
									fetcher={ async ( t ) => {
										const r = await api.searchTerms(
											termKind,
											t
										);
										return r.items;
									} }
								/>
							</Field>
						</Panel>
					) }

					{ scope !== 'none' && (
						<Panel
							title={ __(
								'Exclusions',
								'simple-product-customizer'
							) }
						>
							<Field
								label={ __(
									'Exclude products',
									'simple-product-customizer'
								) }
								help={ __(
									'These products never show this option set.',
									'simple-product-customizer'
								) }
							>
								<AsyncSelect
									value={ exclude }
									onChange={ setExclude }
									fetcher={ async ( t ) => {
										const r = await api.searchProducts( t );
										return r.items;
									} }
								/>
							</Field>
						</Panel>
					) }

					<Panel
						title={ __(
							'Preview link',
							'simple-product-customizer'
						) }
					>
						{ ! link.published ? (
							<p className="spcus-hint">
								{ __(
									'Publish the option set to preview it on a product.',
									'simple-product-customizer'
								) }
							</p>
						) : link.productLink ? (
							<a
								href={ link.productLink }
								target="_blank"
								rel="noreferrer"
								className="spcus-btn spcus-btn--ghost"
							>
								{ __(
									'Open a matching product',
									'simple-product-customizer'
								) }
							</a>
						) : (
							<p className="spcus-hint">
								{ __(
									'No matching published product found yet.',
									'simple-product-customizer'
								) }
							</p>
						) }
					</Panel>
				</>
			) }
		</div>
	);
}
