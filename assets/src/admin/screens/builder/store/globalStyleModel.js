/**
 * Global Style model — the friendly token shape edited by the Global Style
 * panel and the pure helpers that compile it.
 *
 * The model is deliberately small (Size, Shape, a colour palette and six named
 * colours). Two compilers turn it into:
 *   - `compileCss()`  → the scoped `.dpo-options{…}` rule saved to the DB and
 *                        printed on the storefront (variables from store.scss).
 *   - `cssVars()`     → a `--dpo-gs-*` style object applied to the builder
 *                        canvas so edits preview live without a save.
 *
 * Legacy saved styles (the previous granular token set) are upgraded by
 * `normalize()` so existing installs keep their look.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';

/** Default token set (Medium / Rounded / Classic palette). */
export const DEFAULTS = {
	size: 'medium',
	shape: 'rounded',
	palette: 'classic',
	colors: {
		text: '#1e1e1e',
		primary: '#2563eb',
		border: '#d4d4d8',
		fill: '#ffffff',
		onPrimary: '#ffffff',
		error: '#df1c41',
	},
};

/** Field-size presets → concrete metrics. */
export const SIZE_MAP = {
	small: { controlH: 38, fontSize: 13, gap: 14, swatch: 30 },
	medium: { controlH: 44, fontSize: 15, gap: 20, swatch: 36 },
	large: { controlH: 52, fontSize: 17, gap: 26, swatch: 44 },
};

/** Field-shape presets → radii. */
export const SHAPE_MAP = {
	sharp: { radius: '0px', pill: '4px', swatchRadius: '4px' },
	rounded: { radius: '10px', pill: '999px', swatchRadius: '50%' },
};

/** Size segmented options. */
export const SIZE_OPTIONS = [
	{ value: 'small', label: __( 'Small', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'medium', label: __( 'Medium', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'large', label: __( 'Large', 'dynamic-product-options-for-woocommerce' ) },
];

/** Shape segmented options. */
export const SHAPE_OPTIONS = [
	{ value: 'sharp', label: __( 'Sharp', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'rounded', label: __( 'Rounded', 'dynamic-product-options-for-woocommerce' ) },
];

/**
 * Colour palette presets. `ramp` is the 4-chip preview shown on the tile;
 * `colors` is applied to the model when the preset is chosen.
 */
export const PALETTES = [
	{
		key: 'classic',
		label: __( 'Classic', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#1e1e1e', '#3a3a3a', '#9a9a9a', '#ffffff' ],
		colors: { text: '#1e1e1e', primary: '#1e1e1e', border: '#d4d4d8', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'blue',
		label: __( 'Blue', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#0b1f4d', '#2563eb', '#7d9bd6', '#ffffff' ],
		colors: { text: '#0b1f4d', primary: '#2563eb', border: '#c7d6f0', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'purple',
		label: __( 'Purple', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#1c004f', '#7126ff', '#a99bd6', '#ffffff' ],
		colors: { text: '#1c004f', primary: '#7126ff', border: '#d3c9f2', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'pink',
		label: __( 'Pink', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#4a0d2e', '#db2777', '#c79bb0', '#ffffff' ],
		colors: { text: '#4a0d2e', primary: '#db2777', border: '#f2c9dd', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'orange',
		label: __( 'Orange', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#2b1700', '#ea8a1e', '#b3a08a', '#ffffff' ],
		colors: { text: '#2b1700', primary: '#ea8a1e', border: '#f0dcc2', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'green',
		label: __( 'Green', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#0d2b1a', '#16a34a', '#8aa897', '#ffffff' ],
		colors: { text: '#0d2b1a', primary: '#16a34a', border: '#c2e7d1', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'teal',
		label: __( 'Teal', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#0a2b2b', '#0d9488', '#8aa8a5', '#ffffff' ],
		colors: { text: '#0a2b2b', primary: '#0d9488', border: '#c2e5e2', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
	{
		key: 'lime',
		label: __( 'Lime', 'dynamic-product-options-for-woocommerce' ),
		ramp: [ '#1a2b00', '#84cc16', '#a3b08a', '#ffffff' ],
		colors: { text: '#1a2b00', primary: '#65a30d', border: '#dcedc2', fill: '#ffffff', onPrimary: '#ffffff', error: '#df1c41' },
	},
];

/**
 * Convert a `#rrggbb` hex to an `rgba()` string at the given alpha. Falls back
 * to the original string when it isn't a 6-digit hex.
 *
 * @param {string} hex   Hex colour.
 * @param {number} alpha Alpha 0–1.
 * @return {string} rgba() string.
 */
export function hexAlpha( hex, alpha ) {
	const m = /^#([0-9a-f]{6})$/i.exec( ( hex || '' ).trim() );
	if ( ! m ) {
		return hex || 'transparent';
	}
	const int = parseInt( m[ 1 ], 16 );
	const r = ( int >> 16 ) & 255;
	const g = ( int >> 8 ) & 255;
	const b = int & 255;
	return `rgba(${ r },${ g },${ b },${ alpha })`;
}

/**
 * Coerce any stored value (current or legacy granular model) into the current
 * token shape, so old installs keep their colours/shape.
 *
 * @param {Object} raw Stored `dpo_global_style` value.
 * @return {Object} A complete, current-shape token object.
 */
export function normalize( raw ) {
	const src = raw && typeof raw === 'object' ? raw : {};

	// Already the current model.
	if ( src.colors && typeof src.colors === 'object' ) {
		return {
			...DEFAULTS,
			...src,
			colors: { ...DEFAULTS.colors, ...src.colors },
		};
	}

	// Legacy granular model → map the keys we can.
	const colors = { ...DEFAULTS.colors };
	if ( src.accentColor ) {
		colors.primary = src.accentColor;
	}
	if ( src.textColor ) {
		colors.text = src.textColor;
	}
	if ( src.labelColor ) {
		colors.text = src.labelColor;
	}
	if ( src.borderColor ) {
		colors.border = src.borderColor;
	}
	const radiusNum = parseFloat( src.radius );
	const shape =
		src.swatchShape === 'circle' || ( ! Number.isNaN( radiusNum ) && radiusNum >= 6 )
			? 'rounded'
			: 'sharp';

	return { ...DEFAULTS, shape, colors };
}

/**
 * Resolve the concrete size + shape metric bundles for a token set.
 *
 * @param {Object} tokens Token set.
 * @return {{size:Object, shape:Object, colors:Object}} Resolved bundles.
 */
function resolve( tokens ) {
	return {
		size: SIZE_MAP[ tokens.size ] || SIZE_MAP.medium,
		shape: SHAPE_MAP[ tokens.shape ] || SHAPE_MAP.rounded,
		colors: { ...DEFAULTS.colors, ...( tokens.colors || {} ) },
	};
}

/**
 * Compile tokens into the scoped storefront CSS rule (mirrors the variable
 * contract in `assets/src/scss/store.scss`).
 *
 * @param {Object} tokens Token set.
 * @return {string} CSS text.
 */
export function compileCss( tokens ) {
	const { size, shape, colors } = resolve( tokens );
	return [
		'.dpo-options{',
		`--dpo-label:${ colors.text };`,
		`--dpo-text:${ colors.text };`,
		`--dpo-accent:${ colors.primary };`,
		`--dpo-accent-contrast:${ colors.onPrimary };`,
		`--dpo-accent-soft:${ hexAlpha( colors.primary, 0.1 ) };`,
		`--dpo-border:${ colors.border };`,
		`--dpo-border-strong:${ colors.border };`,
		`--dpo-surface:${ colors.fill };`,
		`--dpo-required:${ colors.error };`,
		`--dpo-radius:${ shape.radius };`,
		`--dpo-radius-pill:${ shape.pill };`,
		`--dpo-swatch-radius:${ shape.swatchRadius };`,
		`--dpo-font-size:${ size.fontSize }px;`,
		`--dpo-space:${ size.gap }px;`,
		`--dpo-control-h:${ size.controlH }px;`,
		`--dpo-swatch:${ size.swatch }px;`,
		'}',
	].join( '' );
}

/**
 * Build the `--dpo-gs-*` custom-property bag applied to the builder canvas for
 * live preview. The canvas SCSS reads each with a fallback to its admin token,
 * so these only take effect inside the stage.
 *
 * @param {Object} tokens Token set.
 * @return {Object} React inline-style object.
 */
export function cssVars( tokens ) {
	const { size, shape, colors } = resolve( tokens );
	return {
		'--dpo-gs-text': colors.text,
		'--dpo-gs-primary': colors.primary,
		'--dpo-gs-on-primary': colors.onPrimary,
		'--dpo-gs-soft': hexAlpha( colors.primary, 0.1 ),
		'--dpo-gs-border': colors.border,
		'--dpo-gs-fill': colors.fill,
		'--dpo-gs-error': colors.error,
		'--dpo-gs-radius': shape.radius,
		'--dpo-gs-swatch-radius': shape.swatchRadius,
		'--dpo-gs-control-h': `${ size.controlH }px`,
		'--dpo-gs-font-size': `${ size.fontSize }px`,
		'--dpo-gs-gap': `${ size.gap }px`,
		'--dpo-gs-swatch': `${ size.swatch }px`,
	};
}
