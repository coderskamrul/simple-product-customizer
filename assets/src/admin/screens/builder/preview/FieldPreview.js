/**
 * Live, storefront-accurate preview of a single field node. Drives both the
 * editable canvas (wrapped by FieldCard) and the read-only Preview mode. It
 * mirrors the real control per type — button groups, swatches, dropdowns,
 * inputs — and shows computed per-choice prices (regular + sale) plus any
 * per-choice image so editors see exactly what shoppers will. Recurses for
 * `section` containers.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ChevronDown, Check, Upload } from 'lucide-react';
import { useConfig } from '../../../store/ConfigContext';

/** Demo base price used to render percentage-based choice prices. */
const DEMO_BASE = 20;

/**
 * Format one price amount for a choice, honouring percentage mode.
 *
 * @param {Object}   choice      Choice row.
 * @param {*}        raw         Raw amount (regular or sale).
 * @param {Function} formatPrice Currency formatter.
 * @return {string} Formatted amount, or '' when not a number.
 */
function fmtAmount( choice, raw, formatPrice ) {
	const amount = Number( raw );
	if ( raw === '' || raw === undefined || raw === null || Number.isNaN( amount ) ) {
		return '';
	}
	if ( choice.priceMode === 'percent' ) {
		return formatPrice( ( DEMO_BASE * amount ) / 100 );
	}
	return formatPrice( amount );
}

/**
 * Resolve the inline style for a swatch box from the field config — size and
 * border-radius. Radius falls back to the chosen shape preset. Mirrors
 * AbstractField::swatch_style() so the canvas matches the storefront.
 *
 * @param {Object} cfg Field config bag.
 * @return {Object} React style object.
 */
function swatchStyle( cfg ) {
	const style = {};
	if ( cfg.swatchWidth !== '' && cfg.swatchWidth !== undefined ) {
		style.width = `${ cfg.swatchWidth }px`;
	}
	if ( cfg.swatchHeight !== '' && cfg.swatchHeight !== undefined ) {
		style.height = `${ cfg.swatchHeight }px`;
	}
	if ( cfg.swatchRadius !== '' && cfg.swatchRadius !== undefined ) {
		style.borderRadius = `${ cfg.swatchRadius }px`;
	} else if ( cfg.shape === 'circle' ) {
		style.borderRadius = '50%';
	} else if ( cfg.shape === 'rounded' ) {
		style.borderRadius = '10px';
	} else if ( cfg.shape === 'square' ) {
		style.borderRadius = '4px';
	}
	return style;
}

/**
 * Per-choice price tag — strikes the regular price when a sale exists, in
 * line with the field-settings reference designs.
 *
 * @param {Object}   props             Component props.
 * @param {Object}   props.choice      Choice row.
 * @param {Function} props.formatPrice Currency formatter.
 * @return {JSX.Element|null} The price tag.
 */
function PriceTag( { choice, formatPrice } ) {
	if ( ! choice || ! choice.priceMode || choice.priceMode === 'none' ) {
		return null;
	}
	const reg = fmtAmount( choice, choice.regular, formatPrice );
	const sale = fmtAmount( choice, choice.sale, formatPrice );
	if ( ! reg && ! sale ) {
		return null;
	}
	return (
		<span className="dpo-pf__price">
			{ sale ? (
				<>
					<s>{ reg }</s> <b>{ sale }</b>
				</>
			) : (
				<b>{ reg }</b>
			) }
		</span>
	);
}

/**
 * Interactive faux dropdown for the canvas (a native <select> can't show
 * per-option thumbnails). Clicking the box toggles the option list; the
 * click is contained so it doesn't bubble to card selection.
 *
 * @param {Object}   props             Component props.
 * @param {Object}   props.node        Field node.
 * @param {Array}    props.choices     Choice rows.
 * @param {Function} props.formatPrice Currency formatter.
 * @return {JSX.Element} The dropdown preview.
 */
function SelectPreview( { node, choices, formatPrice } ) {
	const [ open, setOpen ] = useState( false );
	const current = choices.find( ( c ) => c.selected ) || choices[ 0 ];

	const Option = ( { c, i } ) => (
		<span className="dpo-pf__select-opt">
			{ c.image && (
				<span className="dpo-pf__choice-img">
					<img src={ c.image } alt="" />
				</span>
			) }
			<span>
				{ c.label || `Option ${ i + 1 }` }
			</span>
			<PriceTag choice={ c } formatPrice={ formatPrice } />
		</span>
	);

	return (
		<div className={ `dpo-pf__select${ open ? ' is-open' : '' }` }>
			{ /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */ }
			<div
				className="dpo-pf__select-box"
				role="button"
				tabIndex={ 0 }
				onClick={ ( e ) => {
					e.stopPropagation();
					setOpen( ( o ) => ! o );
				} }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						setOpen( ( o ) => ! o );
					}
				} }
			>
				{ current ? (
					<Option c={ current } i={ 0 } />
				) : (
					<span className="dpo-pf__select-placeholder">
						{ node.placeholder ||
							__(
								'Choose…',
								'dynamic-product-options-for-woocommerce'
							) }
					</span>
				) }
				<ChevronDown size={ 16 } aria-hidden="true" />
			</div>
			{ open && choices.length > 0 && (
				<div className="dpo-pf__select-list">
					{ choices.map( ( c, i ) => (
						<div key={ c.uid || i } className="dpo-pf__select-row">
							<Option c={ c } i={ i } />
						</div>
					) ) }
				</div>
			) }
		</div>
	);
}

/**
 * Per-choice quantity stepper, shown when the field has quantity enabled.
 * Mirrors the storefront input including the configured min/max bounds.
 *
 * @param {Object} props     Component props.
 * @param {Object} props.cfg Field config bag.
 * @return {JSX.Element} The quantity input.
 */
function QtyBox( { cfg } ) {
	const min = cfg.minQty === '' || cfg.minQty === undefined ? 0 : cfg.minQty;
	return (
		<input
			type="number"
			className="dpo-pf__qty"
			min={ min }
			max={
				cfg.maxQty === '' || cfg.maxQty === undefined
					? undefined
					: cfg.maxQty
			}
			defaultValue={ cfg.minQty || 1 }
			readOnly
		/>
	);
}

/**
 * The description line, honouring placement.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.node Field node.
 * @param {string} props.at   Placement slot to render in.
 * @return {JSX.Element|null} The help text.
 */
function Help( { node, at } ) {
	if ( ! node.description || node.descriptionPlacement !== at ) {
		return null;
	}
	return <p className="dpo-pf__help">{ node.description }</p>;
}

/**
 * FieldPreview.
 *
 * @param {Object} props      Component props.
 * @param {Object} props.node Field node to render.
 * @return {JSX.Element} The preview markup.
 */
export default function FieldPreview( { node } ) {
	const { formatPrice } = useConfig();
	const choices = node.choices || [];
	const cfg = node.config || {};

	// Layout types render without the label/help scaffold.
	if ( node.type === 'heading' ) {
		const Tag = cfg.level || 'h3';
		return (
			<Tag className="dpo-pf__heading">
				{ node.label ||
					__( 'Heading', 'dynamic-product-options-for-woocommerce' ) }
			</Tag>
		);
	}
	if ( node.type === 'divider' ) {
		return <hr className="dpo-pf__divider" />;
	}
	if ( node.type === 'spacer' ) {
		return (
			<div
				className="dpo-pf__spacer"
				style={ { height: `${ cfg.height || 24 }px` } }
			/>
		);
	}
	if ( node.type === 'html' ) {
		return (
			<div className="dpo-pf__html">
				{ cfg.html || (
					<span className="dpo-pf__placeholder">
						{ __(
							'Custom HTML',
							'dynamic-product-options-for-woocommerce'
						) }
					</span>
				) }
			</div>
		);
	}
	if ( node.type === 'shortcode' ) {
		return (
			<code className="dpo-pf__shortcode">
				{ cfg.shortcode || '[shortcode]' }
			</code>
		);
	}
	if ( node.type === 'section' ) {
		return (
			<fieldset className="dpo-pf__section">
				<legend>
					{ node.label ||
						__(
							'Section',
							'dynamic-product-options-for-woocommerce'
						) }
				</legend>
				<div className="dpo-pf__section-body">
					{ ( node.children || [] ).length === 0 ? (
						<p className="dpo-pf__placeholder">
							{ __(
								'Empty section',
								'dynamic-product-options-for-woocommerce'
							) }
						</p>
					) : (
						( node.children || [] ).map( ( c ) => (
							<FieldPreview key={ c.id } node={ c } />
						) )
					) }
				</div>
			</fieldset>
		);
	}

	let control = null;
	switch ( node.type ) {
		case 'buttongroup':
		case 'fontpicker':
			control = (
				<div className="dpo-pf__buttons">
					{ choices.map( ( c, i ) => (
						<span
							key={ c.uid || i }
							className={ `dpo-pf__button${
								c.selected ? ' is-active' : ''
							}` }
							style={
								c.fontFamily
									? { fontFamily: c.fontFamily }
									: undefined
							}
						>
							{ c.label || `Option ${ i + 1 }` }
							<PriceTag choice={ c } formatPrice={ formatPrice } />
						</span>
					) ) }
				</div>
			);
			break;
		case 'checkbox':
		case 'radio':
			control = (
				<div className="dpo-pf__choices">
					{ choices.map( ( c, i ) => (
						<span key={ c.uid || i } className="dpo-pf__choice">
							<input
								type={
									node.type === 'checkbox'
										? 'checkbox'
										: 'radio'
								}
								defaultChecked={ !! c.selected }
								readOnly
							/>
							{ c.image && (
								<span className="dpo-pf__choice-img">
									<img src={ c.image } alt="" />
								</span>
							) }
							<span>{ c.label || `Option ${ i + 1 }` }</span>
							<PriceTag choice={ c } formatPrice={ formatPrice } />
							{ cfg.enableQty && <QtyBox cfg={ cfg } /> }
						</span>
					) ) }
				</div>
			);
			break;
		case 'select':
			control = (
				<SelectPreview
					node={ node }
					choices={ choices }
					formatPrice={ formatPrice }
				/>
			);
			break;
		case 'toggle':
			control = (
				<span className="dpo-pf__toggle" aria-hidden="true">
					<span className="dpo-pf__toggle-knob" />
				</span>
			);
			break;
		case 'colorswatch':
			control = (
				<div className="dpo-pf__swatches">
					{ choices.map( ( c, i ) => (
						<span
							key={ c.uid || i }
							className="dpo-pf__swatch-tile"
						>
							<span
								className={ `dpo-pf__swatch${
									c.selected ? ' is-active' : ''
								}` }
								style={ {
									background: c.color || '#e2e8f0',
									...swatchStyle( cfg ),
								} }
								title={ c.label }
							>
								{ c.selected && (
									<span className="dpo-pf__swatch-check">
										<Check size={ 12 } />
									</span>
								) }
							</span>
							<span className="dpo-pf__swatch-label">
								{ c.label || `Color ${ i + 1 }` }
							</span>
							<PriceTag choice={ c } formatPrice={ formatPrice } />
							{ cfg.enableQty && <QtyBox cfg={ cfg } /> }
						</span>
					) ) }
				</div>
			);
			break;
		case 'imageswatch':
			control = (
				<div className="dpo-pf__swatches">
					{ choices.map( ( c, i ) => (
						<span
							key={ c.uid || i }
							className="dpo-pf__swatch-tile"
						>
							<span
								className={ `dpo-pf__img-swatch${
									c.selected ? ' is-active' : ''
								}` }
								style={ swatchStyle( cfg ) }
								title={ c.label }
							>
								{ c.image ? (
									<img src={ c.image } alt={ c.label } />
								) : null }
								{ c.selected && (
									<span className="dpo-pf__swatch-check">
										<Check size={ 12 } />
									</span>
								) }
							</span>
							<span className="dpo-pf__swatch-label">
								{ c.label || `Image ${ i + 1 }` }
							</span>
							<PriceTag choice={ c } formatPrice={ formatPrice } />
							{ cfg.enableQty && <QtyBox cfg={ cfg } /> }
						</span>
					) ) }
				</div>
			);
			break;
		case 'range':
			control = (
				<input
					type="range"
					className="dpo-pf__range"
					min={ cfg.min ?? 0 }
					max={ cfg.max ?? 100 }
					step={ cfg.step ?? 1 }
					readOnly
				/>
			);
			break;
		case 'textarea':
			control = (
				<textarea
					className="dpo-pf__input"
					rows={ cfg.rows || 3 }
					placeholder={ node.placeholder }
					readOnly
				/>
			);
			break;
		case 'colorpicker':
			control = (
				<span className="dpo-pf__colorpicker">
					<span
						className="dpo-pf__colorpicker-dot"
						style={
							cfg.defaultColor
								? { background: cfg.defaultColor }
								: undefined
						}
					/>
					{ cfg.defaultColor ||
						__(
							'Pick a colour',
							'dynamic-product-options-for-woocommerce'
						) }
				</span>
			);
			break;
		case 'fileupload':
			control = (
				<div className="dpo-pf__dropzone">
					<span className="dpo-pf__dropzone-btn">
						<Upload size={ 14 } aria-hidden="true" />
						{ cfg.uploadText ||
							__(
								'Upload',
								'dynamic-product-options-for-woocommerce'
							) }
					</span>
					<span className="dpo-pf__dropzone-text">
						{ cfg.dragText ||
							__(
								'Click or drag and drop',
								'dynamic-product-options-for-woocommerce'
							) }
					</span>
				</div>
			);
			break;
		case 'linkedproducts':
			control = (
				<div className="dpo-pf__placeholder">
					{ __(
						'Linked products',
						'dynamic-product-options-for-woocommerce'
					) }
				</div>
			);
			break;
		case 'popup':
			control = (
				<span className="dpo-pf__button is-active">
					{ cfg.triggerText ||
						__( 'Open', 'dynamic-product-options-for-woocommerce' ) }
				</span>
			);
			break;
		case 'formula':
		case 'advancedformula':
			control = (
				<code className="dpo-pf__shortcode">
					{ cfg.formula ||
						__(
							'Formula result',
							'dynamic-product-options-for-woocommerce'
						) }
				</code>
			);
			break;
		default:
			control = (
				<input
					className="dpo-pf__input"
					type={
						[
							'email',
							'url',
							'tel',
							'number',
							'date',
							'time',
						].includes( node.type )
							? node.type
							: 'text'
					}
					placeholder={ node.placeholder }
					readOnly
				/>
			);
	}

	return (
		<div className={ `dpo-pf dpo-pf--${ node.type }` }>
			{ ! node.hideLabel && (
				<span className="dpo-pf__label">
					{ node.label ||
						__(
							'Untitled field',
							'dynamic-product-options-for-woocommerce'
						) }
					{ node.required && <span className="dpo-pf__req">*</span> }
					{ ( node.type === 'date' || node.type === 'time' ) && (
						<PriceTag
							choice={ choices[ 0 ] }
							formatPrice={ formatPrice }
						/>
					) }
				</span>
			) }
			<Help node={ node } at="below_label" />
			{ control }
			<Help node={ node } at="below_field" />
		</div>
	);
}
