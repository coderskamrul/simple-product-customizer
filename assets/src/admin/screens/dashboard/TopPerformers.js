/**
 * Top performers — the three best revenue-earning option sets (all-time).
 * Rows deep-link into the builder for the set; the header links to the
 * full Analytics screen.
 *
 * @package
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
		<section className="pkitfw-db-card pkitfw-db-panel">
			<header className="pkitfw-db-panel__head">
				<h2 className="pkitfw-db-panel__title">
					<span
						className="dashicons dashicons-chart-line pkitfw-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Top Performers',
						'productkit-for-woocommerce'
					) }
				</h2>
				{ performers.length > 0 && (
					<button
						type="button"
						className="pkitfw-db-link"
						onClick={ () => navigate( '/analytics' ) }
					>
						{ __(
							'Analytics',
							'productkit-for-woocommerce'
						) }
					</button>
				) }
			</header>

			{ performers.length === 0 ? (
				<p className="pkitfw-db-empty">
					{ __(
						'No revenue recorded yet. Publish a set and conversions will appear here.',
						'productkit-for-woocommerce'
					) }
				</p>
			) : (
				<ol className="pkitfw-db-rank">
					{ performers.map( ( p, i ) => {
						const up = p.ctr >= 0;
						return (
							<li key={ p.id } className="pkitfw-db-rank__item">
								<button
									type="button"
									className="pkitfw-db-rank__btn"
									onClick={ () =>
										navigate( `/set/${ p.id }` )
									}
								>
									<span
										className={ `pkitfw-db-rank__no pkitfw-db-rank__no--${
											i + 1
										}` }
									>
										{ i + 1 }
									</span>
									<span className="pkitfw-db-rank__meta">
										<span className="pkitfw-db-rank__name">
											{ p.title ||
												sprintf(
													/* translators: %d: set id */
													__(
														'Option set #%d',
														'productkit-for-woocommerce'
													),
													p.id
												) }
										</span>
										<span className="pkitfw-db-rank__sub">
											{ sprintf(
												/* translators: %d: conversions */
												_n(
													'%d conversion',
													'%d conversions',
													p.orders,
													'productkit-for-woocommerce'
												),
												p.orders
											) }
										</span>
									</span>
									<span className="pkitfw-db-rank__fig">
										<span className="pkitfw-db-rank__rev">
											{ formatPrice( p.revenue ) }
										</span>
										<span
											className={ `pkitfw-db-rank__ctr pkitfw-db-rank__ctr--${
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
