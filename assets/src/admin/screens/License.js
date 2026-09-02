/**
 * License screen — wrapped in the unified PageFrame. Pro/Free status moves
 * into the page actions slot; the bespoke `.spcus-screen-head` is gone.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useConfig } from '../store/ConfigContext';
import { useToast } from '../store/ToastContext';
import { Panel, Field, TextControl, PageFrame } from '../components';

/**
 * License.
 *
 * @return {JSX.Element} The screen.
 */
export default function License() {
	const { proActive, license } = useConfig();
	const { notify } = useToast();
	const [ key, setKey ] = useState( license || '' );
	const [ active, setActive ] = useState( !! proActive );

	const statusPill = (
		<span
			className={ `spcus-status-pill spcus-status-pill--${
				active ? 'live' : 'draft'
			}` }
		>
			{ active
				? __( 'Pro active', 'simple-product-customizer' )
				: __( 'Free', 'simple-product-customizer' ) }
		</span>
	);

	return (
		<PageFrame
			title={ __( 'License', 'simple-product-customizer' ) }
			subtitle={ __(
				'Activate Pro to unlock advanced fields and pricing.',
				'simple-product-customizer'
			) }
			actions={ statusPill }
		>
			<Panel
				title={ __(
					'License key',
					'simple-product-customizer'
				) }
			>
				<Field
					label={ __(
						'Key',
						'simple-product-customizer'
					) }
					help={ __(
						'Pro capabilities are enforced server-side via the plugin license; this screen reflects that status.',
						'simple-product-customizer'
					) }
				>
					<TextControl
						value={ key }
						placeholder="XXXX-XXXX-XXXX-XXXX"
						onChange={ setKey }
					/>
				</Field>
				<div className="spcus-license__actions">
					{ ! active ? (
						<button
							type="button"
							className="spcus-pg-btn spcus-pg-btn--primary"
							onClick={ () => {
								if ( ! key.trim() ) {
									notify(
										__(
											'Enter a license key.',
											'simple-product-customizer'
										),
										'error'
									);
									return;
								}
								setActive( true );
								notify(
									__(
										'License stored. Pro features activate once the server validates the key.',
										'simple-product-customizer'
									),
									'success'
								);
							} }
						>
							{ __(
								'Activate',
								'simple-product-customizer'
							) }
						</button>
					) : (
						<button
							type="button"
							className="spcus-pg-btn spcus-pg-btn--ghost"
							onClick={ () => {
								setActive( false );
								notify(
									__(
										'License marked inactive.',
										'simple-product-customizer'
									),
									'info'
								);
							} }
						>
							{ __(
								'Deactivate',
								'simple-product-customizer'
							) }
						</button>
					) }
				</div>
			</Panel>

			<Panel
				title={ __(
					'What Pro unlocks',
					'simple-product-customizer'
				) }
				className="spcus-promo"
			>
				<ul className="spcus-feature-list">
					<li>
						{ __(
							'Unlimited choices per field (free caps at 3).',
							'simple-product-customizer'
						) }
					</li>
					<li>
						{ __(
							'Font picker & advanced formula fields.',
							'simple-product-customizer'
						) }
					</li>
					<li>
						{ __(
							'Percentage, per-unit, per-word & per-char pricing.',
							'simple-product-customizer'
						) }
					</li>
					<li>
						{ __(
							'Sale prices on choices & unlimited linked products.',
							'simple-product-customizer'
						) }
					</li>
				</ul>
				<a
					className="spcus-pg-btn spcus-pg-btn--primary"
					href="https://wpdeveloper.com"
					target="_blank"
					rel="noreferrer"
				>
					{ __(
						'Get Pro',
						'simple-product-customizer'
					) }
				</a>
			</Panel>
		</PageFrame>
	);
}
