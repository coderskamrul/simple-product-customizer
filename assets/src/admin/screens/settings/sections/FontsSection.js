/**
 * Custom Fonts section — an "Add new font" form card plus the list of
 * uploaded fonts (or an empty state). Fonts persist immediately, so this
 * section is independent of the Save settings action.
 *
 * @package
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Field, TextControl, Skeleton } from '../../../components';
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
					'simple-product-customizer'
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
					'simple-product-customizer'
				),
				'error'
			);
			return;
		}
		if ( ! file ) {
			notify(
				__(
					'Choose a font file first.',
					'simple-product-customizer'
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
		<div className="spcus-set-stack">
			<SettingCard
				icon="plus-alt2"
				tone="pink"
				title={ __(
					'Add New Font',
					'simple-product-customizer'
				) }
				subtitle={ __(
					'Upload a font file and give it a name',
					'simple-product-customizer'
				) }
			>
				<div className="spcus-set-fontform">
					<Field
						label={ __(
							'Font Title *',
							'simple-product-customizer'
						) }
					>
						<TextControl
							value={ title }
							placeholder={ __(
								'My Custom Font',
								'simple-product-customizer'
							) }
							onChange={ setTitle }
						/>
					</Field>
					<Field
						label={ __(
							'CSS Family (optional)',
							'simple-product-customizer'
						) }
					>
						<TextControl
							value={ family }
							placeholder={ __(
								"'My Custom Font', sans-serif",
								'simple-product-customizer'
							) }
							onChange={ setFamily }
						/>
					</Field>
					<Field
						label={ __(
							'Font File *',
							'simple-product-customizer'
						) }
					>
						<FilePicker inputRef={ fileRef } accept={ ACCEPT } />
					</Field>
					<button
						type="button"
						className="spcus-set-save spcus-set-save--sm"
						disabled={ busy }
						onClick={ onUpload }
					>
						{ busy
							? __(
									'Uploading…',
									'simple-product-customizer'
							  )
							: __(
									'Upload',
									'simple-product-customizer'
							  ) }
					</button>
				</div>
			</SettingCard>

			<div className="spcus-set-fonts">
				<h3 className="spcus-set-fonts__title">
					{ __(
						'Uploaded Fonts',
						'simple-product-customizer'
					) }
				</h3>

				{ loading && (
					<div className="spcus-set-fonts__empty">
						<Skeleton w="60%" h={ 14 } />
						<Skeleton w="80%" h={ 12 } />
						<Skeleton w="40%" h={ 12 } />
					</div>
				) }
				{ ! loading && fonts.length === 0 && (
					<div className="spcus-set-fonts__empty">
						<span
							className="dashicons dashicons-editor-textcolor spcus-set-fonts__emptyicon"
							aria-hidden="true"
						/>
						<p className="spcus-set-fonts__emptytitle">
							{ __(
								'No custom fonts uploaded yet',
								'simple-product-customizer'
							) }
						</p>
						<p className="spcus-set-fonts__emptysub">
							{ __(
								'Add your first font above',
								'simple-product-customizer'
							) }
						</p>
					</div>
				) }
				{ ! loading && fonts.length > 0 && (
					<ul className="spcus-set-fontlist">
						{ fonts.map( ( f ) =>
							editingId === f.id ? (
								<li
									key={ f.id }
									className="spcus-set-fontrow spcus-set-fontrow--editing"
								>
									<div className="spcus-set-fontedit">
										<Field
											label={ __(
												'Font Title',
												'simple-product-customizer'
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
												'simple-product-customizer'
											) }
										>
											<TextControl
												value={ editFamily }
												onChange={ setEditFamily }
											/>
										</Field>
									</div>
									<div className="spcus-set-fontedit__actions">
										<button
											type="button"
											className="spcus-set-save spcus-set-save--sm"
											disabled={ busy }
											onClick={ () => saveEdit( f.id ) }
										>
											{ __(
												'Save',
												'simple-product-customizer'
											) }
										</button>
										<button
											type="button"
											className="spcus-btn spcus-btn--ghost"
											onClick={ cancelEdit }
										>
											{ __(
												'Cancel',
												'simple-product-customizer'
											) }
										</button>
									</div>
								</li>
							) : (
								<li key={ f.id } className="spcus-set-fontrow">
									<span
										className="spcus-set-fontrow__name"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ f.title }
									</span>
									<span className="spcus-set-fontrow__meta">
										{ f.family || '—' }
									</span>
									<span className="spcus-set-fontrow__type">
										{ ( f.file_type || '' ).toUpperCase() }
									</span>
									<button
										type="button"
										className="spcus-set-iconbtn"
										onClick={ () => startEdit( f ) }
										aria-label={ __(
											'Edit font',
											'simple-product-customizer'
										) }
									>
										<span
											className="dashicons dashicons-edit"
											aria-hidden="true"
										/>
									</button>
									<button
										type="button"
										className="spcus-set-iconbtn spcus-set-iconbtn--danger"
										onClick={ () => remove( f.id ) }
										aria-label={ __(
											'Delete font',
											'simple-product-customizer'
										) }
									>
										<span
											className="dashicons dashicons-trash"
											aria-hidden="true"
										/>
									</button>
									<span
										className="spcus-set-fontrow__sample"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ __(
											'The quick brown fox jumps over the lazy dog',
											'simple-product-customizer'
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
