/**
 * Assignment modal — assign the option set to products / category / tag /
 * brand without leaving the builder. Edits live on `builder.assignment` (a
 * SET_ASSIGNMENT dispatch) so the change is part of the builder's dirty state
 * and is persisted by the single top-bar Save, against the (possibly new) set
 * id. Replaces the old full-page `#/set/:id/assignment` route.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { Target } from 'lucide-react';
import * as api from '../../api/endpoints';
import { useBuilder } from '../../store/BuilderContext';
import { useConfig } from '../../store/ConfigContext';
import { Modal, Field, AsyncSelect, ProBadge } from '../../components';

/** Scope options shown as selectable cards. */
const SCOPES = [
	{
		value: 'all',
		label: __( 'All products', 'productkit-for-woocommerce' ),
		hint: __(
			'Show on every product in the store.',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'products',
		label: __(
			'Specific products',
			'productkit-for-woocommerce'
		),
		hint: __(
			'Pick individual products.',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'category',
		label: __(
			'Product category',
			'productkit-for-woocommerce'
		),
		hint: __(
			'Apply to one or more categories.',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'tag',
		label: __( 'Product tag', 'productkit-for-woocommerce' ),
		hint: __(
			'Apply to tagged products.',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'brand',
		label: __( 'Product brand', 'productkit-for-woocommerce' ),
		hint: __(
			'Apply to a product brand.',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'none',
		label: __(
			'None (disabled)',
			'productkit-for-woocommerce'
		),
		hint: __(
			'Not shown anywhere yet.',
			'productkit-for-woocommerce'
		),
	},
];

const FREE_PRODUCT_CAP = 2;

/**
 * AssignmentModal.
 *
 * @param {Object}   props         Component props.
 * @param {Function} props.onClose () => void.
 * @return {JSX.Element} The modal.
 */
export default function AssignmentModal( { onClose } ) {
	const builder = useBuilder();
	const { proActive } = useConfig();
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
				'productkit-for-woocommerce'
			) }
			onClose={ onClose }
			footer={
				<button
					type="button"
					className="pkitfw-btn pkitfw-btn--primary"
					onClick={ onClose }
				>
					{ __( 'Done', 'productkit-for-woocommerce' ) }
				</button>
			}
		>
			<div className="pkitfw-assign-modal">
				<p className="pkitfw-assign-modal__intro">
					<Target size={ 15 } />
					{ __(
						'Choose where this option set appears. Changes are saved with the option set.',
						'productkit-for-woocommerce'
					) }
				</p>

				<div className="pkitfw-radio-grid pkitfw-assign-modal__scopes">
					{ SCOPES.map( ( s ) => (
						<label
							key={ s.value }
							htmlFor={ `pkitfw-assign-scope-${ s.value }` }
							className={ `pkitfw-radio-card${
								a.scope === s.value ? ' is-active' : ''
							}` }
						>
							<input
								id={ `pkitfw-assign-scope-${ s.value }` }
								type="radio"
								name="pkitfw-assign-scope"
								value={ s.value }
								checked={ a.scope === s.value }
								onChange={ () => setScope( s.value ) }
							/>
							<span className="pkitfw-radio-card__label">
								{ s.label }
							</span>
							<span className="pkitfw-radio-card__hint">
								{ s.hint }
							</span>
						</label>
					) ) }
				</div>

				{ a.scope === 'products' && (
					<Field
						label={ __(
							'Include products',
							'productkit-for-woocommerce'
						) }
					>
						<AsyncSelect
							value={ a.include }
							onChange={ ( v ) => update( { include: v } ) }
							max={ proActive ? 0 : FREE_PRODUCT_CAP }
							placeholder={ __(
								'Search products…',
								'productkit-for-woocommerce'
							) }
							fetcher={ async ( t ) => {
								const r = await api.searchProducts( t );
								return r.items;
							} }
						/>
						{ ! proActive && (
							<ProBadge
								hint={ sprintf(
									/* translators: %d: free product cap */
									__(
										'Free version links up to %d products.',
										'productkit-for-woocommerce'
									),
									FREE_PRODUCT_CAP
								) }
							/>
						) }
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
								'productkit-for-woocommerce'
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
							'productkit-for-woocommerce'
						) }
						help={ __(
							'These products never show this option set.',
							'productkit-for-woocommerce'
						) }
					>
						<AsyncSelect
							value={ a.exclude }
							onChange={ ( v ) => update( { exclude: v } ) }
							placeholder={ __(
								'Search products…',
								'productkit-for-woocommerce'
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
