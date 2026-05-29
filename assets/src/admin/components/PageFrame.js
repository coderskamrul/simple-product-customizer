/**
 * PageFrame — uniform screen chrome used by every top-level screen.
 *
 * Replaces the bespoke headers each screen used to invent. Renders:
 *   • a screen title + subtitle row
 *   • an optional actions slot (right-aligned)
 *   • an optional toolbar slot (search / bulk action / filters row, like the
 *     reference SaaS dashboard)
 *   • the screen body inside a soft container
 *
 * Every measurement comes from the global theme tokens, so all screens stay
 * pixel-aligned and follow the active emerald palette.
 *
 * @package DPO\Admin
 */

/**
 * PageFrame.
 *
 * @param {Object}      props          Component props.
 * @param {string}      props.title    Screen title.
 * @param {string}      [props.subtitle] Supporting copy under the title.
 * @param {JSX.Element} [props.actions] Right-aligned actions (buttons, links).
 * @param {JSX.Element} [props.toolbar] Optional row below the title (filters /
 *                                      search / bulk actions).
 * @param {string}      [props.tone]    Optional accent for the title row.
 * @param {boolean}     [props.bleed]   When true, body has no padding.
 * @param {JSX.Element} props.children  Screen body.
 * @return {JSX.Element} Frame.
 */
export default function PageFrame( {
	title,
	subtitle,
	actions,
	toolbar,
	bleed = false,
	children,
} ) {
	return (
		<div className="dpo-page">
			{/* <header className="dpo-page__head">
				<div className="dpo-page__titles">
					{ title && (
						<h1 className="dpo-page__title">{ title }</h1>
					) }
					{ subtitle && (
						<p className="dpo-page__sub">{ subtitle }</p>
					) }
				</div>
				{ actions && (
					<div className="dpo-page__actions">{ actions }</div>
				) }
			</header> */}

			{ toolbar && (
				<div className="dpo-page__toolbar">{ toolbar }</div>
			) }

			<div
				className={ `dpo-page__body${
					bleed ? ' dpo-page__body--bleed' : ''
				}` }
			>
				{ children }
			</div>
		</div>
	);
}
