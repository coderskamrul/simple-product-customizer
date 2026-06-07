/**
 * License screen — wrapped in the unified PageFrame. Pro/Free status moves
 * into the page actions slot; the bespoke `.pkitfw-screen-head` is gone.
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
			className={ `pkitfw-status-pill pkitfw-status-pill--${
				active ? 'live' : 'draft'
			}` }
		>
			{ active
				? __( 'Pro active', 'productkit-for-woocommerce' )
				: __( 'Free', 'productkit-for-woocommerce' ) }
		</span>
	);

	return (
		<PageFrame
			title={ __( 'License', 'productkit-for-woocommerce' ) }
			subtitle={ __(
				'Activate Pro to unlock advanced fields and pricing.',
				'productkit-for-woocommerce'
			) }
			actions={ statusPill }
		>
			<Panel
				title={ __(
					'License key',
					'productkit-for-woocommerce'
				) }
			>
				<Field
					label={ __(
						'Key',
						'productkit-for-woocommerce'
					) }
					help={ __(
						'Pro capabilities are enforced server-side via the plugin license; this screen reflects that status.',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ key }
						placeholder="XXXX-XXXX-XXXX-XXXX"
						onChange={ setKey }
					/>
				</Field>
				<div className="pkitfw-license__actions">
					{ ! active ? (
						<button
							type="button"
							className="pkitfw-pg-btn pkitfw-pg-btn--primary"
							onClick={ () => {
								if ( ! key.trim() ) {
									notify(
										__(
											'Enter a license key.',
											'productkit-for-woocommerce'
										),
										'error'
									);
									return;
								}
								setActive( true );
								notify(
									__(
										'License stored. Pro features activate once the server validates the key.',
										'productkit-for-woocommerce'
									),
									'success'
								);
							} }
						>
							{ __(
								'Activate',
								'productkit-for-woocommerce'
							) }
						</button>
					) : (
						<button
							type="button"
							className="pkitfw-pg-btn pkitfw-pg-btn--ghost"
							onClick={ () => {
								setActive( false );
								notify(
									__(
										'License marked inactive.',
										'productkit-for-woocommerce'
									),
									'info'
								);
							} }
						>
							{ __(
								'Deactivate',
								'productkit-for-woocommerce'
							) }
						</button>
					) }
				</div>
			</Panel>

			<Panel
				title={ __(
					'What Pro unlocks',
					'productkit-for-woocommerce'
				) }
				className="pkitfw-promo"
			>
				<ul className="pkitfw-feature-list">
					<li>
						{ __(
							'Unlimited choices per field (free caps at 3).',
							'productkit-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Font picker & advanced formula fields.',
							'productkit-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Percentage, per-unit, per-word & per-char pricing.',
							'productkit-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Sale prices on choices & unlimited linked products.',
							'productkit-for-woocommerce'
						) }
					</li>
				</ul>
				<a
					className="pkitfw-pg-btn pkitfw-pg-btn--primary"
					href="https://wpdeveloper.com"
					target="_blank"
					rel="noreferrer"
				>
					{ __(
						'Get Pro',
						'productkit-for-woocommerce'
					) }
				</a>
			</Panel>
		</PageFrame>
	);
}
