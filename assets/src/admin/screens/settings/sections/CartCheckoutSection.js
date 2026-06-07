/**
 * Cart & Checkout section — visibility of the chosen options on the cart
 * and checkout pages. The hint line reflects the live toggle state.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import SettingCard from '../SettingCard';
import SwitchRow from '../SwitchRow';

/**
 * CartCheckoutSection.
 *
 * @param {Object}   props        Props.
 * @param {Object}   props.values Settings map.
 * @param {Function} props.set    (key,val) => void.
 * @return {JSX.Element} The section.
 */
export default function CartCheckoutSection( { values, set } ) {
	const visible = __(
		'Options will be visible',
		'productkit-for-woocommerce'
	);
	const hidden = __(
		'Options will be hidden',
		'productkit-for-woocommerce'
	);

	return (
		<div className="pkitfw-set-grid pkitfw-set-grid--2">
			<SettingCard
				icon="cart"
				tone="amber"
				title={ __(
					'Cart Page',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Visibility in cart',
					'productkit-for-woocommerce'
				) }
				hint={ values.hideInCart ? hidden : visible }
			>
				<SwitchRow
					label={ __(
						'Hide options in cart',
						'productkit-for-woocommerce'
					) }
					checked={ values.hideInCart }
					onChange={ ( v ) => set( 'hideInCart', v ) }
				/>
			</SettingCard>

			<SettingCard
				icon="money-alt"
				tone="green"
				title={ __(
					'Checkout Page',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Visibility at checkout',
					'productkit-for-woocommerce'
				) }
				hint={ values.hideInCheckout ? hidden : visible }
			>
				<SwitchRow
					label={ __(
						'Hide options in checkout',
						'productkit-for-woocommerce'
					) }
					checked={ values.hideInCheckout }
					onChange={ ( v ) => set( 'hideInCheckout', v ) }
				/>
			</SettingCard>
		</div>
	);
}
