/**
 * Assignment modal — assign the option set to products / category / tag /
 * brand without leaving the builder. Edits live on `builder.assignment` (a
 * SET_ASSIGNMENT dispatch) so the change is part of the builder's dirty state
 * and is persisted by the single top-bar Save, against the (possibly new) set
 * id. Replaces the old full-page `#/set/:id/assignment` route.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { Target } from 'lucide-react';
import * as api from '../../api/endpoints';
import { useBuilder } from '../../store/BuilderContext';
import { Modal, Field, AsyncSelect } from '../../components';

/** Scope options shown as selectable cards. */
const SCOPES = [
	{
		value: 'all',
		label: __( 'All products', 'simple-product-customizer' ),
		hint: __(
			'Show on every product in the store.',
			'simple-product-customizer'
		),
	},
	{
		value: 'products',
		label: __(
			'Specific products',
			'simple-product-customizer'
		),
		hint: __(
			'Pick individual products.',
			'simple-product-customizer'
		),
	},
	{
		value: 'category',
		label: __(
			'Product category',
			'simple-product-customizer'
		),
		hint: __(
			'Apply to one or more categories.',
			'simple-product-customizer'
		),
	},
	{
		value: 'tag',
		label: __( 'Product tag', 'simple-product-customizer' ),
		hint: __(
			'Apply to tagged products.',
			'simple-product-customizer'
		),
	},
	{
		value: 'brand',
		label: __( 'Product brand', 'simple-product-customizer' ),
		hint: __(
			'Apply to a product brand.',
			'simple-product-customizer'
		),
	},
	{
		value: 'none',
		label: __(
			'None (disabled)',
			'simple-product-customizer'
		),
		hint: __(
			'Not shown anywhere yet.',
			'simple-product-customizer'
		),
	},
];


/**
 * AssignmentModal.
 *
 * @param {Object}   props         Component props.
 * @param {Function} props.onClose () => void.
 * @return {JSX.Element} The modal.
 */
export default function AssignmentModal( { onClose } ) {
	const builder = useBuilder();
	const a = builder.assignment || {
		scope: 'none',
		include: [],
		exclude: [],
	};

	const update = ( patch ) =>
		builder.dispatch( {
			type: 'SET_ASSIGNMENT',
			assignment: { ...a, ...patch },
		} );

	// Product ids and term ids live in different spaces — reset the include
	// list whenever the scope changes so we never mix them.
	const setScope = ( scope ) => update( { scope, include: [] } );

	const termKind =
		a.scope === 'category' || a.scope === 'tag' || a.scope === 'brand'
			? a.scope
			: null;

	return (
		<Modal
			size="md"
			title={ __(
				'Assign to products',
				'simple-product-customizer'
			) }
			onClose={ onClose }
			footer={
				<button
					type="button"
					className="spcus-btn spcus-btn--primary"
					onClick={ onClose }
				>
					{ __( 'Done', 'simple-product-customizer' ) }
				</button>
			}
		>
			<div className="spcus-assign-modal">
				<p className="spcus-assign-modal__intro">
					<Target size={ 15 } />
					{ __(
						'Choose where this option set appears. Changes are saved with the option set.',
						'simple-product-customizer'
					) }
				</p>

				<div className="spcus-radio-grid spcus-assign-modal__scopes">
					{ SCOPES.map( ( s ) => (
						<label
							key={ s.value }
							htmlFor={ `spcus-assign-scope-${ s.value }` }
							className={ `spcus-radio-card${
								a.scope === s.value ? ' is-active' : ''
							}` }
						>
							<input
								id={ `spcus-assign-scope-${ s.value }` }
								type="radio"
								name="spcus-assign-scope"
								value={ s.value }
								checked={ a.scope === s.value }
								onChange={ () => setScope( s.value ) }
							/>
							<span className="spcus-radio-card__label">
								{ s.label }
							</span>
							<span className="spcus-radio-card__hint">
								{ s.hint }
							</span>
						</label>
					) ) }
				</div>

				{ a.scope === 'products' && (
					<Field
						label={ __(
							'Include products',
							'simple-product-customizer'
						) }
					>
						<AsyncSelect
							value={ a.include }
							onChange={ ( v ) => update( { include: v } ) }
							max={ 0 }
							placeholder={ __(
								'Search products…',
								'simple-product-customizer'
							) }
							fetcher={ async ( t ) => {
								const r = await api.searchProducts( t );
								return r.items;
							} }
						/>
					</Field>
				) }

				{ termKind && (
					<Field
						label={
							SCOPES.find( ( s ) => s.value === a.scope ).label
						}
					>
						<AsyncSelect
							value={ a.include }
							onChange={ ( v ) => update( { include: v } ) }
							placeholder={ __(
								'Search…',
								'simple-product-customizer'
							) }
							fetcher={ async ( t ) => {
								const r = await api.searchTerms( termKind, t );
								return r.items;
							} }
						/>
					</Field>
				) }

				{ a.scope !== 'none' && (
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
							value={ a.exclude }
							onChange={ ( v ) => update( { exclude: v } ) }
							placeholder={ __(
								'Search products…',
								'simple-product-customizer'
							) }
							fetcher={ async ( t ) => {
								const r = await api.searchProducts( t );
								return r.items;
							} }
						/>
					</Field>
				) }
			</div>
		</Modal>
	);
}
