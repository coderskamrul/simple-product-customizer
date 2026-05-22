/**
 * Live, storefront-accurate preview of a single field node. Drives both the
 * editable canvas (wrapped by FieldCard) and the read-only Preview mode. It
 * mirrors the real control per type — button groups, swatches, dropdowns,
 * inputs — and shows computed per-choice prices so editors see exactly what
 * shoppers will. Recurses for `section` containers.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { useConfig } from '../../../store/ConfigContext';

/** Demo base price used to render percentage-based choice prices. */
const DEMO_BASE = 20;

/**
 * Compute a display price string for a choice, mirroring PriceCalculator's
 * intent closely enough for an at-a-glance preview.
 *
 * @param {Object}   choice      Choice row.
 * @param {Function} formatPrice Currency formatter.
 * @return {string} A "+price" string, or '' when the choice has no price.
 */
function choicePrice( choice, formatPrice ) {
	if ( ! choice.priceMode || choice.priceMode === 'none' ) {
		return '';
	}
	const raw = choice.sale !== '' ? choice.sale : choice.regular;
	const amount = Number( raw );
	if ( raw === '' || raw === undefined || Number.isNaN( amount ) ) {
		return '';
	}
	if ( choice.priceMode === 'percent' ) {
		return formatPrice( ( DEMO_BASE * amount ) / 100 );
	}
	return formatPrice( amount );
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
					{ choices.map( ( c, i ) => {
						const price = choicePrice( c, formatPrice );
						return (
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
								{ price && (
									<b className="dpo-pf__price">{ price }</b>
								) }
							</span>
						);
					} ) }
				</div>
			);
			break;
		case 'checkbox':
		case 'radio':
			control = (
				<div className="dpo-pf__choices">
					{ choices.map( ( c, i ) => {
						const price = choicePrice( c, formatPrice );
						return (
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
								<span>{ c.label || `Option ${ i + 1 }` }</span>
								{ price && (
									<b className="dpo-pf__price">{ price }</b>
								) }
							</span>
						);
					} ) }
				</div>
			);
			break;
		case 'select':
			control = (
				<div className="dpo-pf__select">
					<select disabled defaultValue="">
						<option value="">
							{ node.placeholder ||
								__(
									'Choose…',
									'dynamic-product-options-for-woocommerce'
								) }
						</option>
						{ choices.map( ( c, i ) => {
							const price = choicePrice( c, formatPrice );
							return (
								<option key={ c.uid || i }>
									{ c.label }
									{ price ? ` (+${ price })` : '' }
								</option>
							);
						} ) }
					</select>
				</div>
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
							className={ `dpo-pf__swatch${
								c.selected ? ' is-active' : ''
							}` }
							style={ { background: c.color || '#e2e8f0' } }
							title={ c.label }
						/>
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
							className={ `dpo-pf__img-swatch${
								c.selected ? ' is-active' : ''
							}` }
							title={ c.label }
						>
							{ c.image ? (
								<img src={ c.image } alt={ c.label } />
							) : null }
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
					<span className="dpo-pf__colorpicker-dot" />
					{ __(
						'Pick a colour',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
			);
			break;
		case 'fileupload':
			control = (
				<span className="dpo-pf__upload">
					{ __(
						'Choose file…',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
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
						__(
							'Open',
							'dynamic-product-options-for-woocommerce'
						) }
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
				</span>
			) }
			<Help node={ node } at="below_label" />
			{ control }
			<Help node={ node } at="below_field" />
		</div>
	);
}
