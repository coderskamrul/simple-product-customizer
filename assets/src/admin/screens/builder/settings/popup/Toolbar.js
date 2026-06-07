/**
 * Toolbar for the popup rich-text editor. Each button drives a TipTap command
 * chain and reflects the editor's active marks/nodes so the controls stay in
 * sync with the caret. Undo/Redo mirror the keyboard shortcuts (Mod+Z /
 * Shift+Mod+Z) that the editor's history extension already binds.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import {
	Undo2,
	Redo2,
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Highlighter,
	Pilcrow,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Link2,
	Link2Off,
	ImageIcon,
	Table as TableIcon,
	Code2,
	RemoveFormatting,
} from 'lucide-react';
import { mediaAvailable, openImageFrame } from './mediaFrame';

/**
 * Single toolbar button.
 *
 * @param {Object}      props            Component props.
 * @param {Function}    props.onClick    Click handler.
 * @param {boolean}     [props.active]   Whether the formatting is active.
 * @param {boolean}     [props.disabled] Disabled state.
 * @param {string}      props.title      Accessible label / tooltip.
 * @param {JSX.Element} props.children   Icon.
 * @return {JSX.Element} The button.
 */
function Btn( { onClick, active = false, disabled = false, title, children } ) {
	return (
		<button
			type="button"
			className={ `pkitfw-rte__btn${ active ? ' is-active' : '' }` }
			onClick={ onClick }
			disabled={ disabled }
			title={ title }
			aria-label={ title }
			aria-pressed={ active }
		>
			{ children }
		</button>
	);
}

/** Visual separator between toolbar groups. */
function Sep() {
	return <span className="pkitfw-rte__sep" aria-hidden="true" />;
}

/**
 * Editor toolbar.
 *
 * @param {Object}   props                Component props.
 * @param {Object}   props.editor         TipTap editor instance.
 * @param {boolean}  props.sourceMode     Whether the HTML source view is open.
 * @param {Function} props.onToggleSource Toggle HTML source view.
 * @param {Function} props.onLink         Open the link prompt.
 * @return {JSX.Element} The toolbar.
 */
export default function Toolbar( {
	editor,
	sourceMode,
	onToggleSource,
	onLink,
} ) {
	if ( ! editor ) {
		return null;
	}

	const heading = ( level ) =>
		editor.chain().focus().toggleHeading( { level } ).run();

	const insertImage = () =>
		openImageFrame( ( img ) =>
			editor
				.chain()
				.focus()
				.setImage( { src: img.url, alt: img.alt } )
				.run()
		);

	const insertTable = () =>
		editor
			.chain()
			.focus()
			.insertTable( { rows: 2, cols: 3, withHeaderRow: true } )
			.run();

	// In source mode only Undo/Redo and the source toggle stay enabled.
	const locked = sourceMode;

	return (
		<div className="pkitfw-rte__toolbar" role="toolbar">
			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Undo (Ctrl/Cmd+Z)',
						'productkit-for-woocommerce'
					) }
					disabled={ locked || ! editor.can().undo() }
					onClick={ () => editor.chain().focus().undo().run() }
				>
					<Undo2 size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Redo (Shift+Ctrl/Cmd+Z)',
						'productkit-for-woocommerce'
					) }
					disabled={ locked || ! editor.can().redo() }
					onClick={ () => editor.chain().focus().redo().run() }
				>
					<Redo2 size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Bold',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'bold' ) }
					onClick={ () => editor.chain().focus().toggleBold().run() }
				>
					<Bold size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Italic',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'italic' ) }
					onClick={ () =>
						editor.chain().focus().toggleItalic().run()
					}
				>
					<Italic size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Underline',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'underline' ) }
					onClick={ () =>
						editor.chain().focus().toggleUnderline().run()
					}
				>
					<UnderlineIcon size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Highlight',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'highlight' ) }
					onClick={ () =>
						editor.chain().focus().toggleHighlight().run()
					}
				>
					<Highlighter size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Paragraph',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'paragraph' ) }
					onClick={ () =>
						editor.chain().focus().setParagraph().run()
					}
				>
					<Pilcrow size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Heading 1',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'heading', { level: 1 } ) }
					onClick={ () => heading( 1 ) }
				>
					<Heading1 size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Heading 2',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'heading', { level: 2 } ) }
					onClick={ () => heading( 2 ) }
				>
					<Heading2 size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Heading 3',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'heading', { level: 3 } ) }
					onClick={ () => heading( 3 ) }
				>
					<Heading3 size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Bullet list',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'bulletList' ) }
					onClick={ () =>
						editor.chain().focus().toggleBulletList().run()
					}
				>
					<List size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Numbered list',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'orderedList' ) }
					onClick={ () =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<ListOrdered size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Align left',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( { textAlign: 'left' } ) }
					onClick={ () =>
						editor.chain().focus().setTextAlign( 'left' ).run()
					}
				>
					<AlignLeft size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Align center',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( { textAlign: 'center' } ) }
					onClick={ () =>
						editor.chain().focus().setTextAlign( 'center' ).run()
					}
				>
					<AlignCenter size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Align right',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( { textAlign: 'right' } ) }
					onClick={ () =>
						editor.chain().focus().setTextAlign( 'right' ).run()
					}
				>
					<AlignRight size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Insert / edit link',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'link' ) }
					onClick={ onLink }
				>
					<Link2 size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Remove link',
						'productkit-for-woocommerce'
					) }
					disabled={ locked || ! editor.isActive( 'link' ) }
					onClick={ () => editor.chain().focus().unsetLink().run() }
				>
					<Link2Off size={ 16 } />
				</Btn>
				<Btn
					title={
						mediaAvailable()
							? __(
									'Insert image',
									'productkit-for-woocommerce'
							  )
							: __(
									'Media library unavailable',
									'productkit-for-woocommerce'
							  )
					}
					disabled={ locked || ! mediaAvailable() }
					onClick={ insertImage }
				>
					<ImageIcon size={ 16 } />
				</Btn>
				<Btn
					title={ __(
						'Insert table',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					active={ editor.isActive( 'table' ) }
					onClick={ insertTable }
				>
					<TableIcon size={ 16 } />
				</Btn>
			</div>

			<Sep />

			<div className="pkitfw-rte__group">
				<Btn
					title={ __(
						'Clear formatting',
						'productkit-for-woocommerce'
					) }
					disabled={ locked }
					onClick={ () =>
						editor
							.chain()
							.focus()
							.unsetAllMarks()
							.clearNodes()
							.run()
					}
				>
					<RemoveFormatting size={ 16 } />
				</Btn>
			</div>

			<div className="pkitfw-rte__group pkitfw-rte__group--end">
				<Btn
					title={ __(
						'Edit HTML source',
						'productkit-for-woocommerce'
					) }
					active={ sourceMode }
					onClick={ onToggleSource }
				>
					<Code2 size={ 16 } />
				</Btn>
			</div>
		</div>
	);
}
