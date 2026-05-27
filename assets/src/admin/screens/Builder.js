/**
 * Builder screen — a premium, visual product-options editor. A top bar
 * (title, view switch, status, save) sits above a centered product stage
 * where fields are built and previewed in place. Field creation happens in a
 * centered command-style picker; field settings live in a docked drawer.
 * Everything is scoped to a BuilderProvider for the route id.
 *
 * @package
 */

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ArrowLeft, Eye, Pencil, Loader2, Palette } from 'lucide-react';
import { BuilderProvider, useBuilder } from '../store/BuilderContext';
import { useToast } from '../store/ToastContext';
import { navigate } from '../app/router';
import { errorMessage } from '../api/client';
import { useBuilderUI } from './builder/store/builderUi';
import { useGlobalStyle } from './builder/store/globalStyle';
import Canvas from './builder/canvas/Canvas';
import FieldPicker from './builder/picker/FieldPicker';
import SettingsDrawer from './builder/settings/SettingsDrawer';
import GlobalStylePanel from './builder/settings/GlobalStylePanel';

/**
 * The builder body (consumes BuilderContext).
 *
 * @return {JSX.Element} The editor.
 */
function Editor() {
	const builder = useBuilder();
	const { notify } = useToast();
	const { view, setView, closeSettings } = useBuilderUI();
	const openStyle = useGlobalStyle( ( s ) => s.openPanel );
	const loadStyle = useGlobalStyle( ( s ) => s.load );

	// Load the saved global style once so the canvas reflects it immediately.
	useEffect( () => {
		loadStyle();
	}, [ loadStyle ] );

	/** Open the Global Style panel, closing the field drawer so they don't stack. */
	const onOpenStyle = () => {
		closeSettings();
		builder.dispatch( { type: 'SELECT', id: null } );
		openStyle();
	};

	if ( builder.loading ) {
		return (
			<div className="dpo-builder__loading">
				<Loader2 className="dpo-spin" size={ 28 } />
				<p>
					{ __(
						'Loading option set…',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
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
					<ArrowLeft size={ 18 } />
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
					<div className="dpo-segmented" role="tablist">
						<button
							type="button"
							role="tab"
							aria-selected={ view === 'build' }
							className={ view === 'build' ? 'is-active' : '' }
							onClick={ () => setView( 'build' ) }
						>
							<Pencil size={ 14 } />
							{ __(
								'Build',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
						<button
							type="button"
							role="tab"
							aria-selected={ view === 'preview' }
							className={ view === 'preview' ? 'is-active' : '' }
							onClick={ () => setView( 'preview' ) }
						>
							<Eye size={ 14 } />
							{ __(
								'Preview',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
					</div>

					<label
						className="dpo-status-toggle"
						htmlFor="dpo-status-toggle"
					>
						<span className="dpo-switch">
							<input
								id="dpo-status-toggle"
								type="checkbox"
								className="dpo-switch__input"
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
							<span
								className="dpo-switch__track"
								aria-hidden="true"
							/>
						</span>
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
						className="dpo-btn dpo-btn--ghost"
						onClick={ onOpenStyle }
					>
						<Palette size={ 15 } />
						{ __(
							'Global Style',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>

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

			<div className="dpo-builder__stage-wrap">
				<Canvas />
			</div>

			<FieldPicker />
			<SettingsDrawer />
			<GlobalStylePanel />
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
