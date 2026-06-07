/**
 * Field type registry — single source of truth for the 30 option types
 * (ARCHITECTURE §7). Each entry drives the palette, the canvas node, and
 * the inspector's Advanced tab.
 *
 * Shape per entry:
 *   slug            runtime type (=== JS type === server FieldRegistry key)
 *   label           translated palette label
 *   category        Input | Choice | Advanced | Layout | Special
 *   icon            dashicon slug (rendered as <span class="dashicons">)
 *   priceable       whether choices/value can carry a price
 *   hasChoices      whether the Choices inspector tab applies
 *   proOnly         Pro-gated type (renders disabled when !proActive)
 *   defaultNode()   factory returning a §6 node skeleton (sans id/parent)
 *   inspectorSchema array of Advanced-tab config field descriptors
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/** Generate a short, collision-resistant base36 id fragment. */
let counter = 0;

/**
 * Create a unique field id (`f_<base36>`), matching the §6 id convention.
 *
 * @return {string} A new field id.
 */
export function newFieldId() {
	counter += 1;
	return (
		'f_' +
		Date.now().toString( 36 ) +
		counter.toString( 36 ) +
		Math.random().toString( 36 ).slice( 2, 5 )
	);
}

/**
 * Create a unique choice uid.
 *
 * @return {string} A new choice uid.
 */
export function newChoiceUid() {
	return 'c_' + Math.random().toString( 36 ).slice( 2, 9 );
}

/**
 * Build a fresh choice row (ARCHITECTURE §6 choice shape).
 *
 * @param {Object} overrides Optional field overrides.
 * @return {Object} A choice object.
 */
export function makeChoice( overrides = {} ) {
	return {
		label: '',
		priceMode: 'none',
		regular: '',
		sale: '',
		selected: false,
		uid: newChoiceUid(),
		image: '',
		imageId: 0,
		color: '',
		fontFamily: '',
		formulaValue: '',
		...overrides,
	};
}

/**
 * Shared base node (every field carries these §6 keys).
 *
 * @param {string} type The field type slug.
 * @return {Object} A base node skeleton.
 */
function baseNode( type ) {
	return {
		type,
		parent: '',
		label: '',
		description: '',
		descriptionPlacement: 'below_label',
		placeholder: '',
		hideLabel: false,
		required: false,
		width: 'full',
		cssClass: '',
		pricePlacement: 'with_label',
		logicEnabled: false,
		logic: { action: 'show', match: 'all', rules: [] },
		defaults: [],
		choices: [],
		config: {},
		children: [],
	};
}

/**
 * Convenience: a node with N starter choices.
 * @param type
 * @param n
 * @param extra
 */
const withChoices =
	( type, n = 2, extra = {} ) =>
	() => ( {
		...baseNode( type ),
		choices: Array.from( { length: n }, ( _, i ) =>
			makeChoice( {
				label: `${ __(
					'Option',
					'productkit-for-woocommerce'
				) } ${ i + 1 }`,
			} )
		),
		...extra,
	} );

/**
 * The registry keyed by slug. Order within a category defines palette order.
 *
 * @type {Object<string,Object>}
 */
export const FIELD_TYPES = {
	/* ---- Input ---- */
	text: {
		slug: 'text',
		label: __( 'Text', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'editor-textcolor',
		priceable: true,
		// choices[0] carries the single-value price (per_char/per_word/flat).
		defaultNode: () => ( {
			...baseNode( 'text' ),
			choices: [ makeChoice() ],
		} ),
		inspectorSchema: [
			{
				key: 'minLength',
				label: __(
					'Min length',
					'productkit-for-woocommerce'
				),
				control: 'number',
			},
			{
				key: 'maxLength',
				label: __(
					'Max length',
					'productkit-for-woocommerce'
				),
				control: 'number',
			},
		],
	},
	textarea: {
		slug: 'textarea',
		label: __( 'Textarea', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'editor-paragraph',
		priceable: true,
		// choices[0] carries the single-value price (per_char/per_word/flat).
		defaultNode: () => ( {
			...baseNode( 'textarea' ),
			choices: [ makeChoice() ],
		} ),
		inspectorSchema: [
			{
				key: 'rows',
				label: __( 'Rows', 'productkit-for-woocommerce' ),
				control: 'number',
			},
			{
				key: 'maxLength',
				label: __(
					'Max length',
					'productkit-for-woocommerce'
				),
				control: 'number',
			},
		],
	},
	email: {
		slug: 'email',
		label: __( 'Email', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'email',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'email' ),
			choices: [ makeChoice() ],
		} ),
		inspectorSchema: [],
	},
	url: {
		slug: 'url',
		label: __( 'URL', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'admin-links',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'url' ),
			choices: [ makeChoice() ],
		} ),
		inspectorSchema: [],
	},
	tel: {
		slug: 'tel',
		label: __( 'Phone', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'phone',
		priceable: true,
		// flagStyle: 'number' | 'flag' | 'flag_dial'. defaultCountry is an ISO-2
		// code ('' = resolve to the store base country at render time).
		defaultNode: () => ( {
			...baseNode( 'tel' ),
			choices: [ makeChoice() ],
			config: { flagStyle: 'flag_dial', defaultCountry: '' },
		} ),
		// Settings UI is the bespoke TelConfig panel (see GeneralTab).
		inspectorSchema: [],
	},
	number: {
		slug: 'number',
		label: __( 'Number', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'calculator',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'number' ),
			choices: [ makeChoice() ],
			config: { step: 1 },
		} ),
		inspectorSchema: [],
	},
	date: {
		slug: 'date',
		label: __( 'Date', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'calendar-alt',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'date' ),
			choices: [ makeChoice() ],
			config: {
				format: 'd/m/Y',
				minMode: 'none',
				minDate: '',
				maxMode: 'none',
				maxDate: '',
				disableToday: false,
				disableDates: [],
				disableWeekdays: [],
				disableMonthlyDays: [],
			},
		} ),
		// Settings UI is the bespoke DateConfig panel (see GeneralTab).
		inspectorSchema: [],
	},
	time: {
		slug: 'time',
		label: __( 'Time', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'clock',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'time' ),
			choices: [ makeChoice() ],
			config: {
				hour12: true,
				minTime: '',
				maxTime: '',
				step: 5,
			},
		} ),
		// Settings UI is the bespoke TimeConfig panel (see GeneralTab).
		inspectorSchema: [],
	},
	datetime: {
		slug: 'datetime',
		label: __( 'Date & Time', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'calendar',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'datetime' ),
			choices: [ makeChoice() ],
			config: {
				// Date side (shared keys with the Date field).
				format: 'd/m/Y',
				minMode: 'none',
				minDate: '',
				maxMode: 'none',
				maxDate: '',
				disableToday: false,
				disableDates: [],
				disableWeekdays: [],
				disableMonthlyDays: [],
				// Time side (shared keys with the Time field).
				hour12: true,
				minTime: '',
				maxTime: '',
				step: 5,
			},
		} ),
		// Settings UI is the bespoke DatetimeConfig panel (see GeneralTab).
		inspectorSchema: [],
	},
	fileupload: {
		slug: 'fileupload',
		label: __( 'File Upload', 'productkit-for-woocommerce' ),
		category: 'Input',
		icon: 'upload',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'fileupload' ),
			choices: [ makeChoice() ],
			config: {
				uploadText: __(
					'Upload',
					'productkit-for-woocommerce'
				),
				dragText: __(
					'Click or drag and drop',
					'productkit-for-woocommerce'
				),
				maxSize: 2,
				sizeError: __(
					'File is too large',
					'productkit-for-woocommerce'
				),
				sizePrefix: __(
					'Max File Size: [max_size]',
					'productkit-for-woocommerce'
				),
				minNumber: 0,
				maxNumber: 3,
				countError: __(
					'Too many files',
					'productkit-for-woocommerce'
				),
				countPrefix: __(
					'Maximum Number of Files: [max_files]',
					'productkit-for-woocommerce'
				),
				typePrefix: __(
					'Allowed Types are: [allowed_types]',
					'productkit-for-woocommerce'
				),
				allowedTypes: [ 'png', 'jpg' ],
			},
		} ),
		inspectorSchema: [],
	},

	/* ---- Choice ---- */
	checkbox: {
		slug: 'checkbox',
		label: __( 'Checkboxes', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'yes',
		priceable: true,
		hasChoices: true,
		defaultNode: withChoices( 'checkbox' ),
		inspectorSchema: [],
	},
	radio: {
		slug: 'radio',
		label: __( 'Radio Buttons', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'marker',
		priceable: true,
		hasChoices: true,
		defaultNode: withChoices( 'radio' ),
		inspectorSchema: [],
	},
	select: {
		slug: 'select',
		label: __( 'Dropdown', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'arrow-down-alt2',
		priceable: true,
		hasChoices: true,
		defaultNode: withChoices( 'select' ),
		inspectorSchema: [
			{
				key: 'multiple',
				label: __(
					'Allow multiple',
					'productkit-for-woocommerce'
				),
				control: 'toggle',
			},
		],
	},
	toggle: {
		slug: 'toggle',
		label: __( 'Toggle', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'controls-play',
		priceable: true,
		hasChoices: true,
		defaultNode: withChoices( 'toggle', 1, {} ),
		inspectorSchema: [],
	},
	buttongroup: {
		slug: 'buttongroup',
		label: __( 'Button Group', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'grid-view',
		priceable: true,
		hasChoices: true,
		defaultNode: withChoices( 'buttongroup' ),
		inspectorSchema: [
			{
				key: 'multiple',
				label: __(
					'Allow multiple',
					'productkit-for-woocommerce'
				),
				control: 'toggle',
			},
		],
	},
	colorswatch: {
		slug: 'colorswatch',
		label: __( 'Color Swatch', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'art',
		priceable: true,
		hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'colorswatch' ),
			choices: [
				makeChoice( {
					label: __(
						'Black',
						'productkit-for-woocommerce'
					),
					color: '#000000',
				} ),
				makeChoice( {
					label: __(
						'White',
						'productkit-for-woocommerce'
					),
					color: '#ffffff',
				} ),
			],
		} ),
		inspectorSchema: [
			{
				key: 'shape',
				label: __(
					'Swatch shape',
					'productkit-for-woocommerce'
				),
				control: 'select',
				options: [ 'circle', 'square', 'rounded' ],
			},
		],
	},
	imageswatch: {
		slug: 'imageswatch',
		label: __( 'Image Swatch', 'productkit-for-woocommerce' ),
		category: 'Choice',
		icon: 'format-image',
		priceable: true,
		hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'imageswatch' ),
			choices: [ makeChoice(), makeChoice() ],
		} ),
		inspectorSchema: [
			{
				key: 'shape',
				label: __(
					'Swatch shape',
					'productkit-for-woocommerce'
				),
				control: 'select',
				options: [ 'circle', 'square', 'rounded' ],
			},
		],
	},

	/* ---- Advanced ---- */
	range: {
		slug: 'range',
		label: __( 'Range Slider', 'productkit-for-woocommerce' ),
		category: 'Advanced',
		icon: 'leftright',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'range' ),
			choices: [ makeChoice() ],
			config: { min: 1, max: 100, step: 1, value: 10 },
		} ),
		inspectorSchema: [],
	},
	colorpicker: {
		slug: 'colorpicker',
		label: __( 'Color Picker', 'productkit-for-woocommerce' ),
		category: 'Advanced',
		icon: 'admin-customizer',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'colorpicker' ),
			choices: [ makeChoice() ],
			config: { defaultColor: '#000000' },
		} ),
		inspectorSchema: [],
	},
	fontpicker: {
		slug: 'fontpicker',
		label: __( 'Font Picker', 'productkit-for-woocommerce' ),
		category: 'Advanced',
		icon: 'editor-textcolor',
		priceable: true,
		proOnly: true,
		hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'fontpicker' ),
			choices: [
				makeChoice( {
					label: 'Arial',
					fontFamily: 'Arial, sans-serif',
				} ),
			],
		} ),
		inspectorSchema: [],
	},
	formula: {
		slug: 'formula',
		label: __( 'Formula', 'productkit-for-woocommerce' ),
		category: 'Advanced',
		icon: 'calculator',
		priceable: true,
		defaultNode: () => ( {
			...baseNode( 'formula' ),
			config: { formula: '' },
		} ),
		inspectorSchema: [
			{
				key: 'formula',
				label: __(
					'Formula',
					'productkit-for-woocommerce'
				),
				control: 'formula',
			},
		],
	},
	advancedformula: {
		slug: 'advancedformula',
		label: __(
			'Advanced Formula',
			'productkit-for-woocommerce'
		),
		category: 'Advanced',
		icon: 'superhero',
		priceable: true,
		proOnly: true,
		defaultNode: () => ( {
			...baseNode( 'advancedformula' ),
			config: { formula: '' },
		} ),
		inspectorSchema: [
			{
				key: 'formula',
				label: __(
					'Expression',
					'productkit-for-woocommerce'
				),
				control: 'formula',
			},
		],
	},
	linkedproducts: {
		slug: 'linkedproducts',
		label: __(
			'Linked Products',
			'productkit-for-woocommerce'
		),
		category: 'Advanced',
		icon: 'cart',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'linkedproducts' ),
			config: {
				products: [],
				display: 'cards',
				multiple: false,
				mergeVariations: false,
				enableQty: false,
				minQty: 1,
				maxQty: '',
				// Presentation, shared with the Image Swatch field (StylesTab).
				shape: 'rounded',
				swatchWidth: '',
				swatchHeight: '',
				swatchRadius: '',
			},
		} ),
		// Settings UI is the bespoke LinkedProductsConfig panel (see GeneralTab).
		inspectorSchema: [],
	},

	/* ---- Layout ---- */
	heading: {
		slug: 'heading',
		label: __( 'Heading', 'productkit-for-woocommerce' ),
		category: 'Layout',
		icon: 'heading',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'heading' ),
			config: { level: 'h3' },
		} ),
		inspectorSchema: [
			{
				key: 'level',
				label: __(
					'Heading level',
					'productkit-for-woocommerce'
				),
				control: 'select',
				options: [ 'h2', 'h3', 'h4', 'h5' ],
			},
		],
	},
	html: {
		slug: 'html',
		label: __( 'HTML', 'productkit-for-woocommerce' ),
		category: 'Layout',
		icon: 'editor-code',
		priceable: false,
		defaultNode: () => ( { ...baseNode( 'html' ), config: { html: '' } } ),
		inspectorSchema: [
			{
				key: 'html',
				label: __(
					'HTML content',
					'productkit-for-woocommerce'
				),
				control: 'textarea',
			},
		],
	},
	divider: {
		slug: 'divider',
		label: __( 'Divider', 'productkit-for-woocommerce' ),
		category: 'Layout',
		icon: 'minus',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'divider' ),
			config: { height: 1 },
		} ),
		inspectorSchema: [
			{
				key: 'height',
				label: __(
					'Height (px)',
					'productkit-for-woocommerce'
				),
				control: 'number',
			},
		],
	},
	spacer: {
		slug: 'spacer',
		label: __( 'Spacer', 'productkit-for-woocommerce' ),
		category: 'Layout',
		icon: 'image-flip-vertical',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'spacer' ),
			config: { height: 24 },
		} ),
		inspectorSchema: [
			{
				key: 'height',
				label: __(
					'Height (px)',
					'productkit-for-woocommerce'
				),
				control: 'number',
			},
		],
	},
	section: {
		slug: 'section',
		label: __( 'Section', 'productkit-for-woocommerce' ),
		category: 'Layout',
		icon: 'screenoptions',
		priceable: false,
		container: true,
		defaultNode: () => ( {
			...baseNode( 'section' ),
			// style: 'section' (plain group) | 'accordion' (collapsible).
			// initialState: 'open' | 'close' (accordion only).
			config: { style: 'section', initialState: 'open' },
			children: [],
		} ),
		// Settings UI is the bespoke SectionConfig panel (see GeneralTab).
		inspectorSchema: [],
	},

	/* ---- Special ---- */
	popup: {
		slug: 'popup',
		label: __( 'Popup', 'productkit-for-woocommerce' ),
		category: 'Special',
		icon: 'external',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'popup' ),
			config: {
				triggerText: __(
					'Open',
					'productkit-for-woocommerce'
				),
				content: '',
			},
		} ),
		// Settings UI is the bespoke PopupConfig panel / Popup Builder modal
		// (see GeneralTab). `config.content` holds the rich HTML.
		inspectorSchema: [],
	},
	shortcode: {
		slug: 'shortcode',
		label: __( 'Shortcode', 'productkit-for-woocommerce' ),
		category: 'Special',
		icon: 'shortcode',
		priceable: false,
		defaultNode: () => ( {
			...baseNode( 'shortcode' ),
			config: { shortcode: '' },
		} ),
		inspectorSchema: [
			{
				key: 'shortcode',
				label: __(
					'Shortcode',
					'productkit-for-woocommerce'
				),
				control: 'text',
			},
		],
	},
};

/** Category display order + labels. */
export const CATEGORIES = [
	{
		key: 'Input',
		label: __( 'Input', 'productkit-for-woocommerce' ),
	},
	{
		key: 'Choice',
		label: __( 'Choice', 'productkit-for-woocommerce' ),
	},
	{
		key: 'Advanced',
		label: __( 'Advanced', 'productkit-for-woocommerce' ),
	},
	{
		key: 'Layout',
		label: __( 'Layout', 'productkit-for-woocommerce' ),
	},
	{
		key: 'Special',
		label: __( 'Special', 'productkit-for-woocommerce' ),
	},
];

/** Ordered list of every registry entry. */
export const ALL_TYPES = Object.values( FIELD_TYPES );

/**
 * Look up a registry entry, falling back to a synthetic text entry so an
 * unknown server type still renders rather than crashing the builder.
 *
 * @param {string} slug Field type slug.
 * @return {Object} Registry entry.
 */
export function getType( slug ) {
	return FIELD_TYPES[ slug ] || FIELD_TYPES.text;
}

/**
 * Group every type by category in display order.
 *
 * @return {Array<{key:string,label:string,items:Array}>} Grouped types.
 */
export function typesByCategory() {
	return CATEGORIES.map( ( cat ) => ( {
		...cat,
		items: ALL_TYPES.filter( ( t ) => t.category === cat.key ),
	} ) );
}

/** Price mode option list (ARCHITECTURE §7), with Pro flags. */
export const PRICE_MODES = [
	{
		value: 'none',
		label: __( 'No price', 'productkit-for-woocommerce' ),
	},
	{
		value: 'flat',
		label: __( 'Fixed', 'productkit-for-woocommerce' ),
	},
	{
		value: 'percent',
		label: __( 'Percentage', 'productkit-for-woocommerce' ),
		pro: true,
	},
	{
		value: 'per_unit',
		label: __( 'Per Unit', 'productkit-for-woocommerce' ),
		pro: true,
	},
	{
		value: 'per_char',
		label: __( 'Per Character', 'productkit-for-woocommerce' ),
	},
	{
		value: 'per_char_nospace',
		label: __(
			'Per Character (no spaces)',
			'productkit-for-woocommerce'
		),
		pro: true,
	},
	{
		value: 'per_word',
		label: __( 'Per Word', 'productkit-for-woocommerce' ),
		pro: true,
	},
];

/** Field types whose value is freeform text — per-character / per-word make sense here. */
const TEXT_LIKE_TYPES = new Set( [ 'text', 'textarea', 'email', 'url' ] );

/**
 * Resolve which price modes are meaningful for a given field. Rules:
 *  - Always available: none, flat, percent.
 *  - per_char / per_char_nospace / per_word: only for text-like fields
 *    (text, textarea, email, url) — the only fields whose value has a
 *    character/word count to multiply against.
 *  - per_unit: only when the field has "Enable Quantity" turned on
 *    (cfg.enableQty), because the multiplier is the per-choice qty input.
 *
 * @param {Object} node A field node (or partial { type, config }).
 * @return {Array} Filtered PRICE_MODES entries (same shape, same order).
 */
export function allowedPriceModes( node ) {
	const type = node?.type;
	const cfg = ( node && node.config ) || {};
	const allowed = new Set( [ 'none', 'flat', 'percent' ] );
	if ( TEXT_LIKE_TYPES.has( type ) ) {
		allowed.add( 'per_char' );
		allowed.add( 'per_char_nospace' );
		allowed.add( 'per_word' );
	}
	if ( cfg.enableQty ) {
		allowed.add( 'per_unit' );
	}
	return PRICE_MODES.filter( ( m ) => allowed.has( m.value ) );
}

/**
 * Price-mode dropdown options for a field. Filters by field type/config and
 * preserves a saved value that is no longer in the allowed set, so the user
 * never silently loses their stored choice when they toggle Enable Quantity
 * off (or change the field type).
 *
 * @param {Object} node           Field node.
 * @param {string} [currentValue] Currently-saved priceMode (optional).
 * @return {Array} { value, label, pro? } entries ready for SelectControl.
 */
export function priceModeOptionsFor( node, currentValue ) {
	const list = allowedPriceModes( node ).slice();
	if ( currentValue && ! list.some( ( m ) => m.value === currentValue ) ) {
		const orig = PRICE_MODES.find( ( m ) => m.value === currentValue );
		if ( orig ) {
			list.push( orig );
		}
	}
	return list;
}

/** Conditional-logic operator vocabulary (ARCHITECTURE §6). */
export const OPERATORS = [
	{
		value: 'is',
		label: __( 'is', 'productkit-for-woocommerce' ),
	},
	{
		value: 'is_not',
		label: __( 'is not', 'productkit-for-woocommerce' ),
	},
	{
		value: 'empty',
		label: __( 'is empty', 'productkit-for-woocommerce' ),
	},
	{
		value: 'not_empty',
		label: __( 'is not empty', 'productkit-for-woocommerce' ),
	},
	{
		value: 'contains',
		label: __( 'contains', 'productkit-for-woocommerce' ),
	},
	{
		value: 'not_contains',
		label: __(
			'does not contain',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'gt',
		label: __( 'greater than', 'productkit-for-woocommerce' ),
	},
	{
		value: 'lt',
		label: __( 'less than', 'productkit-for-woocommerce' ),
	},
	{
		value: 'gte',
		label: __(
			'greater or equal',
			'productkit-for-woocommerce'
		),
	},
	{
		value: 'lte',
		label: __( 'less or equal', 'productkit-for-woocommerce' ),
	},
	{
		value: 'starts_with',
		label: __( 'starts with', 'productkit-for-woocommerce' ),
	},
	{
		value: 'between',
		label: __( 'between', 'productkit-for-woocommerce' ),
	},
	{
		value: 'checked',
		label: __( 'is checked', 'productkit-for-woocommerce' ),
	},
];

/** Field width options (ARCHITECTURE §6). */
export const WIDTHS = [
	{
		value: 'full',
		label: __( 'Full', 'productkit-for-woocommerce' ),
	},
	{
		value: 'half',
		label: __( '1/2', 'productkit-for-woocommerce' ),
	},
	{
		value: 'third',
		label: __( '1/3', 'productkit-for-woocommerce' ),
	},
	{
		value: 'two-third',
		label: __( '2/3', 'productkit-for-woocommerce' ),
	},
	{
		value: 'quarter',
		label: __( '1/4', 'productkit-for-woocommerce' ),
	},
];
