/**
 * Shop Loop section — how option-bearing products behave on shop/archive
 * pages: force the "Select options" button and customise its text.
 *
 * @package DPO\Admin
 */

import { __ } from '@wordpress/i18n';
import { Field, TextControl } from '../../../components';
import SettingCard from '../SettingCard';
import SwitchRow from '../SwitchRow';

/**
 * ShopLoopSection.
 *
 * @param {Object}   props        Props.
 * @param {Object}   props.values Settings map.
 * @param {Function} props.set    (key,val) => void.
 * @return {JSX.Element} The section.
 */
export default function ShopLoopSection( { values, set } ) {
	return (
		<div className="dpo-set-grid dpo-set-grid--2">
			<SettingCard
				icon="screenoptions"
				tone="violet"
				title={ __(
					'Select Options Button',
					'dynamic-product-options-for-woocommerce'
				) }
				subtitle={ __(
					'Behaviour on the shop loop',
					'dynamic-product-options-for-woocommerce'
				) }
				hint={
					values.shopForceSelect
						? __(
								'Shoppers are sent to the product page to choose options',
								'dynamic-product-options-for-woocommerce'
						  )
						: __(
								'Default WooCommerce add-to-cart behaviour',
								'dynamic-product-options-for-woocommerce'
						  )
				}
			>
				<SwitchRow
					label={ __(
						'Force "Select options" on shop loop',
						'dynamic-product-options-for-woocommerce'
					) }
					checked={ values.shopForceSelect }
					onChange={ ( v ) => set( 'shopForceSelect', v ) }
				/>
			</SettingCard>

			<SettingCard
				icon="edit"
				tone="blue"
				title={ __(
					'Button Text',
					'dynamic-product-options-for-woocommerce'
				) }
				subtitle={ __(
					'Label shown on the shop loop',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<Field
					label={ __(
						'Shop loop button text',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.shopButtonText }
						onChange={ ( v ) =>
							set( 'shopButtonText', v )
						}
					/>
				</Field>
			</SettingCard>
		</div>
	);
}
