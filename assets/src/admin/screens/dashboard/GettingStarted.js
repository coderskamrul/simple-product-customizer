/**
 * Getting-started checklist. Each step's completion is derived from real
 * account state (see useDashboard) so the progress count is truthful.
 * Completed steps are inert; the rest are keyboard-activatable rows that
 * deep-link to the screen where the work happens.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import { navigate } from '../../app/router';

/** Static copy keyed by checklist id (kept out of the data hook). */
const COPY = {
	create: {
		title: __(
			'Create an option set',
			'simple-product-customizer'
		),
		desc: __(
			'Add fields like dropdowns, colour swatches or text inputs',
			'simple-product-customizer'
		),
	},
	fields: {
		title: __(
			'Add fields to a set',
			'simple-product-customizer'
		),
		desc: __(
			'Build the form shoppers see on the product page',
			'simple-product-customizer'
		),
	},
	publish: {
		title: __(
			'Assign & publish',
			'simple-product-customizer'
		),
		desc: __(
			'Link a set to products, categories or tags',
			'simple-product-customizer'
		),
	},
	track: {
		title: __(
			'Track performance',
			'simple-product-customizer'
		),
		desc: __(
			'Monitor impressions and conversions in Analytics',
			'simple-product-customizer'
		),
	},
};

/**
 * GettingStarted.
 *
 * @param {Object} props           Props.
 * @param {Array}  props.checklist [{ id, done, to }].
 * @param {number} props.progress  Completed step count.
 * @return {JSX.Element} The panel.
 */
export default function GettingStarted( { checklist, progress } ) {
	const total = checklist.length;
	// First not-yet-done step is the one we nudge the user toward.
	const nextId = ( checklist.find( ( s ) => ! s.done ) || {} ).id;

	return (
		<section className="spcus-db-card spcus-db-panel">
			<header className="spcus-db-panel__head">
				<h2 className="spcus-db-panel__title">
					<span
						className="dashicons dashicons-book-alt spcus-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Getting Started',
						'simple-product-customizer'
					) }
				</h2>
				<span className="spcus-db-panel__meta">
					{ sprintf(
						/* translators: 1: completed steps, 2: total steps */
						__(
							'%1$d of %2$d completed',
							'simple-product-customizer'
						),
						progress,
						total
					) }
				</span>
			</header>

			<ol className="spcus-db-steps">
				{ checklist.map( ( step, i ) => {
					const copy = COPY[ step.id ];
					const isNext = step.id === nextId;
					const cls = [
						'spcus-db-step',
						step.done && 'is-done',
						isNext && 'is-next',
					]
						.filter( Boolean )
						.join( ' ' );

					const go = () => navigate( step.to );

					return (
						<li key={ step.id } className={ cls }>
							<span
								className="spcus-db-step__marker"
								aria-hidden="true"
							>
								{ step.done ? (
									<span className="dashicons dashicons-yes" />
								) : (
									i + 1
								) }
							</span>

							<div className="spcus-db-step__text">
								<span className="spcus-db-step__title">
									{ copy.title }
								</span>
								<span className="spcus-db-step__desc">
									{ copy.desc }
								</span>
							</div>

							{ step.done ? (
								<span className="spcus-db-step__state">
									{ __(
										'Done',
										'simple-product-customizer'
									) }
								</span>
							) : (
								<button
									type="button"
									className="spcus-db-step__go"
									onClick={ go }
									aria-label={ sprintf(
										/* translators: %s: step title */
										__(
											'Start: %s',
											'simple-product-customizer'
										),
										copy.title
									) }
								>
									<span
										className="dashicons dashicons-controls-play"
										aria-hidden="true"
									/>
								</button>
							) }
						</li>
					);
				} ) }
			</ol>
		</section>
	);
}
