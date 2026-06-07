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
			className="pkitfw-set-panel"
			aria-labelledby={ `pkitfw-set-h-${ section.id }` }
		>
			<header className="pkitfw-set-panel__head">
				<span
					className={ `pkitfw-set-tile pkitfw-set-tile--lg pkitfw-set-tile--${ section.tone }` }
					aria-hidden="true"
				>
					<span
						className={ `dashicons dashicons-${ section.dashicon }` }
					/>
				</span>
				<div>
					<h2
						id={ `pkitfw-set-h-${ section.id }` }
						className="pkitfw-set-panel__title"
					>
						{ section.title }
					</h2>
					<p className="pkitfw-set-panel__sub">{ section.nav }</p>
				</div>
			</header>

			<div className="pkitfw-set-panel__divider" />

			<InfoBanner tone={ section.tone } text={ section.banner } />

			<div className="pkitfw-set-panel__body">{ children }</div>
		</section>
	);
}
