/**
 * The right-hand content card: an accent icon tile + section title and
 * sublabel, a divider, the tinted info banner, then the section body.
 * Purely presentational — the active section supplies `children`.
 *
 * @package
 */

import InfoBanner from './InfoBanner';

/**
 * SectionPanel.
 *
 * @param {Object}      props          Props.
 * @param {Object}      props.section  Section descriptor from config.
 * @param {JSX.Element} props.children Section body.
 * @return {JSX.Element} The panel.
 */
export default function SectionPanel( { section, children } ) {
	return (
		<section
			className="spcus-set-panel"
			aria-labelledby={ `spcus-set-h-${ section.id }` }
		>
			<header className="spcus-set-panel__head">
				<span
					className={ `spcus-set-tile spcus-set-tile--lg spcus-set-tile--${ section.tone }` }
					aria-hidden="true"
				>
					<span
						className={ `dashicons dashicons-${ section.dashicon }` }
					/>
				</span>
				<div>
					<h2
						id={ `spcus-set-h-${ section.id }` }
						className="spcus-set-panel__title"
					>
						{ section.title }
					</h2>
					<p className="spcus-set-panel__sub">{ section.nav }</p>
				</div>
			</header>

			<div className="spcus-set-panel__divider" />

			<InfoBanner tone={ section.tone } text={ section.banner } />

			<div className="spcus-set-panel__body">{ children }</div>
		</section>
	);
}
