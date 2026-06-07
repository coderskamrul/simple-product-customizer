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
			<div className="pkitfw-settings__grid2">
				<Field
					label={ __(
						'Trigger button text',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.triggerText ?? '' }
						placeholder={ __(
							'Open',
							'productkit-for-woocommerce'
						) }
						onChange={ ( v ) => setKey( 'triggerText', v ) }
					/>
				</Field>
			</div>

			<Field
				label={ __(
					'Popup content',
					'productkit-for-woocommerce'
				) }
				help={ __(
					'Design the content shown inside the popup — text, images, links and tables.',
					'productkit-for-woocommerce'
				) }
			>
				<button
					type="button"
					className="pkitfw-btn pkitfw-btn--ghost pkitfw-popupcfg__launch"
					onClick={ () => setOpen( true ) }
				>
					<Pencil size={ 15 } />
					{ hasContent
						? __(
								'Edit popup content',
								'productkit-for-woocommerce'
						  )
						: __(
								'Design popup content',
								'productkit-for-woocommerce'
						  ) }
				</button>
			</Field>

			{ open && (
				<Modal
					size="lg"
					title={ __(
						'Popup Builder',
						'productkit-for-woocommerce'
					) }
					onClose={ () => setOpen( false ) }
					footer={
						<>
							<button
								type="button"
								className="pkitfw-btn pkitfw-btn--ghost pkitfw-popupcfg__foot-preview"
								onClick={ () => setPreview( true ) }
							>
								<Eye size={ 15 } />
								{ __(
									'Preview',
									'productkit-for-woocommerce'
								) }
							</button>
							<button
								type="button"
								className="pkitfw-btn pkitfw-btn--primary"
								onClick={ () => setOpen( false ) }
							>
								<Check size={ 15 } />
								{ __(
									'Done',
									'productkit-for-woocommerce'
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
