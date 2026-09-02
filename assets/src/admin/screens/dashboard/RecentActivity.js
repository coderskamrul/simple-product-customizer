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
		<section className="spcus-db-card spcus-db-panel">
			<header className="spcus-db-panel__head">
				<h2 className="spcus-db-panel__title">
					<span
						className="dashicons dashicons-calendar-alt spcus-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Recent Activity',
						'simple-product-customizer'
					) }
				</h2>
				{ activity.length > 0 && (
					<button
						type="button"
						className="spcus-db-link"
						onClick={ () => navigate( '/sets' ) }
					>
						{ __(
							'View all',
							'simple-product-customizer'
						) }
					</button>
				) }
			</header>

			{ activity.length === 0 ? (
				<p className="spcus-db-empty">
					{ __(
						'No activity yet — create your first option set to get started.',
						'simple-product-customizer'
					) }
				</p>
			) : (
				<ul className="spcus-db-feed">
					{ activity.map( ( a ) => {
						const published = a.kind === 'published';
						const tone = published ? 'blue' : 'amber';
						const label = published
							? __(
									'Option set published',
									'simple-product-customizer'
							  )
							: __(
									'Draft saved',
									'simple-product-customizer'
							  );
						return (
							<li key={ a.id } className="spcus-db-feed__item">
								<span
									className={ `spcus-db-feed__dot spcus-db-feed__dot--${ tone }` }
									aria-hidden="true"
								/>
								<button
									type="button"
									className="spcus-db-feed__main"
									onClick={ () =>
										navigate( `/set/${ a.id }` )
									}
								>
									<span className="spcus-db-feed__label">
										{ label }
									</span>
									<span className="spcus-db-feed__sub">
										{ a.title ||
											sprintf(
												/* translators: %d: set id */
												__(
													'Option set #%d',
													'simple-product-customizer'
												),
												a.id
											) }
									</span>
								</button>
								<time className="spcus-db-feed__time">
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
