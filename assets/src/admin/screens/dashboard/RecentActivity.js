/**
 * Recent activity feed — synthesised from the latest option sets ordered
 * by modified time. Each entry is honest about what the API exposes
 * (published vs. still a draft) and shows a relative timestamp.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { navigate } from '../../app/router';
import { relativeTime } from './helpers';

/**
 * RecentActivity.
 *
 * @param {Object} props          Props.
 * @param {Array}  props.activity [{ id, title, updated, kind, fields }].
 * @return {JSX.Element} The panel.
 */
export default function RecentActivity( { activity } ) {
	return (
		<section className="dpo-db-card dpo-db-panel">
			<header className="dpo-db-panel__head">
				<h2 className="dpo-db-panel__title">
					<span
						className="dashicons dashicons-calendar-alt dpo-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Recent Activity',
						'dynamic-product-options-for-woocommerce'
					) }
				</h2>
				{ activity.length > 0 && (
					<button
						type="button"
						className="dpo-db-link"
						onClick={ () => navigate( '/sets' ) }
					>
						{ __(
							'View all',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
				) }
			</header>

			{ activity.length === 0 ? (
				<p className="dpo-db-empty">
					{ __(
						'No activity yet — create your first option set to get started.',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
			) : (
				<ul className="dpo-db-feed">
					{ activity.map( ( a ) => {
						const published = a.kind === 'published';
						const tone = published ? 'blue' : 'amber';
						const label = published
							? __(
									'Option set published',
									'dynamic-product-options-for-woocommerce'
							  )
							: __(
									'Draft saved',
									'dynamic-product-options-for-woocommerce'
							  );
						return (
							<li key={ a.id } className="dpo-db-feed__item">
								<span
									className={ `dpo-db-feed__dot dpo-db-feed__dot--${ tone }` }
									aria-hidden="true"
								/>
								<button
									type="button"
									className="dpo-db-feed__main"
									onClick={ () =>
										navigate( `/set/${ a.id }` )
									}
								>
									<span className="dpo-db-feed__label">
										{ label }
									</span>
									<span className="dpo-db-feed__sub">
										{ a.title ||
											sprintf(
												/* translators: %d: set id */
												__(
													'Option set #%d',
													'dynamic-product-options-for-woocommerce'
												),
												a.id
											) }
									</span>
								</button>
								<time className="dpo-db-feed__time">
									{ relativeTime( a.updated ) }
								</time>
							</li>
						);
					} ) }
				</ul>
			) }
		</section>
	);
}
