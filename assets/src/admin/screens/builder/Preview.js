/**
 * Builder preview pane — an approximate, non-interactive render of the
 * field tree so editors can sanity-check layout/labels. Intentionally
 * lightweight (the real storefront markup is produced by PHP).
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { getType } from '../../fields/registry';
import { useBuilder } from '../../store/BuilderContext';

/**
 * Render a single field approximation.
 *
 * @param {Object} node Field node.
 * @return {JSX.Element} Preview markup.
 */
function PreviewField( { node } ) {
	const def = getType( node.type );
	const label = node.label || def.label;
	const choices = node.choices || [];

	let control = null;
	switch ( node.type ) {
		case 'textarea':
		case 'html':
			control = <textarea className="dpo-pv-input" rows={ 3 } readOnly />;
			break;
		case 'select':
			control = (
				<select className="dpo-pv-input" disabled>
					{ choices.map( ( c, i ) => (
						<option key={ i }>{ c.label }</option>
					) ) }
				</select>
			);
			break;
		case 'checkbox':
		case 'radio':
		case 'buttongroup':
			control = (
				<div className="dpo-pv-choices">
					{ choices.map( ( c, i ) => (
						<label key={ i } className="dpo-pv-choice">
							<input
								type={
									node.type === 'checkbox'
										? 'checkbox'
										: 'radio'
								}
								disabled
							/>
							{ c.label }
						</label>
					) ) }
				</div>
			);
			break;
		case 'colorswatch':
			control = (
				<div className="dpo-pv-swatches">
					{ choices.map( ( c, i ) => (
						<span
							key={ i }
							className="dpo-pv-swatch"
							style={ { background: c.color || '#ccc' } }
							title={ c.label }
						/>
					) ) }
				</div>
			);
			break;
		case 'heading':
			return <h4 className="dpo-pv-heading">{ label }</h4>;
		case 'divider':
			return <hr className="dpo-pv-divider" />;
		case 'spacer':
			return (
				<div
					className="dpo-pv-spacer"
					style={ {
						height: `${
							( node.config && node.config.height ) || 24
						}px`,
					} }
				/>
			);
		case 'section':
			return (
				<fieldset className="dpo-pv-section">
					<legend>{ label }</legend>
					{ ( node.children || [] ).map( ( c ) => (
						<PreviewField key={ c.id } node={ c } />
					) ) }
				</fieldset>
			);
		default:
			control = (
				<input className="dpo-pv-input" disabled placeholder={ node.placeholder } />
			);
	}

	return (
		<div className="dpo-pv-field">
			{ ! node.hideLabel && (
				<span className="dpo-pv-label">
					{ label }
					{ node.required && (
						<span className="dpo-pv-req">*</span>
					) }
				</span>
			) }
			{ control }
		</div>
	);
}

/**
 * Preview.
 *
 * @return {JSX.Element} The preview pane.
 */
export default function Preview() {
	const { tree } = useBuilder();
	return (
		<div className="dpo-preview">
			<div className="dpo-preview__head">
				{ __(
					'Live preview (approximate)',
					'dynamic-product-options-for-woocommerce'
				) }
			</div>
			<div className="dpo-preview__body dpo-options">
				{ tree.length === 0 ? (
					<p className="dpo-hint">
						{ __(
							'Add fields to see a preview.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				) : (
					tree.map( ( node ) => (
						<PreviewField key={ node.id } node={ node } />
					) )
				) }
			</div>
		</div>
	);
}
