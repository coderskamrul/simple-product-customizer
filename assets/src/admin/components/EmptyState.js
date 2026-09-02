/**
 * Empty / zero-data placeholder with an optional call-to-action.
 *
 * @package
 */

/**
 * EmptyState.
 *
 * @param {Object}      props          Component props.
 * @param {string}      [props.icon]   Dashicon slug.
 * @param {string}      props.title    Headline.
 * @param {string}      [props.text]   Supporting copy.
 * @param {JSX.Element} [props.action] Optional CTA element.
 * @return {JSX.Element} The empty state.
 */
export default function EmptyState( {
	icon = 'screenoptions',
	title,
	text,
	action,
} ) {
	return (
		<div className="spcus-empty">
			<span
				className={ `dashicons dashicons-${ icon } spcus-empty__icon` }
				aria-hidden="true"
			/>
			<h3 className="spcus-empty__title">{ title }</h3>
			{ text && <p className="spcus-empty__text">{ text }</p> }
			{ action && <div className="spcus-empty__action">{ action }</div> }
		</div>
	);
}
