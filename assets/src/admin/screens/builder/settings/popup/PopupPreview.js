/**
 * Live popup preview shown from the Popup Builder. Renders the authored content
 * with the same modal chrome, corner close button and open animation as the
 * storefront (`includes/Fields/Type/PopupField.php` + blocks.scss) so the
 * builder preview matches the frontend 1:1. Reuses `.pkitfw-rte__content` for
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
					'productkit-for-woocommerce'
			  ) }</em></p>`;

	return (
		<div
			className="pkitfw-pp-preview"
			role="dialog"
			aria-modal="true"
			aria-label={ __(
				'Popup preview',
				'productkit-for-woocommerce'
			) }
		>
			<div
				className="pkitfw-pp-preview__backdrop"
				onClick={ onClose }
				role="presentation"
			/>
			<div className="pkitfw-pp-preview__box">
				<button
					type="button"
					className="pkitfw-pp-preview__close"
					onClick={ onClose }
					aria-label={ __(
						'Close',
						'productkit-for-woocommerce'
					) }
				>
					&times;
				</button>
				<div
					className="pkitfw-rte__content pkitfw-pp-preview__content"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={ { __html: html } }
				/>
			</div>
		</div>
	);
}
