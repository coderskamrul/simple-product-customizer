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
		<section className="spcus-db-card spcus-db-panel">
			<header className="spcus-db-panel__head">
				<h2 className="spcus-db-panel__title">
					<span
						className="dashicons dashicons-chart-line spcus-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Top Performers',
						'simple-product-customizer'
					) }
				</h2>
				{ performers.length > 0 && (
					<button
						type="button"
						className="spcus-db-link"
						onClick={ () => navigate( '/analytics' ) }
					>
						{ __(
							'Analytics',
							'simple-product-customizer'
						) }
					</button>
				) }
			</header>

			{ performers.length === 0 ? (
				<p className="spcus-db-empty">
					{ __(
						'No revenue recorded yet. Publish a set and conversions will appear here.',
						'simple-product-customizer'
					) }
				</p>
			) : (
				<ol className="spcus-db-rank">
					{ performers.map( ( p, i ) => {
						const up = p.ctr >= 0;
						return (
							<li key={ p.id } className="spcus-db-rank__item">
								<button
									type="button"
									className="spcus-db-rank__btn"
									onClick={ () =>
										navigate( `/set/${ p.id }` )
									}
								>
									<span
										className={ `spcus-db-rank__no spcus-db-rank__no--${
											i + 1
										}` }
									>
										{ i + 1 }
									</span>
									<span className="spcus-db-rank__meta">
										<span className="spcus-db-rank__name">
											{ p.title ||
												sprintf(
													/* translators: %d: set id */
													__(
														'Option set #%d',
														'simple-product-customizer'
													),
													p.id
												) }
										</span>
										<span className="spcus-db-rank__sub">
											{ sprintf(
												/* translators: %d: conversions */
												_n(
													'%d conversion',
													'%d conversions',
													p.orders,
													'simple-product-customizer'
												),
												p.orders
											) }
										</span>
									</span>
									<span className="spcus-db-rank__fig">
										<span className="spcus-db-rank__rev">
											{ formatPrice( p.revenue ) }
										</span>
										<span
											className={ `spcus-db-rank__ctr spcus-db-rank__ctr--${
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
