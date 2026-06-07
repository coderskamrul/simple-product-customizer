/**
 * Shop Loop section — how option-bearing products behave on shop/archive
 * pages: force the "Select options" button and customise its text.
 *
 * @package
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
		<div className="pkitfw-set-grid pkitfw-set-grid--2">
			<SettingCard
				icon="screenoptions"
				tone="violet"
				title={ __(
					'Select Options Button',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Behaviour on the shop loop',
					'productkit-for-woocommerce'
				) }
				hint={
					values.shopForceSelect
						? __(
								'Shoppers are sent to the product page to choose options',
								'productkit-for-woocommerce'
						  )
						: __(
								'Default WooCommerce add-to-cart behaviour',
								'productkit-for-woocommerce'
						  )
				}
			>
				<SwitchRow
					label={ __(
						'Force "Select options" on shop loop',
						'productkit-for-woocommerce'
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
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Label shown on the shop loop',
					'productkit-for-woocommerce'
				) }
			>
				<Field
					label={ __(
						'Shop loop button text',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.shopButtonText }
						onChange={ ( v ) => set( 'shopButtonText', v ) }
					/>
				</Field>
			</SettingCard>
		</div>
	);
}
