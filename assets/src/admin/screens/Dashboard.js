/**
 * Dashboard screen — stat tiles (from GET analytics), quick links,
 * getting-started checklist and plugin promo cards.
 *
 * @package DPO\Admin
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import { useConfig } from '../store/ConfigContext';
import { navigate } from '../app/router';
import { Panel, Spinner } from '../components';

/** Sum a metric across the analytics table rows. */
const sum = ( rows, key ) =>
	rows.reduce( ( acc, r ) => acc + ( Number( r[ key ] ) || 0 ), 0 );

/**
 * Dashboard.
 *
 * @return {JSX.Element} The dashboard screen.
 */
export default function Dashboard() {
	const { user, formatPrice, proActive } = useConfig();
	const [ table, setTable ] = useState( [] );
	const [ status, setStatus ] = useState( 'loading' );
	const [ error, setError ] = useState( '' );

	useEffect( () => {
		let cancelled = false;
		api.getAnalytics()
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				setTable( res.table || [] );
				setStatus( 'ready' );
			} )
			.catch( ( e ) => {
				if ( cancelled ) {
					return;
				}
				setError( errorMessage( e ) );
				setStatus( 'error' );
			} );
		return () => {
			cancelled = true;
		};
	}, [] );

	const tiles = [
		{
			label: __( 'Option sets', 'dynamic-product-options-for-woocommerce' ),
			value: table.length,
			icon: 'screenoptions',
		},
		{
			label: __( 'Impressions', 'dynamic-product-options-for-woocommerce' ),
			value: sum( table, 'impressions' ),
			icon: 'visibility',
		},
		{
			label: __( 'Add to cart', 'dynamic-product-options-for-woocommerce' ),
			value: sum( table, 'add_to_cart' ),
			icon: 'cart',
		},
		{
			label: __( 'Revenue', 'dynamic-product-options-for-woocommerce' ),
			value: formatPrice( sum( table, 'revenue' ) ),
			icon: 'chart-line',
		},
	];

	return (
		<div className="dpo-dashboard">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Welcome',
							'dynamic-product-options-for-woocommerce'
						) }
						{ user.name ? `, ${ user.name }` : '' }
					</h1>
					<p className="dpo-screen-sub">
						{ __(
							'Build dynamic, priced product options for your WooCommerce store.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
				<button
					type="button"
					className="dpo-btn dpo-btn--primary"
					onClick={ () => navigate( '/set/new' ) }
				>
					<span
						className="dashicons dashicons-plus-alt2"
						aria-hidden="true"
					/>
					{ __(
						'Create Option Set',
						'dynamic-product-options-for-woocommerce'
					) }
				</button>
			</header>

			{ status === 'loading' && (
				<Panel>
					<Spinner />
				</Panel>
			) }
			{ status === 'error' && (
				<Panel>
					<p className="dpo-error">{ error }</p>
				</Panel>
			) }
			{ status === 'ready' && (
				<div className="dpo-tile-grid">
					{ tiles.map( ( t ) => (
						<div key={ t.label } className="dpo-tile">
							<span
								className={ `dashicons dashicons-${ t.icon } dpo-tile__icon` }
								aria-hidden="true"
							/>
							<div className="dpo-tile__value">
								{ t.value }
							</div>
							<div className="dpo-tile__label">
								{ t.label }
							</div>
						</div>
					) ) }
				</div>
			) }

			<div className="dpo-dash-grid">
				<Panel
					title={ __(
						'Getting started',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<ol className="dpo-steps">
						<li>
							{ __(
								'Create an option set and add fields from the palette.',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
						<li>
							{ __(
								'Assign it to products, categories, tags or brands.',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
						<li>
							{ __(
								'Publish and watch conversions in Analytics.',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
					</ol>
					<button
						type="button"
						className="dpo-btn dpo-btn--ghost"
						onClick={ () => navigate( '/sets' ) }
					>
						{ __(
							'Manage option sets',
							'dynamic-product-options-for-woocommerce'
						) }
					</button>
				</Panel>

				<Panel
					title={ __(
						'Quick links',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<div className="dpo-quicklinks">
						<a href="#/style">
							{ __(
								'Customize global style',
								'dynamic-product-options-for-woocommerce'
							) }
						</a>
						<a href="#/settings">
							{ __(
								'Configure settings',
								'dynamic-product-options-for-woocommerce'
							) }
						</a>
						<a href="#/analytics">
							{ __(
								'View analytics',
								'dynamic-product-options-for-woocommerce'
							) }
						</a>
						{ ! proActive && (
							<a href="#/license">
								{ __(
									'Activate Pro license',
									'dynamic-product-options-for-woocommerce'
								) }
							</a>
						) }
					</div>
				</Panel>

				{ ! proActive && (
					<Panel
						title={ __(
							'Unlock Pro',
							'dynamic-product-options-for-woocommerce'
						) }
						className="dpo-promo"
					>
						<p>
							{ __(
								'Get unlimited choices, advanced formula pricing, font picker, percentage & per-unit pricing and more.',
								'dynamic-product-options-for-woocommerce'
							) }
						</p>
						<a
							className="dpo-btn dpo-btn--primary"
							href="https://wpdeveloper.com"
							target="_blank"
							rel="noreferrer"
						>
							{ __(
								'Upgrade now',
								'dynamic-product-options-for-woocommerce'
							) }
						</a>
					</Panel>
				) }
			</div>
		</div>
	);
}
