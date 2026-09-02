/**
 * WordPress media-library image picker (uses window.wp.media). Gracefully
 * degrades to a disabled state if wp.media is unavailable.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * Open the WP media frame and resolve the chosen attachment.
 *
 * @param {Function} onPick (attachment:{id,url}) => void.
 * @return {void}
 */
function openFrame( onPick ) {
	const media = window.wp && window.wp.media;
	if ( ! media ) {
		return;
	}
	const frame = media( {
		title: __( 'Select image', 'simple-product-customizer' ),
		button: {
			text: __( 'Use image', 'simple-product-customizer' ),
		},
		multiple: false,
		library: { type: 'image' },
	} );
	frame.on( 'select', () => {
		const att = frame.state().get( 'selection' ).first().toJSON();
		onPick( { id: att.id, url: att.url } );
	} );
	frame.open();
}

/**
 * MediaPicker.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.value    Current image URL.
 * @param {Function} props.onChange ({id,url}|null) => void.
 * @return {JSX.Element} The picker.
 */
export default function MediaPicker( { value, onChange } ) {
	const available = !! ( window.wp && window.wp.media );
	return (
		<div className="spcus-media-picker">
			{ value ? (
				<div className="spcus-media-picker__preview">
					<img src={ value } alt="" />
					<button
						type="button"
						className="spcus-icon-btn spcus-media-picker__remove"
						onClick={ () => onChange( null ) }
						aria-label={ __(
							'Remove image',
							'simple-product-customizer'
						) }
					>
						<span
							className="dashicons dashicons-no-alt"
							aria-hidden="true"
						/>
					</button>
				</div>
			) : (
				<button
					type="button"
					className="spcus-btn spcus-btn--ghost"
					disabled={ ! available }
					onClick={ () => openFrame( onChange ) }
				>
					{ available
						? __(
								'Select image',
								'simple-product-customizer'
						  )
						: __(
								'Media library unavailable',
								'simple-product-customizer'
						  ) }
				</button>
			) }
		</div>
	);
}
