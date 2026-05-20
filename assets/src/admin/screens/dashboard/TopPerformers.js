/**
 * Top performers — the three best revenue-earning option sets (all-time).
 * Rows deep-link into the builder for the set; the header links to the
 * full Analytics screen.
 *
 * @package DPO\Admin
 */

import { __, sprintf, _n } from '@wordpress/i18n';
import { useConfig } from '../../store/ConfigContext';
import { navigate } from '../../app/router';

/**
 * TopPerformers.
 *
 * @param {Object} props            Props.
 * @param {Array}  props.performers [{ id, title, orders, revenue, ctr }].
 * @return {JSX.Element} The panel.
 */
export default function TopPerformers( { performers } ) {
	const { formatPrice } = useConfig();

	return (
		<section className="dpo-db-card dpo-db-panel">
			<header className="dpo-db-panel__head">
				<h2 className="dpo-db-panel__title">
					<span
						className="dashicons dashicons-chart-line dpo-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Top Performers',
						'dynamic-product-options-for-woocommerce'
					) }
				</h2>
				{ performers.length > 0 && (
					<button
						type="button"
						className="dpo-db-link"
						onClick={ () => navigate( '/analytics' ) }
					>
						{ __(
							'Analytics',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
				) }
			</header>

			{ performers.length === 0 ? (
				<p className="dpo-db-empty">
					{ __(
						'No revenue recorded yet. Publish a set and conversions will appear here.',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
			) : (
				<ol className="dpo-db-rank">
					{ performers.map( ( p, i ) => {
						const up = p.ctr >= 0;
						return (
							<li key={ p.id } className="dpo-db-rank__item">
								<button
									type="button"
									className="dpo-db-rank__btn"
									onClick={ () =>
										navigate( `/set/${ p.id }` )
									}
								>
									<span
										className={ `dpo-db-rank__no dpo-db-rank__no--${
											i + 1
										}` }
									>
										{ i + 1 }
									</span>
									<span className="dpo-db-rank__meta">
										<span className="dpo-db-rank__name">
											{ p.title ||
												sprintf(
													/* translators: %d: set id */
													__(
														'Option set #%d',
														'dynamic-product-options-for-woocommerce'
													),
													p.id
												) }
										</span>
										<span className="dpo-db-rank__sub">
											{ sprintf(
												/* translators: %d: conversions */
												_n(
													'%d conversion',
													'%d conversions',
													p.orders,
													'dynamic-product-options-for-woocommerce'
												),
												p.orders
											) }
										</span>
									</span>
									<span className="dpo-db-rank__fig">
										<span className="dpo-db-rank__rev">
											{ formatPrice( p.revenue ) }
										</span>
										<span
											className={ `dpo-db-rank__ctr dpo-db-rank__ctr--${
												up ? 'up' : 'down'
											}` }
										>
											{ `${ up ? '+' : '' }${ p.ctr }%` }
										</span>
									</span>
								</button>
							</li>
						);
					} ) }
				</ol>
			) }
		</section>
	);
}
