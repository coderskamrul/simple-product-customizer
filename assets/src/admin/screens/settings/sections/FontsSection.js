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
					'productkit-for-woocommerce'
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
					'productkit-for-woocommerce'
				),
				'error'
			);
			return;
		}
		if ( ! file ) {
			notify(
				__(
					'Choose a font file first.',
					'productkit-for-woocommerce'
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
		<div className="pkitfw-set-stack">
			<SettingCard
				icon="plus-alt2"
				tone="pink"
				title={ __(
					'Add New Font',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Upload a font file and give it a name',
					'productkit-for-woocommerce'
				) }
			>
				<div className="pkitfw-set-fontform">
					<Field
						label={ __(
							'Font Title *',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							value={ title }
							placeholder={ __(
								'My Custom Font',
								'productkit-for-woocommerce'
							) }
							onChange={ setTitle }
						/>
					</Field>
					<Field
						label={ __(
							'CSS Family (optional)',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							value={ family }
							placeholder={ __(
								"'My Custom Font', sans-serif",
								'productkit-for-woocommerce'
							) }
							onChange={ setFamily }
						/>
					</Field>
					<Field
						label={ __(
							'Font File *',
							'productkit-for-woocommerce'
						) }
					>
						<FilePicker inputRef={ fileRef } accept={ ACCEPT } />
					</Field>
					<button
						type="button"
						className="pkitfw-set-save pkitfw-set-save--sm"
						disabled={ busy }
						onClick={ onUpload }
					>
						{ busy
							? __(
									'Uploading…',
									'productkit-for-woocommerce'
							  )
							: __(
									'Upload',
									'productkit-for-woocommerce'
							  ) }
					</button>
				</div>
			</SettingCard>

			<div className="pkitfw-set-fonts">
				<h3 className="pkitfw-set-fonts__title">
					{ __(
						'Uploaded Fonts',
						'productkit-for-woocommerce'
					) }
				</h3>

				{ loading && (
					<div className="pkitfw-set-fonts__empty">
						<Skeleton w="60%" h={ 14 } />
						<Skeleton w="80%" h={ 12 } />
						<Skeleton w="40%" h={ 12 } />
					</div>
				) }
				{ ! loading && fonts.length === 0 && (
					<div className="pkitfw-set-fonts__empty">
						<span
							className="dashicons dashicons-editor-textcolor pkitfw-set-fonts__emptyicon"
							aria-hidden="true"
						/>
						<p className="pkitfw-set-fonts__emptytitle">
							{ __(
								'No custom fonts uploaded yet',
								'productkit-for-woocommerce'
							) }
						</p>
						<p className="pkitfw-set-fonts__emptysub">
							{ __(
								'Add your first font above',
								'productkit-for-woocommerce'
							) }
						</p>
					</div>
				) }
				{ ! loading && fonts.length > 0 && (
					<ul className="pkitfw-set-fontlist">
						{ fonts.map( ( f ) =>
							editingId === f.id ? (
								<li
									key={ f.id }
									className="pkitfw-set-fontrow pkitfw-set-fontrow--editing"
								>
									<div className="pkitfw-set-fontedit">
										<Field
											label={ __(
												'Font Title',
												'productkit-for-woocommerce'
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
												'productkit-for-woocommerce'
											) }
										>
											<TextControl
												value={ editFamily }
												onChange={ setEditFamily }
											/>
										</Field>
									</div>
									<div className="pkitfw-set-fontedit__actions">
										<button
											type="button"
											className="pkitfw-set-save pkitfw-set-save--sm"
											disabled={ busy }
											onClick={ () => saveEdit( f.id ) }
										>
											{ __(
												'Save',
												'productkit-for-woocommerce'
											) }
										</button>
										<button
											type="button"
											className="pkitfw-btn pkitfw-btn--ghost"
											onClick={ cancelEdit }
										>
											{ __(
												'Cancel',
												'productkit-for-woocommerce'
											) }
										</button>
									</div>
								</li>
							) : (
								<li key={ f.id } className="pkitfw-set-fontrow">
									<span
										className="pkitfw-set-fontrow__name"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ f.title }
									</span>
									<span className="pkitfw-set-fontrow__meta">
										{ f.family || '—' }
									</span>
									<span className="pkitfw-set-fontrow__type">
										{ ( f.file_type || '' ).toUpperCase() }
									</span>
									<button
										type="button"
										className="pkitfw-set-iconbtn"
										onClick={ () => startEdit( f ) }
										aria-label={ __(
											'Edit font',
											'productkit-for-woocommerce'
										) }
									>
										<span
											className="dashicons dashicons-edit"
											aria-hidden="true"
										/>
									</button>
									<button
										type="button"
										className="pkitfw-set-iconbtn pkitfw-set-iconbtn--danger"
										onClick={ () => remove( f.id ) }
										aria-label={ __(
											'Delete font',
											'productkit-for-woocommerce'
										) }
									>
										<span
											className="dashicons dashicons-trash"
											aria-hidden="true"
										/>
									</button>
									<span
										className="pkitfw-set-fontrow__sample"
										style={ {
											fontFamily: f.family || 'inherit',
										} }
									>
										{ __(
											'The quick brown fox jumps over the lazy dog',
											'productkit-for-woocommerce'
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
