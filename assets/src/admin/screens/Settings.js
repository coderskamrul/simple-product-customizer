/**
 * Settings screen — the §10 settings form plus a custom-fonts manager
 * (upload .woff/.woff2/.ttf, rename, delete).
 *
 * @package DPO\Admin
 */

import {
	useState,
	useEffect,
	useRef,
	useCallback,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import { useToast } from '../store/ToastContext';
import {
	Panel,
	Spinner,
	Field,
	TextControl,
	ToggleField,
} from '../components';

/** §10 defaults so the form is fully controlled even before fetch. */
const DEFAULTS = {
	showPriceLine: true,
	priceLineLabel: 'Options Price',
	showTotalLine: true,
	totalLineLabel: 'Total Price',
	hideInCart: false,
	hideInCheckout: false,
	shopForceSelect: true,
	shopButtonText: 'Select Options',
	uploadTempDays: 7,
	uploadPlacedDays: 0,
	uploadCompletedDays: 0,
};

/**
 * Fonts sub-manager.
 *
 * @return {JSX.Element} The fonts panel.
 */
function FontsManager() {
	const { notify } = useToast();
	const [ fonts, setFonts ] = useState( [] );
	const [ title, setTitle ] = useState( '' );
	const [ family, setFamily ] = useState( '' );
	const [ busy, setBusy ] = useState( false );
	const fileRef = useRef( null );

	const refresh = useCallback( async () => {
		try {
			const res = await api.getFonts();
			setFonts( res.fonts || [] );
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		}
	}, [ notify ] );

	useEffect( () => {
		refresh();
	}, [ refresh ] );

	/**
	 * Upload the chosen font file.
	 *
	 * @return {Promise<void>} Resolves after refresh.
	 */
	const onUpload = async () => {
		const file = fileRef.current && fileRef.current.files[ 0 ];
		if ( ! file ) {
			notify(
				__(
					'Choose a font file first.',
					'dynamic-product-options-for-woocommerce'
				),
				'error'
			);
			return;
		}
		if ( ! title.trim() ) {
			notify(
				__(
					'Font title is required.',
					'dynamic-product-options-for-woocommerce'
				),
				'error'
			);
			return;
		}
		setBusy( true );
		try {
			await api.uploadFont( file, title.trim(), family.trim() );
			setTitle( '' );
			setFamily( '' );
			fileRef.current.value = '';
			await refresh();
			notify(
				__(
					'Font uploaded.',
					'dynamic-product-options-for-woocommerce'
				),
				'success'
			);
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		} finally {
			setBusy( false );
		}
	};

	/**
	 * Delete a font.
	 *
	 * @param {string} id Font id.
	 * @return {Promise<void>} Resolves after refresh.
	 */
	const onDelete = async ( id ) => {
		try {
			await api.deleteFont( id );
			await refresh();
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		}
	};

	return (
		<Panel
			title={ __(
				'Custom fonts',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<div className="dpo-font-upload">
				<TextControl
					value={ title }
					placeholder={ __(
						'Font title',
						'dynamic-product-options-for-woocommerce'
					) }
					onChange={ setTitle }
				/>
				<TextControl
					value={ family }
					placeholder={ __(
						'CSS family (optional)',
						'dynamic-product-options-for-woocommerce'
					) }
					onChange={ setFamily }
				/>
				<input
					type="file"
					accept=".woff,.woff2,.ttf"
					ref={ fileRef }
				/>
				<button
					type="button"
					className="dpo-btn dpo-btn--primary"
					disabled={ busy }
					onClick={ onUpload }
				>
					{ busy
						? __(
								'Uploading…',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Upload',
								'dynamic-product-options-for-woocommerce'
						  ) }
				</button>
			</div>

			{ fonts.length === 0 ? (
				<p className="dpo-hint">
					{ __(
						'No custom fonts yet.',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
			) : (
				<table className="dpo-table">
					<thead>
						<tr>
							<th>
								{ __(
									'Title',
									'dynamic-product-options-for-woocommerce'
								) }
							</th>
							<th>
								{ __(
									'Family',
									'dynamic-product-options-for-woocommerce'
								) }
							</th>
							<th>
								{ __(
									'Type',
									'dynamic-product-options-for-woocommerce'
								) }
							</th>
							<th aria-label="actions" />
						</tr>
					</thead>
					<tbody>
						{ fonts.map( ( f ) => (
							<tr key={ f.id }>
								<td>{ f.title }</td>
								<td
									style={ {
										fontFamily: f.family,
									} }
								>
									{ f.family }
								</td>
								<td>{ f.file_type }</td>
								<td>
									<button
										type="button"
										className="dpo-icon-btn dpo-icon-btn--danger"
										onClick={ () =>
											onDelete( f.id )
										}
										aria-label={ __(
											'Delete font',
											'dynamic-product-options-for-woocommerce'
										) }
									>
										<span
											className="dashicons dashicons-trash"
											aria-hidden="true"
										/>
									</button>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</Panel>
	);
}

/**
 * Settings.
 *
 * @return {JSX.Element} The screen.
 */
export default function Settings() {
	const { notify } = useToast();
	const [ status, setStatus ] = useState( 'loading' );
	const [ error, setError ] = useState( '' );
	const [ values, setValues ] = useState( DEFAULTS );
	const [ saving, setSaving ] = useState( false );

	useEffect( () => {
		let cancelled = false;
		api.getSettings()
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				setValues( { ...DEFAULTS, ...( res.settings || {} ) } );
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
	}, [] );

	/**
	 * Patch a setting key.
	 *
	 * @param {string} key Setting key.
	 * @param {*}      val New value.
	 * @return {void}
	 */
	const set = ( key, val ) =>
		setValues( ( v ) => ( { ...v, [ key ]: val } ) );

	/**
	 * Persist settings.
	 *
	 * @return {Promise<void>} Resolves after save.
	 */
	const onSave = async () => {
		setSaving( true );
		try {
			await api.saveSettings( values );
			notify(
				__(
					'Settings saved.',
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

	if ( status === 'loading' ) {
		return (
			<Panel>
				<Spinner />
			</Panel>
		);
	}
	if ( status === 'error' ) {
		return (
			<Panel>
				<p className="dpo-error">{ error }</p>
			</Panel>
		);
	}

	const numField = ( key, label ) => (
		<Field label={ label }>
			<TextControl
				type="number"
				value={ values[ key ] }
				onChange={ ( v ) => set( key, parseInt( v, 10 ) || 0 ) }
			/>
		</Field>
	);

	return (
		<div className="dpo-settings">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Settings',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
				</div>
				<button
					type="button"
					className="dpo-btn dpo-btn--primary"
					disabled={ saving }
					onClick={ onSave }
				>
					{ saving
						? __(
								'Saving…',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Save settings',
								'dynamic-product-options-for-woocommerce'
						  ) }
				</button>
			</header>

			<Panel
				title={ __(
					'Price display',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<div className="dpo-inspector__row">
					<ToggleField
						checked={ values.showPriceLine }
						onChange={ ( v ) =>
							set( 'showPriceLine', v )
						}
						label={ __(
							'Show options price line',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
				<Field
					label={ __(
						'Options price label',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.priceLineLabel }
						onChange={ ( v ) =>
							set( 'priceLineLabel', v )
						}
					/>
				</Field>
				<div className="dpo-inspector__row">
					<ToggleField
						checked={ values.showTotalLine }
						onChange={ ( v ) =>
							set( 'showTotalLine', v )
						}
						label={ __(
							'Show total price line',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
				<Field
					label={ __(
						'Total price label',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.totalLineLabel }
						onChange={ ( v ) =>
							set( 'totalLineLabel', v )
						}
					/>
				</Field>
			</Panel>

			<Panel
				title={ __(
					'Cart & checkout',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<div className="dpo-inspector__row">
					<ToggleField
						checked={ values.hideInCart }
						onChange={ ( v ) => set( 'hideInCart', v ) }
						label={ __(
							'Hide options in cart',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
					<ToggleField
						checked={ values.hideInCheckout }
						onChange={ ( v ) =>
							set( 'hideInCheckout', v )
						}
						label={ __(
							'Hide options in checkout',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
			</Panel>

			<Panel
				title={ __(
					'Shop loop',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<div className="dpo-inspector__row">
					<ToggleField
						checked={ values.shopForceSelect }
						onChange={ ( v ) =>
							set( 'shopForceSelect', v )
						}
						label={ __(
							'Force "Select options" on shop loop',
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
				<Field
					label={ __(
						'Shop loop button text',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.shopButtonText }
						onChange={ ( v ) =>
							set( 'shopButtonText', v )
						}
					/>
				</Field>
			</Panel>

			<Panel
				title={ __(
					'Upload retention (days, 0 = keep forever)',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				{ numField(
					'uploadTempDays',
					__(
						'Temporary uploads',
						'dynamic-product-options-for-woocommerce'
					)
				) }
				{ numField(
					'uploadPlacedDays',
					__(
						'After order placed',
						'dynamic-product-options-for-woocommerce'
					)
				) }
				{ numField(
					'uploadCompletedDays',
					__(
						'After order completed',
						'dynamic-product-options-for-woocommerce'
					)
				) }
			</Panel>

			<FontsManager />
		</div>
	);
}
