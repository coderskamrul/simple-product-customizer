/**
 * Empty / zero-data placeholder with an optional call-to-action.
 *
 * @package DPO\Admin
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
		<div className="dpo-empty">
			<span
				className={ `dashicons dashicons-${ icon } dpo-empty__icon` }
				aria-hidden="true"
			/>
			<h3 className="dpo-empty__title">{ title }</h3>
			{ text && <p className="dpo-empty__text">{ text }</p> }
			{ action && (
				<div className="dpo-empty__action">{ action }</div>
			) }
		</div>
	);
}
