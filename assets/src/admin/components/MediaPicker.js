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
		title: __( 'Select image', 'dynamic-product-options-for-woocommerce' ),
		button: {
			text: __( 'Use image', 'dynamic-product-options-for-woocommerce' ),
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
		<div className="dpo-media-picker">
			{ value ? (
				<div className="dpo-media-picker__preview">
					<img src={ value } alt="" />
					<button
						type="button"
						className="dpo-icon-btn dpo-media-picker__remove"
						onClick={ () => onChange( null ) }
						aria-label={ __(
							'Remove image',
							'dynamic-product-options-for-woocommerce'
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
					className="dpo-btn dpo-btn--ghost"
					disabled={ ! available }
					onClick={ () => openFrame( onChange ) }
				>
					{ available
						? __(
								'Select image',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Media library unavailable',
								'dynamic-product-options-for-woocommerce'
						  ) }
				</button>
			) }
		</div>
	);
}
