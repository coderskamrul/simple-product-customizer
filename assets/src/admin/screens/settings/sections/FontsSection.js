/**
 * Custom Fonts section — an "Add new font" form card plus the list of
 * uploaded fonts (or an empty state). Fonts persist immediately, so this
 * section is independent of the Save settings action.
 *
 * @package
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Field, TextControl, Spinner } from '../../../components';
import { useToast } from '../../../store/ToastContext';
import { injectFontFaces } from '../../../hooks/useCustomFonts';
import SettingCard from '../SettingCard';
import FilePicker from '../FilePicker';
import useFonts from '../useFonts';

const ACCEPT = '.ttf,.otf,.woff,.woff2';

/**
 * FontsSection.
 *
 * @return {JSX.Element} The section.
 */
export default function FontsSection() {
	const { notify } = useToast();
	const { fonts, loading, busy, upload, update, remove } = useFonts();
	const [ title, setTitle ] = useState( '' );
	const [ family, setFamily ] = useState( '' );
	const fileRef = useRef( null );

	// Register @font-face for every uploaded font so the name + sample lines
	// below actually render in their own face.
	useEffect( () => {
		injectFontFaces( fonts );
	}, [ fonts ] );

	// Inline edit state (one row at a time).
	const [ editingId, setEditingId ] = useState( '' );
	const [ editTitle, setEditTitle ] = useState( '' );
	const [ editFamily, setEditFamily ] = useState( '' );

	const startEdit = ( f ) => {
		setEditingId( f.id );
		setEditTitle( f.title || '' );
		setEditFamily( f.family || '' );
	};
	const cancelEdit = () => setEditingId( '' );
	const saveEdit = async ( id ) => {
		if ( ! editTitle.trim() ) {
			notify(
				__(
					'Font title is required.',
					'dynamic-product-options-for-woocommerce'
				),
				'error'
			);
			return;
		}
		const ok = await update( id, {
			title: editTitle.trim(),
			family: editFamily.trim(),
		} );
		if ( ok ) {
			setEditingId( '' );
		}
	};

	/**
	 * Validate then upload, resetting the form on success.
	 *
	 * @return {Promise<void>} Resolves after the round-trip.
	 */
	const onUpload = async () => {
		const file =
			fileRef.current && fileRef.current.files[ 0 ]
				? fileRef.current.files[ 0 ]
				: null;
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
		const ok = await upload( file, title.trim(), family.trim() );
		if ( ok ) {
			setTitle( '' );
			setFamily( '' );
			if ( fileRef.current ) {
				fileRef.current.value = '';
			}
		}
	};

	return (
		<div className="dpo-set-stack">
			<SettingCard
				icon="plus-alt2"
				tone="pink"
				title={ __(
					'Add New Font',
					'dynamic-product-options-for-woocommerce'
				) }
				subtitle={ __(
					'Upload a font file and give it a name',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<div className="dpo-set-fontform">
					<Field
						label={ __(
							'Font Title *',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							value={ title }
							placeholder={ __(
								'My Custom Font',
								'dynamic-product-options-for-woocommerce'
							) }
							onChange={ setTitle }
						/>
					</Field>
					<Field
						label={ __(
							'CSS Family (optional)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							value={ family }
							placeholder={ __(
								"'My Custom Font', sans-serif",
								'dynamic-product-options-for-woocommerce'
							) }
							onChange={ setFamily }
						/>
					</Field>
					<Field
						label={ __(
							'Font File *',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<FilePicker inputRef={ fileRef } accept={ ACCEPT } />
					</Field>
					<button
						type="button"
						className="dpo-set-save dpo-set-save--sm"
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
			</SettingCard>

			<div className="dpo-set-fonts">
				<h3 className="dpo-set-fonts__title">
					{ __(
						'Uploaded Fonts',
						'dynamic-product-options-for-woocommerce'
					) }
				</h3>

				{ loading && (
					<div className="dpo-set-fonts__empty">
						<Spinner />
					</div>
				) }
				{ ! loading && fonts.length === 0 && (
					<div className="dpo-set-fonts__empty">
						<span
							className="dashicons dashicons-editor-textcolor dpo-set-fonts__emptyicon"
							aria-hidden="true"
						/>
						<p className="dpo-set-fonts__emptytitle">
							{ __(
								'No custom fonts uploaded yet',
								'dynamic-product-options-for-woocommerce'
							) }
						</p>
						<p className="dpo-set-fonts__emptysub">
							{ __(
								'Add your first font above',
								'dynamic-product-options-for-woocommerce'
							) }
						</p>
					</div>
				) }
				{ ! loading && fonts.length > 0 && (
					<ul className="dpo-set-fontlist">
						{ fonts.map( ( f ) =>
							editingId === f.id ? (
								<li
									key={ f.id }
									className="dpo-set-fontrow dpo-set-fontrow--editing"
								>
									<div className="dpo-set-fontedit">
										<Field
											label={ __(
												'Font Title',
												'dynamic-product-options-for-woocommerce'
											) }
										>
											<TextControl
												value={ editTitle }
												onChange={ setEditTitle }
											/>
										</Field>
										<Field
											label={ __(
												'CSS Family',
												'dynamic-product-options-for-woocommerce'
											) }
										>
											<TextControl
												value={ editFamily }
												onChange={ setEditFamily }
											/>
										</Field>
									</div>
									<div className="dpo-set-fontedit__actions">
										<button
											type="button"
											className="dpo-set-save dpo-set-save--sm"
											disabled={ busy }
											onClick={ () => saveEdit( f.id ) }
										>
											{ __(
												'Save',
												'dynamic-product-options-for-woocommerce'
											) }
										</button>
										<button
											type="button"
											className="dpo-btn dpo-btn--ghost"
											onClick={ cancelEdit }
										>
											{ __(
												'Cancel',
												'dynamic-product-options-for-woocommerce'
											) }
										</button>
									</div>
								</li>
							) : (
								<li key={ f.id } className="dpo-set-fontrow">
									<span
										className="dpo-set-fontrow__name"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ f.title }
									</span>
									<span className="dpo-set-fontrow__meta">
										{ f.family || '—' }
									</span>
									<span className="dpo-set-fontrow__type">
										{ ( f.file_type || '' ).toUpperCase() }
									</span>
									<button
										type="button"
										className="dpo-set-iconbtn"
										onClick={ () => startEdit( f ) }
										aria-label={ __(
											'Edit font',
											'dynamic-product-options-for-woocommerce'
										) }
									>
										<span
											className="dashicons dashicons-edit"
											aria-hidden="true"
										/>
									</button>
									<button
										type="button"
										className="dpo-set-iconbtn dpo-set-iconbtn--danger"
										onClick={ () => remove( f.id ) }
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
									<span
										className="dpo-set-fontrow__sample"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ __(
											'The quick brown fox jumps over the lazy dog',
											'dynamic-product-options-for-woocommerce'
										) }
									</span>
								</li>
							)
						) }
					</ul>
				) }
			</div>
		</div>
	);
}
