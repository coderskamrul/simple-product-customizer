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
 * Ordered section registry. `tone` maps to a `.pkitfw-set-*--{tone}` accent
 * (icon tile + info banner). `dashicon` is the bare dashicons suffix.
 *
 * @return {Array<Object>} Section descriptors.
 */
export const SECTIONS = [
	{
		id: 'price',
		dashicon: 'money-alt',
		tone: 'blue',
		title: __( 'Price Display', 'productkit-for-woocommerce' ),
		nav: __(
			'Configure how prices appear',
			'productkit-for-woocommerce'
		),
		banner: __(
			'Control the optional price and running total lines shown beneath the product options.',
			'productkit-for-woocommerce'
		),
	},
	{
		id: 'cart',
		dashicon: 'cart',
		tone: 'amber',
		title: __(
			'Cart & Checkout',
			'productkit-for-woocommerce'
		),
		nav: __(
			'Control visibility in cart',
			'productkit-for-woocommerce'
		),
		banner: __(
			'Choose whether to show or hide selected options in the cart and checkout pages.',
			'productkit-for-woocommerce'
		),
	},
	{
		id: 'shop',
		dashicon: 'screenoptions',
		tone: 'violet',
		title: __( 'Shop Loop', 'productkit-for-woocommerce' ),
		nav: __(
			'Shop page button settings',
			'productkit-for-woocommerce'
		),
		banner: __(
			'Decide how the shop and archive pages behave for products that have options.',
			'productkit-for-woocommerce'
		),
	},
	{
		id: 'uploads',
		dashicon: 'clock',
		tone: 'teal',
		title: __(
			'Upload Retention',
			'productkit-for-woocommerce'
		),
		nav: __(
			'File storage duration',
			'productkit-for-woocommerce'
		),
		banner: __(
			'Set how long uploaded files are kept. Use 0 to keep files forever.',
			'productkit-for-woocommerce'
		),
	},
	{
		id: 'fonts',
		dashicon: 'editor-textcolor',
		tone: 'pink',
		title: __( 'Custom Fonts', 'productkit-for-woocommerce' ),
		nav: __(
			'Manage typography',
			'productkit-for-woocommerce'
		),
		banner: __(
			'Upload custom fonts to use in your product options. Supported formats: TTF, OTF, WOFF, WOFF2.',
			'productkit-for-woocommerce'
		),
	},
];
