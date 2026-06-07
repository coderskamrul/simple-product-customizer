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
 * @package
 */

import { wireDate } from './date';
import { wireTime } from './time';
import { wirePhone } from './phone';

/**
 * Wire a custom `.pkitfw-select` / `.pkitfw-fontpicker` dropdown.
 *
 * @param {HTMLElement} fieldEl  Field wrapper.
 * @param {Function}    onChange Change callback.
 * @return {void}
 */
function wireSelect( fieldEl, onChange ) {
	const box = fieldEl.querySelector( '.pkitfw-select' );
	if ( ! box ) {
		return;
	}
	const toggle = box.querySelector( '.pkitfw-select__toggle' );
	const list = box.querySelector( '.pkitfw-select__list' );
	const hidden = box.querySelector( '.pkitfw-select__value' );
	if ( ! toggle || ! list || ! hidden ) {
		return;
	}
	const placeholder = box.querySelector( '.pkitfw-select__placeholder' );
	const placeholderText = placeholder ? placeholder.textContent : '';

	const close = () => box.classList.remove( 'pkitfw-select--open' );

	toggle.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		box.classList.toggle( 'pkitfw-select--open' );
	} );

	list.querySelectorAll( '.pkitfw-select__opt' ).forEach( ( opt ) => {
		opt.addEventListener( 'click', () => {
			const idx = opt.getAttribute( 'data-index' );
			const label = opt.getAttribute( 'data-label' ) || '';
			hidden.value = idx;
			if ( placeholder ) {
				placeholder.textContent = label || placeholderText;
				// Font Picker: reflect the chosen font in the closed control.
				const font = opt.getAttribute( 'data-font' );
				if ( font !== null ) {
					placeholder.style.fontFamily = font || '';
				}
			}
			list.querySelectorAll( '.pkitfw-select__opt--active' ).forEach(
				( o ) => o.classList.remove( 'pkitfw-select__opt--active' )
			);
			opt.classList.add( 'pkitfw-select__opt--active' );
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
	const box = fieldEl.querySelector( '.pkitfw-colorpicker' );
	if ( ! box ) {
		return;
	}
	const input = box.querySelector( '.pkitfw-colorpicker__input' );
	if ( ! input ) {
		return;
	}
	const hex = box.querySelector( '.pkitfw-colorpicker__hex' );
	const reset = box.querySelector( '.pkitfw-colorpicker__reset' );

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
			const def = input.getAttribute( 'data-default' ) || '#000000';
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
	const slider = fieldEl.querySelector( '.pkitfw-range__slider' );
	if ( ! slider ) {
		return;
	}
	const mirror = fieldEl.querySelector( '.pkitfw-range__mirror' );
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
	const input = fieldEl.querySelector( '.pkitfw-toggle__input' );
	const text = fieldEl.querySelector( '.pkitfw-toggle__text' );
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
	const trigger = fieldEl.querySelector( '.pkitfw-popup__trigger' );
	const modal = fieldEl.querySelector( '.pkitfw-popup__modal' );
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
 * Wire the Linked Products field. The variation dropdown and quantity stepper
 * live inside the selectable card <label>; their clicks must not toggle the
 * native checkbox/radio. Changing either still bubbles a change event up to the
 * controller (which recomputes linked products + totals).
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @return {void}
 */
function wireLinked( fieldEl ) {
	fieldEl
		.querySelectorAll( '.pkitfw-linked__varsel, .pkitfw-linked__qty' )
		.forEach( ( el ) => {
			el.addEventListener( 'click', ( e ) => e.stopPropagation() );
		} );
}

/**
 * Wire an accordion Section — clicking the header collapses/expands the body
 * and keeps aria-expanded in sync. Plain (non-accordion) sections have no
 * header button and are left untouched.
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @return {void}
 */
function wireSection( fieldEl ) {
	const section = fieldEl.querySelector( '.pkitfw-section--accordion' );
	if ( ! section ) {
		return;
	}
	const header = section.querySelector( '.pkitfw-section__header' );
	if ( ! header ) {
		return;
	}
	header.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		const collapsed = section.classList.toggle( 'is-collapsed' );
		header.setAttribute( 'aria-expanded', collapsed ? 'false' : 'true' );
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
		'.pkitfw-swatches--image[data-update-image="yes"]'
	);
	if ( ! wrap ) {
		return;
	}
	wrap.querySelectorAll( '.pkitfw-swatch-item__native' ).forEach( ( input ) => {
		input.addEventListener( 'change', () => {
			const img = fieldEl
				.querySelector( 'input.pkitfw-swatch-item__native:checked' )
				?.closest( '.pkitfw-swatch-item' )
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
		} else if ( type === 'linkedproducts' ) {
			wireLinked( fieldEl );
		} else if ( type === 'section' ) {
			wireSection( fieldEl );
		} else if ( type === 'date' ) {
			wireDate( fieldEl, onChange );
		} else if ( type === 'time' ) {
			wireTime( fieldEl, onChange );
		} else if ( type === 'tel' ) {
			wirePhone( fieldEl, onChange );
		} else if ( type === 'datetime' ) {
			// Combined field reuses both pickers (date control + time control).
			wireDate( fieldEl, onChange );
			wireTime( fieldEl, onChange );
		}
	} catch ( e ) {
		/* a broken widget must never wedge the page. */
	}
}
