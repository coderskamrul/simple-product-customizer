/**
 * Price Display section — the options price line and running total line,
 * each in its own card with an enable toggle + custom label.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { Field, TextControl } from '../../../components';
import SettingCard from '../SettingCard';
import SwitchRow from '../SwitchRow';

/**
 * PriceDisplaySection.
 *
 * @param {Object}   props        Props.
 * @param {Object}   props.values Settings map.
 * @param {Function} props.set    (key,val) => void.
 * @return {JSX.Element} The section.
 */
export default function PriceDisplaySection( { values, set } ) {
	return (
		<div className="pkitfw-set-grid pkitfw-set-grid--2">
			<SettingCard
				icon="money-alt"
				tone="blue"
				title={ __(
					'Options Price Line',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'The combined price of selected options',
					'productkit-for-woocommerce'
				) }
			>
				<SwitchRow
					label={ __(
						'Show options price line',
						'productkit-for-woocommerce'
					) }
					checked={ values.showPriceLine }
					onChange={ ( v ) => set( 'showPriceLine', v ) }
				/>
				<Field
					label={ __(
						'Label',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.priceLineLabel }
						onChange={ ( v ) => set( 'priceLineLabel', v ) }
					/>
				</Field>
			</SettingCard>

			<SettingCard
				icon="money-alt"
				tone="green"
				title={ __(
					'Total Price Line',
					'productkit-for-woocommerce'
				) }
				subtitle={ __(
					'Base product price plus all options',
					'productkit-for-woocommerce'
				) }
			>
				<SwitchRow
					label={ __(
						'Show total price line',
						'productkit-for-woocommerce'
					) }
					checked={ values.showTotalLine }
					onChange={ ( v ) => set( 'showTotalLine', v ) }
				/>
				<Field
					label={ __(
						'Label',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ values.totalLineLabel }
						onChange={ ( v ) => set( 'totalLineLabel', v ) }
					/>
				</Field>
			</SettingCard>
		</div>
	);
}
