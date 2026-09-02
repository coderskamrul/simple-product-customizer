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
			<div className="spcus-settings__grid2">
				<Field
					label={ __(
						'Trigger button text',
						'simple-product-customizer'
					) }
				>
					<TextControl
						value={ cfg.triggerText ?? '' }
						placeholder={ __(
							'Open',
							'simple-product-customizer'
						) }
						onChange={ ( v ) => setKey( 'triggerText', v ) }
					/>
				</Field>
			</div>

			<Field
				label={ __(
					'Popup content',
					'simple-product-customizer'
				) }
				help={ __(
					'Design the content shown inside the popup — text, images, links and tables.',
					'simple-product-customizer'
				) }
			>
				<button
					type="button"
					className="spcus-btn spcus-btn--ghost spcus-popupcfg__launch"
					onClick={ () => setOpen( true ) }
				>
					<Pencil size={ 15 } />
					{ hasContent
						? __(
								'Edit popup content',
								'simple-product-customizer'
						  )
						: __(
								'Design popup content',
								'simple-product-customizer'
						  ) }
				</button>
			</Field>

			{ open && (
				<Modal
					size="lg"
					title={ __(
						'Popup Builder',
						'simple-product-customizer'
					) }
					onClose={ () => setOpen( false ) }
					footer={
						<>
							<button
								type="button"
								className="spcus-btn spcus-btn--ghost spcus-popupcfg__foot-preview"
								onClick={ () => setPreview( true ) }
							>
								<Eye size={ 15 } />
								{ __(
									'Preview',
									'simple-product-customizer'
								) }
							</button>
							<button
								type="button"
								className="spcus-btn spcus-btn--primary"
								onClick={ () => setOpen( false ) }
							>
								<Check size={ 15 } />
								{ __(
									'Done',
									'simple-product-customizer'
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
