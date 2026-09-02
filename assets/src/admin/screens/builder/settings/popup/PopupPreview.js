/**
 * Live popup preview shown from the Popup Builder. Renders the authored content
 * with the same modal chrome, corner close button and open animation as the
 * storefront (`includes/Fields/Type/PopupField.php` + blocks.scss) so the
 * builder preview matches the frontend 1:1. Reuses `.spcus-rte__content` for
 * identical rich-text typography.
 *
 * @package
 */

import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * PopupPreview.
 *
 * @param {Object}   props         Component props.
 * @param {string}   props.content Authored HTML.
 * @param {Function} props.onClose () => void.
 * @return {JSX.Element} The preview overlay.
 */
export default function PopupPreview( { content, onClose } ) {
	useEffect( () => {
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			}
		};
		document.addEventListener( 'keydown', onKey );
		return () => document.removeEventListener( 'keydown', onKey );
	}, [ onClose ] );

	const html =
		content && content.trim()
			? content
			: `<p><em>${ __(
					'Nothing to preview yet — add some content.',
					'simple-product-customizer'
			  ) }</em></p>`;

	return (
		<div
			className="spcus-pp-preview"
			role="dialog"
			aria-modal="true"
			aria-label={ __(
				'Popup preview',
				'simple-product-customizer'
			) }
		>
			<div
				className="spcus-pp-preview__backdrop"
				onClick={ onClose }
				role="presentation"
			/>
			<div className="spcus-pp-preview__box">
				<button
					type="button"
					className="spcus-pp-preview__close"
					onClick={ onClose }
					aria-label={ __(
						'Close',
						'simple-product-customizer'
					) }
				>
					&times;
				</button>
				<div
					className="spcus-rte__content spcus-pp-preview__content"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={ { __html: html } }
				/>
			</div>
		</div>
	);
}
