/**
 * Pro upsell card — vivid gradient surface, benefit list and a single
 * outbound upgrade CTA. Rendered only on the free plan (gated by the
 * Dashboard composition root).
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/** Marketing benefit lines (mirrors readme / existing promo copy). */
const FEATURES = [
	__(
		'Unlimited option sets & fields',
		'productkit-for-woocommerce'
	),
	__( 'Advanced formula pricing', 'productkit-for-woocommerce' ),
	__(
		'Percentage & per-unit pricing',
		'productkit-for-woocommerce'
	),
	__( 'Custom font picker', 'productkit-for-woocommerce' ),
	__( 'Priority support', 'productkit-for-woocommerce' ),
];

/**
 * ProCard.
 *
 * @return {JSX.Element} The upsell card.
 */
export default function ProCard() {
	return (
		<section className="pkitfw-db-card pkitfw-db-pro">
			<header className="pkitfw-db-pro__head">
				<span
					className="dashicons dashicons-superhero pkitfw-db-pro__ico"
					aria-hidden="true"
				/>
				<h2 className="pkitfw-db-pro__title">
					{ __(
						'Unlock Pro Features',
						'productkit-for-woocommerce'
					) }
				</h2>
			</header>

			<ul className="pkitfw-db-pro__list">
				{ FEATURES.map( ( f ) => (
					<li key={ f } className="pkitfw-db-pro__feat">
						<span
							className="dashicons dashicons-yes-alt"
							aria-hidden="true"
						/>
						{ f }
					</li>
				) ) }
			</ul>

			<a
				className="pkitfw-db-pro__cta"
				href="https://pluginshift.com/in/upgrade-dynamic-product-options"
				target="_blank"
				rel="noreferrer"
			>
				{ __(
					'Upgrade Now',
					'productkit-for-woocommerce'
				) }
				<span
					className="dashicons dashicons-arrow-right-alt"
					aria-hidden="true"
				/>
			</a>
		</section>
	);
}
