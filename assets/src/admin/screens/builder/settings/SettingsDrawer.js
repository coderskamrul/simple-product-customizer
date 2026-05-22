/**
 * Field settings drawer — a docked, non-modal side panel that slides in when
 * a field is selected, leaving the canvas live so edits preview in real time.
 * Tabs adapt to the field; ESC and the close button dismiss it. On narrow
 * viewports CSS reflows it into a bottom sheet.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getType } from '../../../fields/registry';
import { fieldIcon } from '../../../fields/icons';
import { useBuilder } from '../../../store/BuilderContext';
import { useBuilderUI } from '../store/builderUi';
import GeneralTab from './tabs/GeneralTab';
import StylesTab from './tabs/StylesTab';
import LogicTab from './tabs/LogicTab';

const TABS = [
	{
		key: 'general',
		label: __( 'General', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		key: 'styles',
		label: __( 'Styles', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		key: 'logic',
		label: __(
			'Conditional logic',
			'dynamic-product-options-for-woocommerce'
		),
	},
];

/**
 * SettingsDrawer.
 *
 * @return {JSX.Element} The drawer.
 */
export default function SettingsDrawer() {
	const { selected, dispatch } = useBuilder();
	const { settingsOpen, closeSettings } = useBuilderUI();
	const [ tab, setTab ] = useState( 'general' );

	const open = settingsOpen && !! selected;
	const selectedId = selected ? selected.id : null;

	// Reset to the first tab whenever a different field is opened.
	useEffect( () => {
		setTab( 'general' );
	}, [ selectedId ] );

	/** Close the drawer and clear the canvas selection. */
	const close = () => {
		closeSettings();
		dispatch( { type: 'SELECT', id: null } );
	};

	const def = selected ? getType( selected.type ) : null;
	const Icon = selected ? fieldIcon( selected.type ) : null;

	const patch = ( patchObj ) =>
		dispatch( { type: 'UPDATE', id: selected.id, patch: patchObj } );

	return (
		<Dialog.Root
			open={ open }
			modal={ false }
			onOpenChange={ ( o ) => ! o && close() }
		>
			<AnimatePresence>
				{ open && (
					<Dialog.Content
						asChild
						forceMount
						onPointerDownOutside={ ( e ) => e.preventDefault() }
						onInteractOutside={ ( e ) => e.preventDefault() }
						onOpenAutoFocus={ ( e ) => e.preventDefault() }
					>
						<motion.aside
							className="dpo-drawer"
							initial={ { x: '-100%', opacity: 0.4 } }
							animate={ { x: 0, opacity: 1 } }
							exit={ { x: '-100%', opacity: 0.4 } }
							transition={ {
								duration: 0.26,
								ease: [ 0.16, 1, 0.3, 1 ],
							} }
						>
							<header className="dpo-drawer__head">
								<span className="dpo-drawer__icon">
									{ Icon && (
										<Icon size={ 18 } aria-hidden="true" />
									) }
								</span>
								<Dialog.Title className="dpo-drawer__title">
									{ selected
										? selected.label || def.label
										: '' }
									<span className="dpo-drawer__subtitle">
										{ def && def.label }
									</span>
								</Dialog.Title>
								<button
									type="button"
									className="dpo-drawer__close"
									aria-label={ __(
										'Close',
										'dynamic-product-options-for-woocommerce'
									) }
									onClick={ close }
								>
									<X size={ 18 } />
								</button>
							</header>

							<div className="dpo-drawer__tabs" role="tablist">
								{ TABS.map( ( t ) => (
									<button
										key={ t.key }
										type="button"
										role="tab"
										aria-selected={ tab === t.key }
										className={ `dpo-drawer__tab${
											tab === t.key ? ' is-active' : ''
										}` }
										onClick={ () => setTab( t.key ) }
									>
										{ t.label }
									</button>
								) ) }
							</div>

							<div className="dpo-drawer__body">
								{ selected && tab === 'general' && (
									<GeneralTab
										node={ selected }
										patch={ patch }
									/>
								) }
								{ selected && tab === 'styles' && (
									<StylesTab
										node={ selected }
										patch={ patch }
									/>
								) }
								{ selected && tab === 'logic' && (
									<LogicTab
										node={ selected }
										patch={ patch }
									/>
								) }
							</div>
						</motion.aside>
					</Dialog.Content>
				) }
			</AnimatePresence>
		</Dialog.Root>
	);
}
