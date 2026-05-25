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
 * @package DPO\Admin
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
		logic: { match: 'all', rules: [] },
		defaults: [],
		choices: [],
		config: {},
		children: [],
	};
}

/** Convenience: a node with N starter choices. */
const withChoices = ( type, n = 2, extra = {} ) => () => ( {
	...baseNode( type ),
	choices: Array.from( { length: n }, ( _, i ) =>
		makeChoice( { label: `${ __( 'Option', 'dynamic-product-options-for-woocommerce' ) } ${ i + 1 }` } )
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
		slug: 'text', label: __( 'Text', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'editor-textcolor', priceable: true,
		defaultNode: () => baseNode( 'text' ),
		inspectorSchema: [
			{ key: 'minLength', label: __( 'Min length', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
			{ key: 'maxLength', label: __( 'Max length', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
			{ key: 'priceMode', label: __( 'Price mode', 'dynamic-product-options-for-woocommerce' ), control: 'priceMode' },
			{ key: 'price', label: __( 'Price amount', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
		],
	},
	textarea: {
		slug: 'textarea', label: __( 'Textarea', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'editor-paragraph', priceable: true,
		defaultNode: () => baseNode( 'textarea' ),
		inspectorSchema: [
			{ key: 'rows', label: __( 'Rows', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
			{ key: 'maxLength', label: __( 'Max length', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
			{ key: 'priceMode', label: __( 'Price mode', 'dynamic-product-options-for-woocommerce' ), control: 'priceMode' },
			{ key: 'price', label: __( 'Price amount', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
		],
	},
	email: {
		slug: 'email', label: __( 'Email', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'email', priceable: true,
		defaultNode: () => ( { ...baseNode( 'email' ), choices: [ makeChoice() ] } ),
		inspectorSchema: [],
	},
	url: {
		slug: 'url', label: __( 'URL', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'admin-links', priceable: false,
		defaultNode: () => baseNode( 'url' ), inspectorSchema: [],
	},
	tel: {
		slug: 'tel', label: __( 'Phone', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'phone', priceable: false,
		defaultNode: () => baseNode( 'tel' ), inspectorSchema: [],
	},
	number: {
		slug: 'number', label: __( 'Number', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'calculator', priceable: true,
		defaultNode: () => ( {
			...baseNode( 'number' ),
			choices: [ makeChoice() ],
			config: { step: 1 },
		} ),
		inspectorSchema: [],
	},
	date: {
		slug: 'date', label: __( 'Date', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'calendar-alt', priceable: true,
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
		slug: 'time', label: __( 'Time', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'clock', priceable: false,
		defaultNode: () => baseNode( 'time' ), inspectorSchema: [],
	},
	datetime: {
		slug: 'datetime', label: __( 'Date & Time', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'calendar', priceable: false,
		defaultNode: () => baseNode( 'datetime' ), inspectorSchema: [],
	},
	fileupload: {
		slug: 'fileupload', label: __( 'File Upload', 'dynamic-product-options-for-woocommerce' ),
		category: 'Input', icon: 'upload', priceable: true,
		defaultNode: () => ( {
			...baseNode( 'fileupload' ),
			choices: [ makeChoice() ],
			config: {
				uploadText: __( 'Upload', 'dynamic-product-options-for-woocommerce' ),
				dragText: __( 'Click or drag and drop', 'dynamic-product-options-for-woocommerce' ),
				maxSize: 2,
				sizeError: __( 'File is too large', 'dynamic-product-options-for-woocommerce' ),
				sizePrefix: __( 'Max File Size: [max_size]', 'dynamic-product-options-for-woocommerce' ),
				minNumber: 0,
				maxNumber: 3,
				countError: __( 'Too many files', 'dynamic-product-options-for-woocommerce' ),
				countPrefix: __( 'Maximum Number of Files: [max_files]', 'dynamic-product-options-for-woocommerce' ),
				typePrefix: __( 'Allowed Types are: [allowed_types]', 'dynamic-product-options-for-woocommerce' ),
				allowedTypes: [ 'png', 'jpg' ],
			},
		} ),
		inspectorSchema: [],
	},

	/* ---- Choice ---- */
	checkbox: {
		slug: 'checkbox', label: __( 'Checkboxes', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'yes', priceable: true, hasChoices: true,
		defaultNode: withChoices( 'checkbox' ), inspectorSchema: [],
	},
	radio: {
		slug: 'radio', label: __( 'Radio Buttons', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'marker', priceable: true, hasChoices: true,
		defaultNode: withChoices( 'radio' ), inspectorSchema: [],
	},
	select: {
		slug: 'select', label: __( 'Dropdown', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'arrow-down-alt2', priceable: true, hasChoices: true,
		defaultNode: withChoices( 'select' ),
		inspectorSchema: [
			{ key: 'multiple', label: __( 'Allow multiple', 'dynamic-product-options-for-woocommerce' ), control: 'toggle' },
		],
	},
	toggle: {
		slug: 'toggle', label: __( 'Toggle', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'controls-play', priceable: true, hasChoices: true,
		defaultNode: withChoices( 'toggle', 1, {} ), inspectorSchema: [],
	},
	buttongroup: {
		slug: 'buttongroup', label: __( 'Button Group', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'grid-view', priceable: true, hasChoices: true,
		defaultNode: withChoices( 'buttongroup' ),
		inspectorSchema: [
			{ key: 'multiple', label: __( 'Allow multiple', 'dynamic-product-options-for-woocommerce' ), control: 'toggle' },
		],
	},
	colorswatch: {
		slug: 'colorswatch', label: __( 'Color Swatch', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'art', priceable: true, hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'colorswatch' ),
			choices: [
				makeChoice( { label: __( 'Black', 'dynamic-product-options-for-woocommerce' ), color: '#000000' } ),
				makeChoice( { label: __( 'White', 'dynamic-product-options-for-woocommerce' ), color: '#ffffff' } ),
			],
		} ),
		inspectorSchema: [
			{ key: 'shape', label: __( 'Swatch shape', 'dynamic-product-options-for-woocommerce' ), control: 'select',
				options: [ 'circle', 'square', 'rounded' ] },
		],
	},
	imageswatch: {
		slug: 'imageswatch', label: __( 'Image Swatch', 'dynamic-product-options-for-woocommerce' ),
		category: 'Choice', icon: 'format-image', priceable: true, hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'imageswatch' ),
			choices: [ makeChoice(), makeChoice() ],
		} ),
		inspectorSchema: [
			{ key: 'shape', label: __( 'Swatch shape', 'dynamic-product-options-for-woocommerce' ), control: 'select',
				options: [ 'circle', 'square', 'rounded' ] },
		],
	},

	/* ---- Advanced ---- */
	range: {
		slug: 'range', label: __( 'Range Slider', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'leftright', priceable: true,
		defaultNode: () => ( {
			...baseNode( 'range' ),
			choices: [ makeChoice() ],
			config: { min: 1, max: 100, step: 1, value: 10 },
		} ),
		inspectorSchema: [],
	},
	colorpicker: {
		slug: 'colorpicker', label: __( 'Color Picker', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'admin-customizer', priceable: true,
		defaultNode: () => ( {
			...baseNode( 'colorpicker' ),
			choices: [ makeChoice() ],
			config: { defaultColor: '#000000' },
		} ),
		inspectorSchema: [],
	},
	fontpicker: {
		slug: 'fontpicker', label: __( 'Font Picker', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'editor-textcolor', priceable: true,
		proOnly: true, hasChoices: true,
		defaultNode: () => ( {
			...baseNode( 'fontpicker' ),
			choices: [
				makeChoice( { label: 'Arial', fontFamily: 'Arial, sans-serif' } ),
			],
		} ),
		inspectorSchema: [],
	},
	formula: {
		slug: 'formula', label: __( 'Formula', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'calculator', priceable: true,
		defaultNode: () => ( {
			...baseNode( 'formula' ),
			config: { formula: '' },
		} ),
		inspectorSchema: [
			{ key: 'formula', label: __( 'Formula', 'dynamic-product-options-for-woocommerce' ), control: 'formula' },
		],
	},
	advancedformula: {
		slug: 'advancedformula', label: __( 'Advanced Formula', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'superhero', priceable: true, proOnly: true,
		defaultNode: () => ( {
			...baseNode( 'advancedformula' ),
			config: { formula: '' },
		} ),
		inspectorSchema: [
			{ key: 'formula', label: __( 'Expression', 'dynamic-product-options-for-woocommerce' ), control: 'formula' },
		],
	},
	linkedproducts: {
		slug: 'linkedproducts', label: __( 'Linked Products', 'dynamic-product-options-for-woocommerce' ),
		category: 'Advanced', icon: 'cart', priceable: false,
		defaultNode: () => ( {
			...baseNode( 'linkedproducts' ),
			config: { products: [], display: 'checkbox' },
		} ),
		inspectorSchema: [
			{ key: 'display', label: __( 'Display as', 'dynamic-product-options-for-woocommerce' ), control: 'select',
				options: [ 'checkbox', 'radio', 'select', 'cards' ] },
		],
	},

	/* ---- Layout ---- */
	heading: {
		slug: 'heading', label: __( 'Heading', 'dynamic-product-options-for-woocommerce' ),
		category: 'Layout', icon: 'heading', priceable: false,
		defaultNode: () => ( { ...baseNode( 'heading' ), config: { level: 'h3' } } ),
		inspectorSchema: [
			{ key: 'level', label: __( 'Heading level', 'dynamic-product-options-for-woocommerce' ), control: 'select',
				options: [ 'h2', 'h3', 'h4', 'h5' ] },
		],
	},
	html: {
		slug: 'html', label: __( 'HTML', 'dynamic-product-options-for-woocommerce' ),
		category: 'Layout', icon: 'editor-code', priceable: false,
		defaultNode: () => ( { ...baseNode( 'html' ), config: { html: '' } } ),
		inspectorSchema: [
			{ key: 'html', label: __( 'HTML content', 'dynamic-product-options-for-woocommerce' ), control: 'textarea' },
		],
	},
	divider: {
		slug: 'divider', label: __( 'Divider', 'dynamic-product-options-for-woocommerce' ),
		category: 'Layout', icon: 'minus', priceable: false,
		defaultNode: () => baseNode( 'divider' ), inspectorSchema: [],
	},
	spacer: {
		slug: 'spacer', label: __( 'Spacer', 'dynamic-product-options-for-woocommerce' ),
		category: 'Layout', icon: 'image-flip-vertical', priceable: false,
		defaultNode: () => ( { ...baseNode( 'spacer' ), config: { height: 24 } } ),
		inspectorSchema: [
			{ key: 'height', label: __( 'Height (px)', 'dynamic-product-options-for-woocommerce' ), control: 'number' },
		],
	},
	section: {
		slug: 'section', label: __( 'Section', 'dynamic-product-options-for-woocommerce' ),
		category: 'Layout', icon: 'screenoptions', priceable: false, container: true,
		defaultNode: () => ( {
			...baseNode( 'section' ),
			config: { collapsible: false, collapsed: false },
			children: [],
		} ),
		inspectorSchema: [
			{ key: 'collapsible', label: __( 'Collapsible', 'dynamic-product-options-for-woocommerce' ), control: 'toggle' },
			{ key: 'collapsed', label: __( 'Collapsed by default', 'dynamic-product-options-for-woocommerce' ), control: 'toggle' },
		],
	},

	/* ---- Special ---- */
	popup: {
		slug: 'popup', label: __( 'Popup', 'dynamic-product-options-for-woocommerce' ),
		category: 'Special', icon: 'external', priceable: false,
		defaultNode: () => ( {
			...baseNode( 'popup' ),
			config: { triggerText: __( 'Open', 'dynamic-product-options-for-woocommerce' ), content: '' },
		} ),
		inspectorSchema: [
			{ key: 'triggerText', label: __( 'Trigger text', 'dynamic-product-options-for-woocommerce' ), control: 'text' },
			{ key: 'content', label: __( 'Popup content', 'dynamic-product-options-for-woocommerce' ), control: 'textarea' },
		],
	},
	shortcode: {
		slug: 'shortcode', label: __( 'Shortcode', 'dynamic-product-options-for-woocommerce' ),
		category: 'Special', icon: 'shortcode', priceable: false,
		defaultNode: () => ( { ...baseNode( 'shortcode' ), config: { shortcode: '' } } ),
		inspectorSchema: [
			{ key: 'shortcode', label: __( 'Shortcode', 'dynamic-product-options-for-woocommerce' ), control: 'text' },
		],
	},
};

/** Category display order + labels. */
export const CATEGORIES = [
	{ key: 'Input', label: __( 'Input', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'Choice', label: __( 'Choice', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'Advanced', label: __( 'Advanced', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'Layout', label: __( 'Layout', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'Special', label: __( 'Special', 'dynamic-product-options-for-woocommerce' ) },
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
	{ value: 'none', label: __( 'No price', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'flat', label: __( 'Fixed', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'percent', label: __( 'Percentage', 'dynamic-product-options-for-woocommerce' ), pro: true },
	{ value: 'per_unit', label: __( 'Per Unit', 'dynamic-product-options-for-woocommerce' ), pro: true },
	{ value: 'per_char', label: __( 'Per Character', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'per_char_nospace', label: __( 'Per Character (no spaces)', 'dynamic-product-options-for-woocommerce' ), pro: true },
	{ value: 'per_word', label: __( 'Per Word', 'dynamic-product-options-for-woocommerce' ), pro: true },
];

/** Conditional-logic operator vocabulary (ARCHITECTURE §6). */
export const OPERATORS = [
	{ value: 'is', label: __( 'is', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'is_not', label: __( 'is not', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'empty', label: __( 'is empty', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'not_empty', label: __( 'is not empty', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'contains', label: __( 'contains', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'not_contains', label: __( 'does not contain', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'gt', label: __( 'greater than', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'lt', label: __( 'less than', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'gte', label: __( 'greater or equal', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'lte', label: __( 'less or equal', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'starts_with', label: __( 'starts with', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'between', label: __( 'between', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'checked', label: __( 'is checked', 'dynamic-product-options-for-woocommerce' ) },
];

/** Field width options (ARCHITECTURE §6). */
export const WIDTHS = [
	{ value: 'full', label: __( 'Full', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'half', label: __( '1/2', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'third', label: __( '1/3', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'two-third', label: __( '2/3', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 'quarter', label: __( '1/4', 'dynamic-product-options-for-woocommerce' ) },
];
