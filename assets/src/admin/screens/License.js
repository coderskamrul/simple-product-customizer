/**
 * License screen — wrapped in the unified PageFrame. Pro/Free status moves
 * into the page actions slot; the bespoke `.dpo-screen-head` is gone.
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
			className={ `dpo-status-pill dpo-status-pill--${
				active ? 'live' : 'draft'
			}` }
		>
			{ active
				? __( 'Pro active', 'dynamic-product-options-for-woocommerce' )
				: __( 'Free', 'dynamic-product-options-for-woocommerce' ) }
		</span>
	);

	return (
		<PageFrame
			title={ __( 'License', 'dynamic-product-options-for-woocommerce' ) }
			subtitle={ __(
				'Activate Pro to unlock advanced fields and pricing.',
				'dynamic-product-options-for-woocommerce'
			) }
			actions={ statusPill }
		>
			<Panel
				title={ __(
					'License key',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<Field
					label={ __(
						'Key',
						'dynamic-product-options-for-woocommerce'
					) }
					help={ __(
						'Pro capabilities are enforced server-side via the plugin license; this screen reflects that status.',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ key }
						placeholder="XXXX-XXXX-XXXX-XXXX"
						onChange={ setKey }
					/>
				</Field>
				<div className="dpo-license__actions">
					{ ! active ? (
						<button
							type="button"
							className="dpo-pg-btn dpo-pg-btn--primary"
							onClick={ () => {
								if ( ! key.trim() ) {
									notify(
										__(
											'Enter a license key.',
											'dynamic-product-options-for-woocommerce'
										),
										'error'
									);
									return;
								}
								setActive( true );
								notify(
									__(
										'License stored. Pro features activate once the server validates the key.',
										'dynamic-product-options-for-woocommerce'
									),
									'success'
								);
							} }
						>
							{ __(
								'Activate',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
					) : (
						<button
							type="button"
							className="dpo-pg-btn dpo-pg-btn--ghost"
							onClick={ () => {
								setActive( false );
								notify(
									__(
										'License marked inactive.',
										'dynamic-product-options-for-woocommerce'
									),
									'info'
								);
							} }
						>
							{ __(
								'Deactivate',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
					) }
				</div>
			</Panel>

			<Panel
				title={ __(
					'What Pro unlocks',
					'dynamic-product-options-for-woocommerce'
				) }
				className="dpo-promo"
			>
				<ul className="dpo-feature-list">
					<li>
						{ __(
							'Unlimited choices per field (free caps at 3).',
							'dynamic-product-options-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Font picker & advanced formula fields.',
							'dynamic-product-options-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Percentage, per-unit, per-word & per-char pricing.',
							'dynamic-product-options-for-woocommerce'
						) }
					</li>
					<li>
						{ __(
							'Sale prices on choices & unlimited linked products.',
							'dynamic-product-options-for-woocommerce'
						) }
					</li>
				</ul>
				<a
					className="dpo-pg-btn dpo-pg-btn--primary"
					href="https://wpdeveloper.com"
					target="_blank"
					rel="noreferrer"
				>
					{ __(
						'Get Pro',
						'dynamic-product-options-for-woocommerce'
					) }
				</a>
			</Panel>
		</PageFrame>
	);
}
