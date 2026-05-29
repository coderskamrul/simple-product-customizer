/**
 * Global Style panel — a docked, non-modal left drawer (mirrors the field
 * SettingsDrawer) that themes every storefront option set. Edits update the
 * shared global-style store immediately, so the builder canvas on the right
 * re-renders as a live preview; Save persists tokens + compiled CSS.
 *
 * Original UI: stacked section cards with an icon header — a Dimensions card
 * (slider + custom px inputs for field size and corner radius), a quarter-dot
 * colour-palette picker, and a list of named colour rows.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import {
	X,
	Palette,
	Check,
	SlidersHorizontal,
	Droplets,
} from 'lucide-react';
import { useGlobalStyle } from '../store/globalStyle';
import { useToast } from '../../../store/ToastContext';
import { errorMessage } from '../../../api/client';
import { ColorField, SkeletonForm } from '../../../components';
import {
	PALETTES,
	SIZE_MIN,
	SIZE_MAX,
	RADIUS_MIN,
	RADIUS_MAX,
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
 * Section card with an icon header.
 *
 * @param {Object}      props          Component props.
 * @param {Function}    props.icon     Lucide icon component.
 * @param {string}      props.title    Card title.
 * @param {string}      props.desc     Sub-text.
 * @param {JSX.Element} props.children Card body.
 * @return {JSX.Element} The card.
 */
function Card( { icon: Icon, title, desc, children } ) {
	return (
		<section className="dpo-gs__card">
			<header className="dpo-gs__card-head">
				<span className="dpo-gs__card-icon">
					<Icon size={ 15 } aria-hidden="true" />
				</span>
				<span className="dpo-gs__card-titles">
					<span className="dpo-gs__card-title">{ title }</span>
					{ desc && (
						<span className="dpo-gs__card-desc">{ desc }</span>
					) }
				</span>
			</header>
			<div className="dpo-gs__card-body">{ children }</div>
		</section>
	);
}

/**
 * A custom px dimension control: a label, a numeric px box and a fine slider.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Field label.
 * @param {number}   props.value    Current value.
 * @param {number}   props.min      Min bound.
 * @param {number}   props.max      Max bound.
 * @param {Function} props.onChange (value) => void.
 * @return {JSX.Element} The control.
 */
function PxField( { label, value, min, max, onChange } ) {
	return (
		<div className="dpo-gs__dim">
			<div className="dpo-gs__dim-head">
				<span className="dpo-gs__dim-label">{ label }</span>
				<span className="dpo-gs__px">
					<input
						type="number"
						className="dpo-gs__px-input"
						value={ value }
						min={ min }
						max={ max }
						onChange={ ( e ) => onChange( e.target.value ) }
					/>
					<span className="dpo-gs__px-unit">
						{ __(
							'px',
							'dynamic-product-options-for-woocommerce'
						) }
					</span>
				</span>
			</div>
			<input
				type="range"
				className="dpo-gs__slider"
				min={ min }
				max={ max }
				value={ Number( value ) || min }
				onChange={ ( e ) => onChange( e.target.value ) }
			/>
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
		setSizePx,
		setRadiusPx,
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
										<SkeletonForm fields={ 6 } />
									</div>
								) : (
									<>
										<Card
											icon={ SlidersHorizontal }
											title={ __(
												'Dimensions',
												'dynamic-product-options-for-woocommerce'
											) }
											desc={ __(
												'Set exact pixel values.',
												'dynamic-product-options-for-woocommerce'
											) }
										>
											<PxField
												label={ __(
													'Option Fields Size',
													'dynamic-product-options-for-woocommerce'
												) }
												value={ tokens.sizePx }
												min={ SIZE_MIN }
												max={ SIZE_MAX }
												onChange={ setSizePx }
											/>
											<PxField
												label={ __(
													'Option Fields Shape',
													'dynamic-product-options-for-woocommerce'
												) }
												value={ tokens.radiusPx }
												min={ RADIUS_MIN }
												max={ RADIUS_MAX }
												onChange={ setRadiusPx }
											/>
										</Card>

										<Card
											icon={ Palette }
											title={ __(
												'Color Palette',
												'dynamic-product-options-for-woocommerce'
											) }
											desc={ __(
												'Pick a preset, then fine-tune below.',
												'dynamic-product-options-for-woocommerce'
											) }
										>
											<div className="dpo-gs__dots">
												{ PALETTES.map( ( p ) => {
													const active =
														tokens.palette ===
														p.key;
													const quarters = `conic-gradient(${ p.ramp[ 0 ] } 0 25%, ${ p.ramp[ 1 ] } 0 50%, ${ p.ramp[ 2 ] } 0 75%, ${ p.ramp[ 3 ] } 0)`;
													return (
														<button
															key={ p.key }
															type="button"
															className={ `dpo-gs__dot${
																active
																	? ' is-active'
																	: ''
															}` }
															title={ p.label }
															aria-label={
																p.label
															}
															onClick={ () =>
																applyPalette(
																	p.key
																)
															}
														>
															<span
																className="dpo-gs__dot-fill"
																style={ {
																	background:
																		quarters,
																} }
															/>
															{ active && (
																<span className="dpo-gs__dot-check">
																	<Check
																		size={
																			13
																		}
																		aria-hidden="true"
																	/>
																</span>
															) }
														</button>
													);
												} ) }
											</div>
										</Card>

										<Card
											icon={ Droplets }
											title={ __(
												'Colors',
												'dynamic-product-options-for-woocommerce'
											) }
										>
											<div className="dpo-gs__colors">
												{ COLOR_FIELDS.map( ( f ) => (
													<div
														key={ f.key }
														className="dpo-gs__crow"
													>
														<span className="dpo-gs__crow-label">
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
										</Card>
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
