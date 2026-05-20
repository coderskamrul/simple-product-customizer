/**
 * Settings screen — composition root only. A sticky branded header with
 * the primary save action, a left section rail, and the active section
 * rendered inside a tinted content panel. All data lives in useSettings;
 * fonts manage themselves. Every visual concern is delegated to a
 * presentational component under ./settings so this file stays a
 * readable layout map.
 *
 * @package DPO\Admin
 */

import { useState } from '@wordpress/element';
import { Spinner } from '../components';
import { SECTIONS } from './settings/config';
import useSettings from './settings/useSettings';
import SettingsHeader from './settings/SettingsHeader';
import SettingsNav from './settings/SettingsNav';
import SectionPanel from './settings/SectionPanel';
import PriceDisplaySection from './settings/sections/PriceDisplaySection';
import CartCheckoutSection from './settings/sections/CartCheckoutSection';
import ShopLoopSection from './settings/sections/ShopLoopSection';
import UploadRetentionSection from './settings/sections/UploadRetentionSection';
import FontsSection from './settings/sections/FontsSection';

/** Section id → body component. */
const BODIES = {
	price: PriceDisplaySection,
	cart: CartCheckoutSection,
	shop: ShopLoopSection,
	uploads: UploadRetentionSection,
	fonts: FontsSection,
};

/**
 * Settings.
 *
 * @return {JSX.Element} The screen.
 */
export default function Settings() {
	const { status, error, values, dirty, saving, set, save } =
		useSettings();
	const [ activeId, setActiveId ] = useState( SECTIONS[ 0 ].id );

	const section =
		SECTIONS.find( ( s ) => s.id === activeId ) || SECTIONS[ 0 ];
	const Body = BODIES[ section.id ];

	return (
		<div className="dpo-set">
			<SettingsHeader
				saving={ saving }
				dirty={ dirty }
				onSave={ save }
			/>

			<div className="dpo-set__body">
				<SettingsNav
					active={ activeId }
					onSelect={ setActiveId }
				/>

				<SectionPanel section={ section }>
					{ status === 'loading' && (
						<div className="dpo-set-state">
							<Spinner />
						</div>
					) }
					{ status === 'error' && (
						<div className="dpo-set-state">
							<p className="dpo-error">{ error }</p>
						</div>
					) }
					{ status === 'ready' &&
						( section.id === 'fonts' ? (
							<Body />
						) : (
							<Body values={ values } set={ set } />
						) ) }
				</SectionPanel>
			</div>
		</div>
	);
}
