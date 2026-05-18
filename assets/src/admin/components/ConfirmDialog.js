/**
 * Confirmation modal for destructive actions (delete set, etc.).
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import Modal from './Modal';

/**
 * ConfirmDialog.
 *
 * @param {Object}   props              Component props.
 * @param {string}   props.title        Dialog title.
 * @param {string}   props.message      Confirmation copy.
 * @param {Function} props.onConfirm    Confirm handler.
 * @param {Function} props.onCancel     Cancel/close handler.
 * @param {string}   [props.confirmText] Confirm button label.
 * @param {boolean}  [props.danger]     Style confirm as destructive.
 * @return {JSX.Element} The dialog.
 */
export default function ConfirmDialog( {
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = __( 'Confirm', 'dynamic-product-options-for-woocommerce' ),
	danger = true,
} ) {
	return (
		<Modal
			title={ title }
			onClose={ onCancel }
			size="sm"
			footer={
				<>
					<button
						type="button"
						className="dpo-btn dpo-btn--ghost"
						onClick={ onCancel }
					>
						{ __(
							'Cancel',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
					<button
						type="button"
						className={ `dpo-btn ${
							danger
								? 'dpo-btn--danger'
								: 'dpo-btn--primary'
						}` }
						onClick={ onConfirm }
					>
						{ confirmText }
					</button>
				</>
			}
		>
			<p>{ message }</p>
		</Modal>
	);
}
