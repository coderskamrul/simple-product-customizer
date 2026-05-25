/**
 * Custom-control interaction wiring.
 *
 * The PHP renders styled markup for a few controls that need JS behaviour
 * (custom select / fontpicker dropdown, color picker hex mirror + reset,
 * range slider ↔ number mirror, popup modal, image-swatch product-image
 * swap). This module attaches that behaviour and calls `onChange` whenever
 * a value the pricing/selection layer cares about changes.
 *
 * No business logic lives here — collection + pricing read the resulting DOM
 * state through collect.js / pricing.js.
 *
 * @package DPO\Store
 */

import { wireDate } from './date';

/**
 * Wire a custom `.dpo-select` / `.dpo-fontpicker` dropdown.
 *
 * @param {HTMLElement} fieldEl  Field wrapper.
 * @param {Function}    onChange Change callback.
 * @return {void}
 */
function wireSelect( fieldEl, onChange ) {
	const box = fieldEl.querySelector( '.dpo-select' );
	if ( ! box ) {
		return;
	}
	const toggle = box.querySelector( '.dpo-select__toggle' );
	const list = box.querySelector( '.dpo-select__list' );
	const hidden = box.querySelector( '.dpo-select__value' );
	const placeholder = box.querySelector( '.dpo-select__placeholder' );
	if ( ! toggle || ! list || ! hidden ) {
		return;
	}
	const placeholderText = placeholder ? placeholder.textContent : '';

	const close = () => box.classList.remove( 'dpo-select--open' );

	toggle.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		box.classList.toggle( 'dpo-select--open' );
	} );

	list.querySelectorAll( '.dpo-select__opt' ).forEach( ( opt ) => {
		opt.addEventListener( 'click', () => {
			const idx = opt.getAttribute( 'data-index' );
			const label = opt.getAttribute( 'data-label' ) || '';
			hidden.value = idx;
			if ( placeholder ) {
				placeholder.textContent = label || placeholderText;
			}
			list
				.querySelectorAll( '.dpo-select__opt--active' )
				.forEach( ( o ) =>
					o.classList.remove( 'dpo-select__opt--active' )
				);
			opt.classList.add( 'dpo-select__opt--active' );
			close();
			onChange();
		} );
	} );

	document.addEventListener( 'click', ( e ) => {
		if ( ! box.contains( e.target ) ) {
			close();
		}
	} );
}

/**
 * Wire the color picker hex mirror + reset.
 *
 * @param {HTMLElement} fieldEl  Field wrapper.
 * @param {Function}    onChange Change callback.
 * @return {void}
 */
function wireColorPicker( fieldEl, onChange ) {
	const box = fieldEl.querySelector( '.dpo-colorpicker' );
	if ( ! box ) {
		return;
	}
	const input = box.querySelector( '.dpo-colorpicker__input' );
	const hex = box.querySelector( '.dpo-colorpicker__hex' );
	const reset = box.querySelector( '.dpo-colorpicker__reset' );
	if ( ! input ) {
		return;
	}

	input.addEventListener( 'input', () => {
		if ( hex ) {
			hex.value = input.value;
		}
		onChange();
	} );
	if ( hex ) {
		hex.addEventListener( 'input', () => {
			if ( /^#[0-9a-fA-F]{6}$/.test( hex.value ) ) {
				input.value = hex.value;
				onChange();
			}
		} );
	}
	if ( reset ) {
		reset.addEventListener( 'click', () => {
			const def =
				input.getAttribute( 'data-default' ) || '#000000';
			input.value = def;
			if ( hex ) {
				hex.value = def;
			}
			onChange();
		} );
	}
}

/**
 * Wire the range slider ↔ number mirror + readout postfix.
 *
 * @param {HTMLElement} fieldEl  Field wrapper.
 * @param {Function}    onChange Change callback.
 * @return {void}
 */
function wireRange( fieldEl, onChange ) {
	const slider = fieldEl.querySelector( '.dpo-range__slider' );
	const mirror = fieldEl.querySelector( '.dpo-range__mirror' );
	if ( ! slider ) {
		return;
	}
	slider.addEventListener( 'input', () => {
		if ( mirror ) {
			mirror.value = slider.value;
		}
		onChange();
	} );
	if ( mirror ) {
		mirror.addEventListener( 'input', () => {
			slider.value = mirror.value;
			onChange();
		} );
	}
}

/**
 * Wire toggle on/off text labels.
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @return {void}
 */
function wireToggle( fieldEl ) {
	const input = fieldEl.querySelector( '.dpo-toggle__input' );
	const text = fieldEl.querySelector( '.dpo-toggle__text' );
	if ( ! input || ! text ) {
		return;
	}
	const paint = () => {
		text.textContent = input.checked
			? text.getAttribute( 'data-on' ) || ''
			: text.getAttribute( 'data-off' ) || '';
	};
	input.addEventListener( 'change', paint );
	paint();
}

/**
 * Wire a popup-trigger field's modal open/close.
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @return {void}
 */
function wirePopup( fieldEl ) {
	const trigger = fieldEl.querySelector( '.dpo-popup__trigger' );
	const modal = fieldEl.querySelector( '.dpo-popup__modal' );
	if ( ! trigger || ! modal ) {
		return;
	}
	const open = () => {
		modal.hidden = false;
	};
	const close = () => {
		modal.hidden = true;
	};
	trigger.addEventListener( 'click', open );
	modal
		.querySelectorAll( '[data-popup-close]' )
		.forEach( ( el ) => el.addEventListener( 'click', close ) );
	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Escape' && ! modal.hidden ) {
			close();
		}
	} );
}

/**
 * Wire the image-swatch product-image swap when enabled.
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @return {void}
 */
function wireImageSwatchSwap( fieldEl ) {
	const wrap = fieldEl.querySelector(
		'.dpo-swatches--image[data-update-image="yes"]'
	);
	if ( ! wrap ) {
		return;
	}
	wrap
		.querySelectorAll( '.dpo-swatch-item__native' )
		.forEach( ( input ) => {
			input.addEventListener( 'change', () => {
				const img = fieldEl
					.querySelector(
						'input.dpo-swatch-item__native:checked'
					)
					?.closest( '.dpo-swatch-item' )
					?.querySelector( 'img' );
				const gallery = document.querySelector(
					'.woocommerce-product-gallery__image img, .wp-post-image'
				);
				if ( img && gallery && img.src ) {
					gallery.src = img.src;
					if ( gallery.srcset ) {
						gallery.srcset = img.src;
					}
				}
			} );
		} );
}

/**
 * Attach all custom-control behaviours for one field.
 *
 * @param {HTMLElement} fieldEl  Field wrapper.
 * @param {Function}    onChange Change callback.
 * @return {void}
 */
export function initWidgets( fieldEl, onChange ) {
	const type = fieldEl.getAttribute( 'data-type' ) || '';
	try {
		if ( type === 'select' || type === 'fontpicker' ) {
			wireSelect( fieldEl, onChange );
		} else if ( type === 'colorpicker' ) {
			wireColorPicker( fieldEl, onChange );
		} else if ( type === 'range' ) {
			wireRange( fieldEl, onChange );
		} else if ( type === 'toggle' ) {
			wireToggle( fieldEl );
		} else if ( type === 'popup' ) {
			wirePopup( fieldEl );
		} else if ( type === 'imageswatch' ) {
			wireImageSwatchSwap( fieldEl );
		} else if ( type === 'date' ) {
			wireDate( fieldEl, onChange );
		}
	} catch ( e ) {
		/* a broken widget must never wedge the page. */
	}
}
