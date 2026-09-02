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
		<div className="spcus-set-grid spcus-set-grid--2">
			<SettingCard
				icon="screenoptions"
				tone="violet"
				title={ __(
					'Select Options Button',
					'simple-product-customizer'
				) }
				subtitle={ __(
					'Behaviour on the shop loop',
					'simple-product-customizer'
				) }
				hint={
					values.shopForceSelect
						? __(
								'Shoppers are sent to the product page to choose options',
								'simple-product-customizer'
						  )
						: __(
								'Default WooCommerce add-to-cart behaviour',
								'simple-product-customizer'
						  )
				}
			>
				<SwitchRow
					label={ __(
						'Force "Select options" on shop loop',
						'simple-product-customizer'
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
					'simple-product-customizer'
				) }
				subtitle={ __(
					'Label shown on the shop loop',
					'simple-product-customizer'
				) }
			>
				<Field
					label={ __(
						'Shop loop button text',
						'simple-product-customizer'
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
