/**
 * General-tab config for the Popup field. Replaces the old plain-textarea with
 * a full Popup Builder: the trigger button text plus a launch button that opens
 * a roomy, responsive modal hosting the rich-text editor. Content is written to
 * `config.content` (the exact key PopupField.php renders) and the trigger label
 * to `config.triggerText`, so the builder and storefront stay in sync.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Pencil, Check, Eye } from 'lucide-react';
import { Field, TextControl, Modal } from '../../../components';
import RichTextEditor from './popup/RichTextEditor';
import PopupPreview from './popup/PopupPreview';

/**
 * PopupConfig.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The config block.
 */
export default function PopupConfig( { node, patch } ) {
	const cfg = node.config || {};
	const [ open, setOpen ] = useState( false );
	const [ preview, setPreview ] = useState( false );
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	const hasContent = !! ( cfg.content && cfg.content.trim() );

	return (
		<>
			<div className="dpo-settings__grid2">
				<Field
					label={ __(
						'Trigger button text',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.triggerText ?? '' }
						placeholder={ __(
							'Open',
							'dynamic-product-options-for-woocommerce'
						) }
						onChange={ ( v ) => setKey( 'triggerText', v ) }
					/>
				</Field>
			</div>

			<Field
				label={ __(
					'Popup content',
					'dynamic-product-options-for-woocommerce'
				) }
				help={ __(
					'Design the content shown inside the popup — text, images, links and tables.',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<button
					type="button"
					className="dpo-btn dpo-btn--ghost dpo-popupcfg__launch"
					onClick={ () => setOpen( true ) }
				>
					<Pencil size={ 15 } />
					{ hasContent
						? __(
								'Edit popup content',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Design popup content',
								'dynamic-product-options-for-woocommerce'
						  ) }
				</button>
			</Field>

			{ open && (
				<Modal
					size="lg"
					title={ __(
						'Popup Builder',
						'dynamic-product-options-for-woocommerce'
					) }
					onClose={ () => setOpen( false ) }
					footer={
						<>
							<button
								type="button"
								className="dpo-btn dpo-btn--ghost dpo-popupcfg__foot-preview"
								onClick={ () => setPreview( true ) }
							>
								<Eye size={ 15 } />
								{ __(
									'Preview',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
							<button
								type="button"
								className="dpo-btn dpo-btn--primary"
								onClick={ () => setOpen( false ) }
							>
								<Check size={ 15 } />
								{ __(
									'Done',
									'dynamic-product-options-for-woocommerce'
								) }
							</button>
						</>
					}
				>
					<RichTextEditor
						value={ cfg.content || '' }
						onChange={ ( html ) => setKey( 'content', html ) }
					/>
				</Modal>
			) }

			{ preview && (
				<PopupPreview
					content={ cfg.content || '' }
					onClose={ () => setPreview( false ) }
				/>
			) }
		</>
	);
}
