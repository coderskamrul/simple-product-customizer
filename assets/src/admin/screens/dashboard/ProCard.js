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
		'simple-product-customizer'
	),
	__( 'Advanced formula pricing', 'simple-product-customizer' ),
	__(
		'Percentage & per-unit pricing',
		'simple-product-customizer'
	),
	__( 'Custom font picker', 'simple-product-customizer' ),
	__( 'Priority support', 'simple-product-customizer' ),
];

/**
 * ProCard.
 *
 * @return {JSX.Element} The upsell card.
 */
export default function ProCard() {
	return (
		<section className="spcus-db-card spcus-db-pro">
			<header className="spcus-db-pro__head">
				<span
					className="dashicons dashicons-superhero spcus-db-pro__ico"
					aria-hidden="true"
				/>
				<h2 className="spcus-db-pro__title">
					{ __(
						'Unlock Pro Features',
						'simple-product-customizer'
					) }
				</h2>
			</header>

			<ul className="spcus-db-pro__list">
				{ FEATURES.map( ( f ) => (
					<li key={ f } className="spcus-db-pro__feat">
						<span
							className="dashicons dashicons-yes-alt"
							aria-hidden="true"
						/>
						{ f }
					</li>
				) ) }
			</ul>

			<a
				className="spcus-db-pro__cta"
				href="https://wpdeveloper.com/in/upgrade-simple-product-customizer"
				target="_blank"
				rel="noreferrer"
			>
				{ __(
					'Upgrade Now',
					'simple-product-customizer'
				) }
				<span
					className="dashicons dashicons-arrow-right-alt"
					aria-hidden="true"
				/>
			</a>
		</section>
	);
}
