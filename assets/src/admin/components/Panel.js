/**
 * Card/panel container with an optional title and toolbar slot.
 *
 * @package
 */

/**
 * Panel.
 *
 * @param {Object}      props             Component props.
 * @param {string}      [props.title]     Optional heading.
 * @param {JSX.Element} [props.actions]   Optional right-aligned toolbar.
 * @param {string}      [props.className] Extra class.
 * @param {JSX.Element} props.children    Body content.
 * @return {JSX.Element} The panel.
 */
export default function Panel( { title, actions, className = '', children } ) {
	return (
		<section className={ `pkitfw-panel ${ className }`.trim() }>
			{ ( title || actions ) && (
				<header className="pkitfw-panel__head">
					{ title && <h2 className="pkitfw-panel__title">{ title }</h2> }
					{ actions && (
						<div className="pkitfw-panel__actions">{ actions }</div>
					) }
				</header>
			) }
			<div className="pkitfw-panel__body">{ children }</div>
		</section>
	);
}
