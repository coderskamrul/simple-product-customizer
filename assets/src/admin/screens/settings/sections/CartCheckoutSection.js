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
		'simple-product-customizer'
	);
	const hidden = __(
		'Options will be hidden',
		'simple-product-customizer'
	);

	return (
		<div className="spcus-set-grid spcus-set-grid--2">
			<SettingCard
				icon="cart"
				tone="amber"
				title={ __(
					'Cart Page',
					'simple-product-customizer'
				) }
				subtitle={ __(
					'Visibility in cart',
					'simple-product-customizer'
				) }
				hint={ values.hideInCart ? hidden : visible }
			>
				<SwitchRow
					label={ __(
						'Hide options in cart',
						'simple-product-customizer'
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
					'simple-product-customizer'
				) }
				subtitle={ __(
					'Visibility at checkout',
					'simple-product-customizer'
				) }
				hint={ values.hideInCheckout ? hidden : visible }
			>
				<SwitchRow
					label={ __(
						'Hide options in checkout',
						'simple-product-customizer'
					) }
					checked={ values.hideInCheckout }
					onChange={ ( v ) => set( 'hideInCheckout', v ) }
				/>
			</SettingCard>
		</div>
	);
}
