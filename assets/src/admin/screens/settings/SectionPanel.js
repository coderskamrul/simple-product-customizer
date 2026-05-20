/**
 * The right-hand content card: an accent icon tile + section title and
 * sublabel, a divider, the tinted info banner, then the section body.
 * Purely presentational — the active section supplies `children`.
 *
 * @package DPO\Admin
 */

import InfoBanner from './InfoBanner';

/**
 * SectionPanel.
 *
 * @param {Object}      props         Props.
 * @param {Object}      props.section Section descriptor from config.
 * @param {JSX.Element} props.children Section body.
 * @return {JSX.Element} The panel.
 */
export default function SectionPanel( { section, children } ) {
	return (
		<section
			className="dpo-set-panel"
			aria-labelledby={ `dpo-set-h-${ section.id }` }
		>
			<header className="dpo-set-panel__head">
				<span
					className={ `dpo-set-tile dpo-set-tile--lg dpo-set-tile--${ section.tone }` }
					aria-hidden="true"
				>
					<span
						className={ `dashicons dashicons-${ section.dashicon }` }
					/>
				</span>
				<div>
					<h2
						id={ `dpo-set-h-${ section.id }` }
						className="dpo-set-panel__title"
					>
						{ section.title }
					</h2>
					<p className="dpo-set-panel__sub">{ section.nav }</p>
				</div>
			</header>

			<div className="dpo-set-panel__divider" />

			<InfoBanner tone={ section.tone } text={ section.banner } />

			<div className="dpo-set-panel__body">{ children }</div>
		</section>
	);
}
