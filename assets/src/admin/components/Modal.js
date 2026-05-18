/**
 * Accessible modal dialog (focus trap-lite + Escape + backdrop close).
 *
 * @package DPO\Admin
 */

import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Modal.
 *
 * @param {Object}      props          Component props.
 * @param {string}      props.title    Dialog title.
 * @param {Function}    props.onClose  Close handler.
 * @param {JSX.Element} props.children Body.
 * @param {JSX.Element} [props.footer] Optional footer actions.
 * @param {string}      [props.size]   sm|md|lg.
 * @return {JSX.Element} The modal.
 */
export default function Modal( {
	title,
	onClose,
	children,
	footer,
	size = 'md',
} ) {
	const ref = useRef( null );

	useEffect( () => {
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			}
		};
		document.addEventListener( 'keydown', onKey );
		if ( ref.current ) {
			ref.current.focus();
		}
		return () => document.removeEventListener( 'keydown', onKey );
	}, [ onClose ] );

	return (
		<div
			className="dpo-modal-overlay"
			onMouseDown={ ( e ) => {
				if ( e.target === e.currentTarget ) {
					onClose();
				}
			} }
		>
			<div
				className={ `dpo-modal dpo-modal--${ size }` }
				role="dialog"
				aria-modal="true"
				aria-label={ title }
				tabIndex={ -1 }
				ref={ ref }
			>
				<header className="dpo-modal__head">
					<h2 className="dpo-modal__title">{ title }</h2>
					<button
						type="button"
						className="dpo-icon-btn"
						onClick={ onClose }
						aria-label={ __(
							'Close',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<span
							className="dashicons dashicons-no-alt"
							aria-hidden="true"
						/>
					</button>
				</header>
				<div className="dpo-modal__body">{ children }</div>
				{ footer && (
					<footer className="dpo-modal__foot">{ footer }</footer>
				) }
			</div>
		</div>
	);
}
