/**
 * Reusable bordered sub-card: an accent icon tile, title + optional
 * subtitle, a body slot for the control, and an optional muted footer
 * hint. Used by every section so the cards line up pixel-for-pixel.
 *
 * @package DPO\Admin
 */

import classNames from 'classnames';

/**
 * SettingCard.
 *
 * @param {Object}      props            Props.
 * @param {string}      props.icon       dashicons suffix.
 * @param {string}      props.tone       Accent tone for the icon tile.
 * @param {string}      props.title      Card title.
 * @param {string}      [props.subtitle] Optional muted subtitle.
 * @param {string}      [props.hint]     Optional footer hint line.
 * @param {string}      [props.className] Extra class.
 * @param {JSX.Element} props.children   Control body.
 * @return {JSX.Element} The card.
 */
export default function SettingCard( {
	icon,
	tone,
	title,
	subtitle,
	hint,
	className = '',
	children,
} ) {
	return (
		<div className={ classNames( 'dpo-set-card', className ) }>
			<div className="dpo-set-card__head">
				<span
					className={ `dpo-set-tile dpo-set-tile--${ tone }` }
					aria-hidden="true"
				>
					<span className={ `dashicons dashicons-${ icon }` } />
				</span>
				<div className="dpo-set-card__heading">
					<h3 className="dpo-set-card__title">{ title }</h3>
					{ subtitle && (
						<p className="dpo-set-card__sub">{ subtitle }</p>
					) }
				</div>
			</div>

			<div className="dpo-set-card__body">{ children }</div>

			{ hint && <p className="dpo-set-card__hint">{ hint }</p> }
		</div>
	);
}
