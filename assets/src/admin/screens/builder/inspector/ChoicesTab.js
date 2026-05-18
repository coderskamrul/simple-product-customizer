/**
 * Inspector → Choices tab. Repeatable rows for choice-type fields:
 * label / priceMode / regular / sale / selected, plus per-type extras
 * (image, color, font) and a live price badge preview. Enforces the
 * free-tier cap (3 choices) with an upsell hint.
 *
 * @package DPO\Admin
 */

import { __, sprintf } from '@wordpress/i18n';
import { PRICE_MODES, makeChoice } from '../../../fields/registry';
import { useConfig } from '../../../store/ConfigContext';
import {
	Repeater,
	TextControl,
	SelectControl,
	ColorField,
	MediaPicker,
	ProBadge,
} from '../../../components';

const FREE_CHOICE_CAP = 3;

/**
 * Compute a short price-badge string for a choice.
 *
 * @param {Object}   choice      Choice row.
 * @param {Function} formatPrice Currency formatter.
 * @return {string} Badge text (empty when no price).
 */
function badge( choice, formatPrice ) {
	if ( ! choice.priceMode || choice.priceMode === 'none' ) {
		return '';
	}
	const amount = choice.sale !== '' ? choice.sale : choice.regular;
	if ( amount === '' || amount === undefined ) {
		return '';
	}
	if ( choice.priceMode === 'percent' ) {
		return `+${ amount }%`;
	}
	return `+${ formatPrice( amount ) }`;
}

/**
 * ChoicesTab.
 *
 * @param {Object}   props        Component props.
 * @param {Object}   props.node   Selected node.
 * @param {Function} props.patch  (partialNode) => void.
 * @return {JSX.Element} The tab body.
 */
export default function ChoicesTab( { node, patch } ) {
	const { proActive, formatPrice } = useConfig();
	const choices = node.choices || [];
	const isColor = node.type === 'colorswatch';
	const isImage = node.type === 'imageswatch';
	const isFont = node.type === 'fontpicker';

	const priceOptions = PRICE_MODES.map( ( m ) => ( {
		value: m.value,
		label:
			m.pro && ! proActive ? `${ m.label } (Pro)` : m.label,
		disabled: m.pro && ! proActive,
	} ) );

	/**
	 * Patch a single choice by index.
	 *
	 * @param {number} idx   Choice index.
	 * @param {Object} delta Partial choice patch.
	 * @return {void}
	 */
	const setChoice = ( idx, delta ) =>
		patch( {
			choices: choices.map( ( c, i ) =>
				i === idx ? { ...c, ...delta } : c
			),
		} );

	const canAdd = proActive || choices.length < FREE_CHOICE_CAP;

	return (
		<div className="dpo-inspector__pane">
			<Repeater
				rows={ choices }
				onChange={ ( rows ) => patch( { choices: rows } ) }
				makeRow={ () => makeChoice() }
				canAdd={ canAdd }
				addLabel={ __(
					'Add choice',
					'dynamic-product-options-for-woocommerce'
				) }
				addHint={
					<ProBadge
						hint={ sprintf(
							/* translators: %d: free choice cap */
							__(
								'Free version is limited to %d choices per field.',
								'dynamic-product-options-for-woocommerce'
							),
							FREE_CHOICE_CAP
						) }
					/>
				}
				renderRow={ ( choice, idx ) => {
					const b = badge( choice, formatPrice );
					return (
						<div className="dpo-choice-row">
							<div className="dpo-choice-row__main">
								<TextControl
									value={ choice.label }
									placeholder={ __(
										'Choice label',
										'dynamic-product-options-for-woocommerce'
									) }
									onChange={ ( v ) =>
										setChoice( idx, {
											label: v,
										} )
									}
								/>
								{ b && (
									<span className="dpo-price-badge">
										{ b }
									</span>
								) }
							</div>

							<div className="dpo-choice-row__grid">
								<SelectControl
									value={ choice.priceMode }
									onChange={ ( v ) =>
										setChoice( idx, {
											priceMode: v,
										} )
									}
									options={ priceOptions }
								/>
								<TextControl
									type="number"
									value={ choice.regular }
									placeholder={ __(
										'Regular',
										'dynamic-product-options-for-woocommerce'
									) }
									onChange={ ( v ) =>
										setChoice( idx, {
											regular: v,
										} )
									}
								/>
								<TextControl
									type="number"
									value={ choice.sale }
									placeholder={
										proActive
											? __(
													'Sale',
													'dynamic-product-options-for-woocommerce'
											  )
											: __(
													'Sale (Pro)',
													'dynamic-product-options-for-woocommerce'
											  )
									}
									disabled={ ! proActive }
									onChange={ ( v ) =>
										setChoice( idx, {
											sale: v,
										} )
									}
								/>
							</div>

							{ isColor && (
								<ColorField
									value={ choice.color }
									onChange={ ( v ) =>
										setChoice( idx, {
											color: v,
										} )
									}
								/>
							) }
							{ isImage && (
								<MediaPicker
									value={ choice.image }
									onChange={ ( m ) =>
										setChoice( idx, {
											image: m
												? m.url
												: '',
											imageId: m
												? m.id
												: 0,
										} )
									}
								/>
							) }
							{ isFont && (
								<TextControl
									value={ choice.fontFamily }
									placeholder={ __(
										'CSS font-family',
										'dynamic-product-options-for-woocommerce'
									) }
									onChange={ ( v ) =>
										setChoice( idx, {
											fontFamily: v,
										} )
									}
								/>
							) }

							<label className="dpo-choice-row__selected">
								<input
									type="checkbox"
									checked={ !! choice.selected }
									onChange={ ( e ) =>
										setChoice( idx, {
											selected:
												e.target.checked,
										} )
									}
								/>
								{ __(
									'Selected by default',
									'dynamic-product-options-for-woocommerce'
								) }
							</label>
						</div>
					);
				} }
			/>
		</div>
	);
}
