/**
 * License screen.
 *
 * The actual license logic lives in the separate **ProductKit for WooCommerce
 * Pro** plugin, which serves `pkitfw/v1/license*` endpoints in this same REST
 * namespace. This screen is a thin client over those endpoints:
 *
 *   - On mount it asks for the current snapshot. A rejection (no route) means
 *     the Pro plugin is not installed → render the upgrade promo.
 *   - Activate / Deactivate post to the Pro plugin and reload so the freshly
 *     resolved Pro gate (`proActive`) propagates across the whole SPA.
 *
 * @package
 */

import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useToast } from '../store/ToastContext';
import { Panel, Field, TextControl, PageFrame } from '../components';
import {
	getLicense,
	activateLicense,
	deactivateLicense,
} from '../api/endpoints';
import { errorMessage } from '../api/client';

/**
 * License.
 *
 * @return {JSX.Element} The screen.
 */
export default function License() {
	const { notify } = useToast();

	const [ loading, setLoading ] = useState( true );
	const [ proInstalled, setProInstalled ] = useState( false );
	const [ snapshot, setSnapshot ] = useState( null );
	const [ key, setKey ] = useState( '' );
	const [ busy, setBusy ] = useState( false );

	const active = !! snapshot?.active;

	// Pull the current license state from the Pro plugin on mount.
	useEffect( () => {
		let cancelled = false;
		getLicense()
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				setProInstalled( true );
				setSnapshot( res.license || null );
				if ( res.license?.keySuffix ) {
					// Show a masked hint of the stored key.
					setKey( `••••-••••-••••-${ res.license.keySuffix }` );
				}
			} )
			.catch( () => {
				// No route → Pro plugin absent. Render the promo instead.
				if ( ! cancelled ) {
					setProInstalled( false );
				}
			} )
			.finally( () => {
				if ( ! cancelled ) {
					setLoading( false );
				}
			} );
		return () => {
			cancelled = true;
		};
	}, [] );

	/**
	 * Activate the entered key.
	 *
	 * @return {void}
	 */
	const onActivate = () => {
		const trimmed = key.trim();
		if ( ! trimmed || trimmed.startsWith( '••••' ) ) {
			notify(
				__( 'Enter a license key.', 'productkit-for-woocommerce' ),
				'error'
			);
			return;
		}
		setBusy( true );
		activateLicense( trimmed )
			.then( ( res ) => {
				notify(
					res.message ||
						__(
							'License activated.',
							'productkit-for-woocommerce'
						),
					'success'
				);
				// Reload so the server-resolved Pro gate refreshes everywhere.
				window.location.reload();
			} )
			.catch( ( e ) => {
				notify( errorMessage( e ), 'error' );
				setBusy( false );
			} );
	};

	/**
	 * Release the stored license.
	 *
	 * @return {void}
	 */
	const onDeactivate = () => {
		setBusy( true );
		deactivateLicense()
			.then( ( res ) => {
				notify(
					res.message ||
						__(
							'License deactivated.',
							'productkit-for-woocommerce'
						),
					'info'
				);
				window.location.reload();
			} )
			.catch( ( e ) => {
				notify( errorMessage( e ), 'error' );
				setBusy( false );
			} );
	};

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
			{ proInstalled && (
				<Panel
					title={ __(
						'License key',
						'productkit-for-woocommerce'
					) }
				>
					<Field
						label={ __( 'Key', 'productkit-for-woocommerce' ) }
						help={
							snapshot?.message ||
							__(
								'Enter the license key from your pluginshift account.',
								'productkit-for-woocommerce'
							)
						}
					>
						<TextControl
							value={ key }
							placeholder="XXXX-XXXX-XXXX-XXXX"
							onChange={ setKey }
							disabled={ active || busy }
						/>
					</Field>

					{ active && (
						<ul className="pkitfw-feature-list">
							{ snapshot?.licenseType && (
								<li>
									{ __(
										'Plan:',
										'productkit-for-woocommerce'
									) }{ ' ' }
									{ snapshot.licenseType }
								</li>
							) }
							{ snapshot?.expires && (
								<li>
									{ __(
										'Expires:',
										'productkit-for-woocommerce'
									) }{ ' ' }
									{ snapshot.expires }
								</li>
							) }
						</ul>
					) }

					<div className="pkitfw-license__actions">
						{ ! active ? (
							<button
								type="button"
								className="pkitfw-pg-btn pkitfw-pg-btn--primary"
								disabled={ busy || loading }
								onClick={ onActivate }
							>
								{ busy
									? __(
											'Activating…',
											'productkit-for-woocommerce'
									  )
									: __(
											'Activate',
											'productkit-for-woocommerce'
									  ) }
							</button>
						) : (
							<button
								type="button"
								className="pkitfw-pg-btn pkitfw-pg-btn--ghost"
								disabled={ busy }
								onClick={ onDeactivate }
							>
								{ busy
									? __(
											'Deactivating…',
											'productkit-for-woocommerce'
									  )
									: __(
											'Deactivate',
											'productkit-for-woocommerce'
									  ) }
							</button>
						) }
					</div>
				</Panel>
			) }

			<Panel
				title={
					proInstalled
						? __(
								'What Pro unlocks',
								'productkit-for-woocommerce'
						  )
						: __(
								'Upgrade to Pro',
								'productkit-for-woocommerce'
						  )
				}
				className="pkitfw-promo"
			>
				{ ! proInstalled && ! loading && (
					<p>
						{ __(
							'Install the ProductKit for WooCommerce Pro plugin, then activate your license here to unlock:',
							'productkit-for-woocommerce'
						) }
					</p>
				) }
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
				{ ! active && (
					<a
						className="pkitfw-pg-btn pkitfw-pg-btn--primary"
						href="https://pluginshift.com"
						target="_blank"
						rel="noreferrer"
					>
						{ __( 'Get Pro', 'productkit-for-woocommerce' ) }
					</a>
				) }
			</Panel>
		</PageFrame>
	);
}
