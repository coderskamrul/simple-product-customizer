/**
 * Assignment screen — choose where an option set applies (all / specific
 * products / category / tag / brand / none), with async pickers, an
 * exclude list, and a resolved product-link preview.
 *
 * @package DPO\Admin
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
	{ value: 'all', label: __( 'All products', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'products', label: __( 'Specific products', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'category', label: __( 'Product category', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'tag', label: __( 'Product tag', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'brand', label: __( 'Product brand', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'none', label: __( 'None (disabled)', 'dynamic-product-options-for-woocommerce' ) },
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
					'dynamic-product-options-for-woocommerce'
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
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<p className="dpo-hint">
					{ __(
						'Save the option set first, then assign it to products.',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<button
					type="button"
					className="dpo-btn dpo-btn--ghost"
					onClick={ () => navigate( `/set/${ setId }` ) }
				>
					{ __(
						'Back to builder',
						'dynamic-product-options-for-woocommerce'
					) }
				</button>
			</Panel>
		);
	}

	return (
		<div className="dpo-assignment">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Assignment',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
					<p className="dpo-screen-sub">
						{ __(
							'Decide which products show this option set.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
				<div className="dpo-screen-head__actions">
					<a
						className="dpo-btn dpo-btn--ghost"
						href={ `#/set/${ setId }` }
					>
						{ __(
							'Back to builder',
							'dynamic-product-options-for-woocommerce'
						) }
					</a>
					<button
						type="button"
						className="dpo-btn dpo-btn--primary"
						disabled={ saving || status !== 'ready' }
						onClick={ onSave }
					>
						{ saving
							? __(
									'Saving…',
									'dynamic-product-options-for-woocommerce'
							  )
							: __(
									'Save assignment',
									'dynamic-product-options-for-woocommerce'
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
					<p className="dpo-error">{ error }</p>
				</Panel>
			) }

			{ status === 'ready' && (
				<>
					<Panel
						title={ __(
							'Scope',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<div className="dpo-radio-grid">
							{ SCOPES.map( ( s ) => (
								<label
									key={ s.value }
									className={ `dpo-radio-card${
										scope === s.value
											? ' is-active'
											: ''
									}` }
								>
									<input
										type="radio"
										name="dpo-scope"
										value={ s.value }
										checked={ scope === s.value }
										onChange={ () =>
											setScope( s.value )
										}
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
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<Field
								label={ __(
									'Include products',
									'dynamic-product-options-for-woocommerce'
								) }
							>
								<AsyncSelect
									value={ include }
									onChange={ setInclude }
									max={
										proActive
											? 0
											: FREE_PRODUCT_CAP
									}
									fetcher={ async ( t ) => {
										const r =
											await api.searchProducts(
												t
											);
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
											'dynamic-product-options-for-woocommerce'
										),
										FREE_PRODUCT_CAP
									) }
								/>
							) }
						</Panel>
					) }

					{ termKind && (
						<Panel
							title={ SCOPES.find(
								( s ) => s.value === scope
							).label }
						>
							<Field
								label={ __(
									'Terms',
									'dynamic-product-options-for-woocommerce'
								) }
							>
								<AsyncSelect
									value={ include }
									onChange={ setInclude }
									fetcher={ async ( t ) => {
										const r =
											await api.searchTerms(
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
								'dynamic-product-options-for-woocommerce'
							) }
						>
							<Field
								label={ __(
									'Exclude products',
									'dynamic-product-options-for-woocommerce'
								) }
								help={ __(
									'These products never show this option set.',
									'dynamic-product-options-for-woocommerce'
								) }
							>
								<AsyncSelect
									value={ exclude }
									onChange={ setExclude }
									fetcher={ async ( t ) => {
										const r =
											await api.searchProducts(
												t
											);
										return r.items;
									} }
								/>
							</Field>
						</Panel>
					) }

					<Panel
						title={ __(
							'Preview link',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						{ ! link.published ? (
							<p className="dpo-hint">
								{ __(
									'Publish the option set to preview it on a product.',
									'dynamic-product-options-for-woocommerce'
								) }
							</p>
						) : link.productLink ? (
							<a
								href={ link.productLink }
								target="_blank"
								rel="noreferrer"
								className="dpo-btn dpo-btn--ghost"
							>
								{ __(
									'Open a matching product',
									'dynamic-product-options-for-woocommerce'
								) }
							</a>
						) : (
							<p className="dpo-hint">
								{ __(
									'No matching published product found yet.',
									'dynamic-product-options-for-woocommerce'
								) }
							</p>
						) }
					</Panel>
				</>
			) }
		</div>
	);
}
