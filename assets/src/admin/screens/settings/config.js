/**
 * Settings screen static config — §10 defaults and the section registry
 * (id, nav label/sublabel, icon, accent tone, info banner copy). Keeping
 * this declarative means <SettingsNav/> and the panel header stay in sync
 * with the section list automatically.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/** §10 defaults so every form stays controlled even before the fetch. */
export const DEFAULTS = {
	showPriceLine: true,
	priceLineLabel: 'Options Price',
	showTotalLine: true,
	totalLineLabel: 'Total Price',
	hideInCart: false,
	hideInCheckout: false,
	shopForceSelect: true,
	shopButtonText: 'Select Options',
	uploadTempDays: 7,
	uploadPlacedDays: 0,
	uploadCompletedDays: 0,
};

/**
 * Ordered section registry. `tone` maps to a `.spcus-set-*--{tone}` accent
 * (icon tile + info banner). `dashicon` is the bare dashicons suffix.
 *
 * @return {Array<Object>} Section descriptors.
 */
export const SECTIONS = [
	{
		id: 'price',
		dashicon: 'money-alt',
		tone: 'blue',
		title: __( 'Price Display', 'simple-product-customizer' ),
		nav: __(
			'Configure how prices appear',
			'simple-product-customizer'
		),
		banner: __(
			'Control the optional price and running total lines shown beneath the product options.',
			'simple-product-customizer'
		),
	},
	{
		id: 'cart',
		dashicon: 'cart',
		tone: 'amber',
		title: __(
			'Cart & Checkout',
			'simple-product-customizer'
		),
		nav: __(
			'Control visibility in cart',
			'simple-product-customizer'
		),
		banner: __(
			'Choose whether to show or hide selected options in the cart and checkout pages.',
			'simple-product-customizer'
		),
	},
	{
		id: 'shop',
		dashicon: 'screenoptions',
		tone: 'violet',
		title: __( 'Shop Loop', 'simple-product-customizer' ),
		nav: __(
			'Shop page button settings',
			'simple-product-customizer'
		),
		banner: __(
			'Decide how the shop and archive pages behave for products that have options.',
			'simple-product-customizer'
		),
	},
	{
		id: 'uploads',
		dashicon: 'clock',
		tone: 'teal',
		title: __(
			'Upload Retention',
			'simple-product-customizer'
		),
		nav: __(
			'File storage duration',
			'simple-product-customizer'
		),
		banner: __(
			'Set how long uploaded files are kept. Use 0 to keep files forever.',
			'simple-product-customizer'
		),
	},
	{
		id: 'fonts',
		dashicon: 'editor-textcolor',
		tone: 'pink',
		title: __( 'Custom Fonts', 'simple-product-customizer' ),
		nav: __(
			'Manage typography',
			'simple-product-customizer'
		),
		banner: __(
			'Upload custom fonts to use in your product options. Supported formats: TTF, OTF, WOFF, WOFF2.',
			'simple-product-customizer'
		),
	},
];
