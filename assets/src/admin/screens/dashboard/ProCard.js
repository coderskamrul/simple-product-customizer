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
		'dynamic-product-options-for-woocommerce'
	),
	__( 'Advanced formula pricing', 'dynamic-product-options-for-woocommerce' ),
	__(
		'Percentage & per-unit pricing',
		'dynamic-product-options-for-woocommerce'
	),
	__( 'Custom font picker', 'dynamic-product-options-for-woocommerce' ),
	__( 'Priority support', 'dynamic-product-options-for-woocommerce' ),
];

/**
 * ProCard.
 *
 * @return {JSX.Element} The upsell card.
 */
export default function ProCard() {
	return (
		<section className="dpo-db-card dpo-db-pro">
			<header className="dpo-db-pro__head">
				<span
					className="dashicons dashicons-superhero dpo-db-pro__ico"
					aria-hidden="true"
				/>
				<h2 className="dpo-db-pro__title">
					{ __(
						'Unlock Pro Features',
						'dynamic-product-options-for-woocommerce'
					) }
				</h2>
			</header>

			<ul className="dpo-db-pro__list">
				{ FEATURES.map( ( f ) => (
					<li key={ f } className="dpo-db-pro__feat">
						<span
							className="dashicons dashicons-yes-alt"
							aria-hidden="true"
						/>
						{ f }
					</li>
				) ) }
			</ul>

			<a
				className="dpo-db-pro__cta"
				href="https://wpdeveloper.com/in/upgrade-dynamic-product-options"
				target="_blank"
				rel="noreferrer"
			>
				{ __(
					'Upgrade Now',
					'dynamic-product-options-for-woocommerce'
				) }
				<span
					className="dashicons dashicons-arrow-right-alt"
					aria-hidden="true"
				/>
			</a>
		</section>
	);
}
