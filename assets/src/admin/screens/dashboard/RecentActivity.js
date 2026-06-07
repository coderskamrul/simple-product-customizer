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
		<section className="pkitfw-db-card pkitfw-db-panel">
			<header className="pkitfw-db-panel__head">
				<h2 className="pkitfw-db-panel__title">
					<span
						className="dashicons dashicons-calendar-alt pkitfw-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Recent Activity',
						'productkit-for-woocommerce'
					) }
				</h2>
				{ activity.length > 0 && (
					<button
						type="button"
						className="pkitfw-db-link"
						onClick={ () => navigate( '/sets' ) }
					>
						{ __(
							'View all',
							'productkit-for-woocommerce'
						) }
					</button>
				) }
			</header>

			{ activity.length === 0 ? (
				<p className="pkitfw-db-empty">
					{ __(
						'No activity yet — create your first option set to get started.',
						'productkit-for-woocommerce'
					) }
				</p>
			) : (
				<ul className="pkitfw-db-feed">
					{ activity.map( ( a ) => {
						const published = a.kind === 'published';
						const tone = published ? 'blue' : 'amber';
						const label = published
							? __(
									'Option set published',
									'productkit-for-woocommerce'
							  )
							: __(
									'Draft saved',
									'productkit-for-woocommerce'
							  );
						return (
							<li key={ a.id } className="pkitfw-db-feed__item">
								<span
									className={ `pkitfw-db-feed__dot pkitfw-db-feed__dot--${ tone }` }
									aria-hidden="true"
								/>
								<button
									type="button"
									className="pkitfw-db-feed__main"
									onClick={ () =>
										navigate( `/set/${ a.id }` )
									}
								>
									<span className="pkitfw-db-feed__label">
										{ label }
									</span>
									<span className="pkitfw-db-feed__sub">
										{ a.title ||
											sprintf(
												/* translators: %d: set id */
												__(
													'Option set #%d',
													'productkit-for-woocommerce'
												),
												a.id
											) }
									</span>
								</button>
								<time className="pkitfw-db-feed__time">
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
