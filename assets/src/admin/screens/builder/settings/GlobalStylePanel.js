/**
 * Global Style panel — a docked, non-modal left drawer (mirrors the field
 * SettingsDrawer) that themes every storefront option set. Edits update the
 * shared global-style store immediately, so the builder canvas on the right
 * re-renders as a live preview; Save persists tokens + compiled CSS.
 *
 * Premium, original UI: Field Size + Shape segmented controls, a colour-palette
 * preset grid, and six named colour pickers.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Palette, Check } from 'lucide-react';
import { useGlobalStyle } from '../store/globalStyle';
import { useToast } from '../../../store/ToastContext';
import { errorMessage } from '../../../api/client';
import { ColorField, Spinner } from '../../../components';
import {
	PALETTES,
	SIZE_OPTIONS,
	SHAPE_OPTIONS,
} from '../store/globalStyleModel';

/** The six customizable colours, in display order. */
const COLOR_FIELDS = [
	{ key: 'text', label: __( 'Text Color', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'primary', label: __( 'Primary', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'border', label: __( 'Field Border', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'fill', label: __( 'Field Fill', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'onPrimary', label: __( 'Over Primary Color', 'dynamic-product-options-for-woocommerce' ) },
	{ key: 'error', label: __( 'Required / Error Color', 'dynamic-product-options-for-woocommerce' ) },
];

/**
 * Segmented control row.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Group label.
 * @param {Array}    props.options  [{ value, label }].
 * @param {string}   props.value    Selected value.
 * @param {Function} props.onChange (value) => void.
 * @return {JSX.Element} The control.
 */
function Segmented( { label, options, value, onChange } ) {
	return (
		<div className="dpo-gs__group">
			<span className="dpo-gs__label">{ label }</span>
			<div className="dpo-gs__seg" role="group">
				{ options.map( ( o ) => (
					<button
						key={ o.value }
						type="button"
						className={ `dpo-gs__seg-btn${
							value === o.value ? ' is-active' : ''
						}` }
						aria-pressed={ value === o.value }
						onClick={ () => onChange( o.value ) }
					>
						{ o.label }
					</button>
				) ) }
			</div>
		</div>
	);
}

/**
 * GlobalStylePanel.
 *
 * @return {JSX.Element} The panel.
 */
export default function GlobalStylePanel() {
	const { notify } = useToast();
	const {
		open,
		loaded,
		saving,
		tokens,
		closePanel,
		setSize,
		setShape,
		applyPalette,
		setColor,
		save,
	} = useGlobalStyle();

	/** Persist + toast. */
	const onSave = () =>
		save( ( kind, err ) =>
			notify(
				kind === 'success'
					? __(
							'Global style saved.',
							'dynamic-product-options-for-woocommerce'
					  )
					: errorMessage( err ),
				kind
			)
		);

	return (
		<Dialog.Root
			open={ open }
			modal={ false }
			onOpenChange={ ( o ) => ! o && closePanel() }
		>
			<AnimatePresence>
				{ open && (
					<Dialog.Content
						asChild
						forceMount
						aria-describedby={ undefined }
						onPointerDownOutside={ ( e ) => e.preventDefault() }
						onInteractOutside={ ( e ) => e.preventDefault() }
						onOpenAutoFocus={ ( e ) => e.preventDefault() }
					>
						<motion.aside
							className="dpo-drawer dpo-drawer--style"
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
									<Palette size={ 18 } aria-hidden="true" />
								</span>
								<Dialog.Title className="dpo-drawer__title">
									{ __(
										'Global Style',
										'dynamic-product-options-for-woocommerce'
									) }
									<span className="dpo-drawer__subtitle">
										{ __(
											'Live preview · applies to all option sets',
											'dynamic-product-options-for-woocommerce'
										) }
									</span>
								</Dialog.Title>
								<button
									type="button"
									className="dpo-drawer__close"
									aria-label={ __(
										'Close',
										'dynamic-product-options-for-woocommerce'
									) }
									onClick={ closePanel }
								>
									<X size={ 18 } />
								</button>
							</header>

							<div className="dpo-drawer__body dpo-gs">
								{ ! loaded ? (
									<div className="dpo-gs__loading">
										<Spinner />
									</div>
								) : (
									<>
										<div className="dpo-gs__grid2">
											<Segmented
												label={ __(
													'Option Fields Size',
													'dynamic-product-options-for-woocommerce'
												) }
												options={ SIZE_OPTIONS }
												value={ tokens.size }
												onChange={ setSize }
											/>
											<Segmented
												label={ __(
													'Option Fields Shape',
													'dynamic-product-options-for-woocommerce'
												) }
												options={ SHAPE_OPTIONS }
												value={ tokens.shape }
												onChange={ setShape }
											/>
										</div>

										<div className="dpo-gs__group">
											<span className="dpo-gs__label">
												{ __(
													'Choose Color Palette',
													'dynamic-product-options-for-woocommerce'
												) }
											</span>
											<div className="dpo-gs__palettes">
												{ PALETTES.map( ( p ) => (
													<button
														key={ p.key }
														type="button"
														className={ `dpo-gs__palette${
															tokens.palette ===
															p.key
																? ' is-active'
																: ''
														}` }
														onClick={ () =>
															applyPalette(
																p.key
															)
														}
													>
														<span className="dpo-gs__palette-head">
															<span className="dpo-gs__palette-name">
																{ p.label }
															</span>
															{ tokens.palette ===
																p.key && (
																<Check
																	size={ 14 }
																	aria-hidden="true"
																/>
															) }
														</span>
														<span className="dpo-gs__ramp">
															{ p.ramp.map(
																( c, i ) => (
																	<span
																		key={
																			i
																		}
																		className="dpo-gs__chip"
																		style={ {
																			background:
																				c,
																		} }
																	/>
																)
															) }
														</span>
													</button>
												) ) }
											</div>
										</div>

										<div className="dpo-gs__group">
											<span className="dpo-gs__label">
												{ __(
													'Customize Colors',
													'dynamic-product-options-for-woocommerce'
												) }
											</span>
											<div className="dpo-gs__colors">
												{ COLOR_FIELDS.map( ( f ) => (
													<div
														key={ f.key }
														className="dpo-gs__color"
													>
														<span className="dpo-gs__color-label">
															{ f.label }
														</span>
														<ColorField
															value={
																tokens
																	.colors[
																	f.key
																]
															}
															onChange={ ( v ) =>
																setColor(
																	f.key,
																	v
																)
															}
														/>
													</div>
												) ) }
											</div>
										</div>
									</>
								) }
							</div>

							<footer className="dpo-gs__foot">
								<button
									type="button"
									className="dpo-btn dpo-btn--ghost"
									onClick={ closePanel }
								>
									{ __(
										'Close',
										'dynamic-product-options-for-woocommerce'
									) }
								</button>
								<button
									type="button"
									className="dpo-btn dpo-btn--primary"
									disabled={ saving || ! loaded }
									onClick={ onSave }
								>
									{ saving
										? __(
												'Saving…',
												'dynamic-product-options-for-woocommerce'
										  )
										: __(
												'Save style',
												'dynamic-product-options-for-woocommerce'
										  ) }
								</button>
							</footer>
						</motion.aside>
					</Dialog.Content>
				) }
			</AnimatePresence>
		</Dialog.Root>
	);
}
