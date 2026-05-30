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
			'dynamic-product-options-for-woocommerce'
		),
		desc: __(
			'Add fields like dropdowns, colour swatches or text inputs',
			'dynamic-product-options-for-woocommerce'
		),
	},
	fields: {
		title: __(
			'Add fields to a set',
			'dynamic-product-options-for-woocommerce'
		),
		desc: __(
			'Build the form shoppers see on the product page',
			'dynamic-product-options-for-woocommerce'
		),
	},
	publish: {
		title: __(
			'Assign & publish',
			'dynamic-product-options-for-woocommerce'
		),
		desc: __(
			'Link a set to products, categories or tags',
			'dynamic-product-options-for-woocommerce'
		),
	},
	track: {
		title: __(
			'Track performance',
			'dynamic-product-options-for-woocommerce'
		),
		desc: __(
			'Monitor impressions and conversions in Analytics',
			'dynamic-product-options-for-woocommerce'
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
		<section className="dpo-db-card dpo-db-panel">
			<header className="dpo-db-panel__head">
				<h2 className="dpo-db-panel__title">
					<span
						className="dashicons dashicons-book-alt dpo-db-panel__ico"
						aria-hidden="true"
					/>
					{ __(
						'Getting Started',
						'dynamic-product-options-for-woocommerce'
					) }
				</h2>
				<span className="dpo-db-panel__meta">
					{ sprintf(
						/* translators: 1: completed steps, 2: total steps */
						__(
							'%1$d of %2$d completed',
							'dynamic-product-options-for-woocommerce'
						),
						progress,
						total
					) }
				</span>
			</header>

			<ol className="dpo-db-steps">
				{ checklist.map( ( step, i ) => {
					const copy = COPY[ step.id ];
					const isNext = step.id === nextId;
					const cls = [
						'dpo-db-step',
						step.done && 'is-done',
						isNext && 'is-next',
					]
						.filter( Boolean )
						.join( ' ' );

					const go = () => navigate( step.to );

					return (
						<li key={ step.id } className={ cls }>
							<span
								className="dpo-db-step__marker"
								aria-hidden="true"
							>
								{ step.done ? (
									<span className="dashicons dashicons-yes" />
								) : (
									i + 1
								) }
							</span>

							<div className="dpo-db-step__text">
								<span className="dpo-db-step__title">
									{ copy.title }
								</span>
								<span className="dpo-db-step__desc">
									{ copy.desc }
								</span>
							</div>

							{ step.done ? (
								<span className="dpo-db-step__state">
									{ __(
										'Done',
										'dynamic-product-options-for-woocommerce'
									) }
								</span>
							) : (
								<button
									type="button"
									className="dpo-db-step__go"
									onClick={ go }
									aria-label={ sprintf(
										/* translators: %s: step title */
										__(
											'Start: %s',
											'dynamic-product-options-for-woocommerce'
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
