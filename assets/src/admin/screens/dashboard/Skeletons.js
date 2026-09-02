/**
 * Loading skeletons. Rendered while the dashboard data is in flight so the
 * layout never collapses or jumps — static panels (Quick Actions, Pro)
 * stay live alongside these placeholders.
 *
 * @package
 */

/**
 * Index range helper (`[0, 1, … n-1]`) for repeating placeholder nodes.
 *
 * @param {number} n How many items.
 * @return {number[]} Index array.
 */
const times = ( n ) => Array.from( { length: n }, ( _, i ) => i );

/**
 * Stat strip placeholder (matches the four-tile grid).
 *
 * @return {JSX.Element} Skeleton strip.
 */
export function StripSkeleton() {
	return (
		<section className="spcus-db-strip" aria-hidden="true">
			{ times( 4 ).map( ( i ) => (
				<div key={ i } className="spcus-db-stat">
					<span className="spcus-db-skel spcus-db-skel--icon" />
					<div className="spcus-db-stat__body">
						<span className="spcus-db-skel spcus-db-skel--lg" />
						<span className="spcus-db-skel spcus-db-skel--sm" />
					</div>
				</div>
			) ) }
		</section>
	);
}

/**
 * Generic panel placeholder with a configurable number of rows.
 *
 * @param {Object} props      Props.
 * @param {number} props.rows Row count.
 * @return {JSX.Element} Skeleton panel.
 */
export function PanelSkeleton( { rows = 4 } ) {
	return (
		<section className="spcus-db-card spcus-db-panel" aria-hidden="true">
			<header className="spcus-db-panel__head">
				<span className="spcus-db-skel spcus-db-skel--title" />
			</header>
			<div className="spcus-db-skel-rows">
				{ times( rows ).map( ( i ) => (
					<span key={ i } className="spcus-db-skel spcus-db-skel--row" />
				) ) }
			</div>
		</section>
	);
}
