/**
 * Card/panel container with an optional title and toolbar slot.
 *
 * @package DPO\Admin
 */

/**
 * Panel.
 *
 * @param {Object}      props          Component props.
 * @param {string}      [props.title]  Optional heading.
 * @param {JSX.Element} [props.actions] Optional right-aligned toolbar.
 * @param {string}      [props.className] Extra class.
 * @param {JSX.Element} props.children Body content.
 * @return {JSX.Element} The panel.
 */
export default function Panel( { title, actions, className = '', children } ) {
	return (
		<section className={ `dpo-panel ${ className }`.trim() }>
			{ ( title || actions ) && (
				<header className="dpo-panel__head">
					{ title && (
						<h2 className="dpo-panel__title">{ title }</h2>
					) }
					{ actions && (
						<div className="dpo-panel__actions">{ actions }</div>
					) }
				</header>
			) }
			<div className="dpo-panel__body">{ children }</div>
		</section>
	);
}
