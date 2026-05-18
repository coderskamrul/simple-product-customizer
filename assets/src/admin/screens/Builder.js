/**
 * Builder screen — the core three-pane editor (Palette / Canvas+Preview /
 * Inspector) plus a top bar with the editable title, status toggle and
 * Save. Wraps everything in a BuilderProvider scoped to the route id.
 *
 * @package DPO\Admin
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BuilderProvider, useBuilder } from '../store/BuilderContext';
import { useToast } from '../store/ToastContext';
import { navigate } from '../app/router';
import { errorMessage } from '../api/client';
import { Spinner } from '../components';
import Palette from './builder/Palette';
import Canvas from './builder/Canvas';
import Inspector from './builder/Inspector';
import Preview from './builder/Preview';

/**
 * The builder body (consumes BuilderContext).
 *
 * @return {JSX.Element} The editor.
 */
function Editor() {
	const builder = useBuilder();
	const { notify } = useToast();
	const [ view, setView ] = useState( 'canvas' ); // canvas | preview

	if ( builder.loading ) {
		return (
			<div className="dpo-builder__loading">
				<Spinner
					label={ __(
						'Loading option set…',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			</div>
		);
	}

	if ( builder.loadError ) {
		return (
			<div className="dpo-builder__loading">
				<p className="dpo-error">{ builder.loadError }</p>
				<button
					type="button"
					className="dpo-btn dpo-btn--ghost"
					onClick={ () => navigate( '/sets' ) }
				>
					{ __(
						'Back to option sets',
						'dynamic-product-options-for-woocommerce'
					) }
				</button>
			</div>
		);
	}

	/**
	 * Persist the set and surface a toast.
	 *
	 * @return {Promise<void>} Resolves after save.
	 */
	const onSave = async () => {
		try {
			const id = await builder.save();
			notify(
				__(
					'Option set saved.',
					'dynamic-product-options-for-woocommerce'
				),
				'success'
			);
			if ( builder.id === 'new' && id ) {
				navigate( `/set/${ id }` );
			}
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		}
	};

	const isPublished = builder.status === 'publish';

	return (
		<div className="dpo-builder">
			<header className="dpo-builder__topbar">
				<button
					type="button"
					className="dpo-icon-btn"
					aria-label={ __(
						'Back',
						'dynamic-product-options-for-woocommerce'
					) }
					onClick={ () => navigate( '/sets' ) }
				>
					<span
						className="dashicons dashicons-arrow-left-alt2"
						aria-hidden="true"
					/>
				</button>
				<input
					type="text"
					className="dpo-builder__title-input"
					value={ builder.title }
					placeholder={ __(
						'Untitled option set',
						'dynamic-product-options-for-woocommerce'
					) }
					onChange={ ( e ) =>
						builder.dispatch( {
							type: 'SET_META',
							patch: { title: e.target.value },
						} )
					}
				/>

				<div className="dpo-builder__topbar-right">
					<div className="dpo-segmented">
						<button
							type="button"
							className={
								view === 'canvas' ? 'is-active' : ''
							}
							onClick={ () => setView( 'canvas' ) }
						>
							{ __(
								'Build',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
						<button
							type="button"
							className={
								view === 'preview' ? 'is-active' : ''
							}
							onClick={ () => setView( 'preview' ) }
						>
							{ __(
								'Preview',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
					</div>

					<label className="dpo-status-toggle">
						<span>
							{ isPublished
								? __(
										'Published',
										'dynamic-product-options-for-woocommerce'
								  )
								: __(
										'Draft',
										'dynamic-product-options-for-woocommerce'
								  ) }
						</span>
						<input
							type="checkbox"
							checked={ isPublished }
							onChange={ ( e ) =>
								builder.dispatch( {
									type: 'SET_META',
									patch: {
										status: e.target.checked
											? 'publish'
											: 'draft',
									},
								} )
							}
						/>
					</label>

					<a
						className="dpo-btn dpo-btn--ghost"
						href={ `#/set/${ builder.id }/assignment` }
					>
						{ __(
							'Assignment',
							'dynamic-product-options-for-woocommerce'
						) }
					</a>

					<button
						type="button"
						className="dpo-btn dpo-btn--primary"
						disabled={ builder.saving }
						onClick={ onSave }
					>
						{ builder.saving
							? __(
									'Saving…',
									'dynamic-product-options-for-woocommerce'
							  )
							: __(
									'Save',
									'dynamic-product-options-for-woocommerce'
							  ) }
					</button>
				</div>
			</header>

			<div className="dpo-builder__panes">
				<Palette />
				<div className="dpo-builder__center">
					{ view === 'canvas' ? <Canvas /> : <Preview /> }
				</div>
				<Inspector />
			</div>
		</div>
	);
}

/**
 * Builder.
 *
 * @param {Object} props       Component props.
 * @param {string} props.setId Route id ("new" allowed).
 * @return {JSX.Element} The screen.
 */
export default function Builder( { setId } ) {
	return (
		<BuilderProvider setId={ setId || 'new' }>
			<Editor />
		</BuilderProvider>
	);
}
