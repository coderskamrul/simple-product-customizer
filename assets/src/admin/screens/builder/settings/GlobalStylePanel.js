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
import { X, Palette, Check, SlidersHorizontal, Droplets } from 'lucide-react';
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
	{
		key: 'text',
		label: __( 'Text Color', 'productkit-for-woocommerce' ),
	},
	{
		key: 'primary',
		label: __( 'Primary', 'productkit-for-woocommerce' ),
	},
	{
		key: 'border',
		label: __( 'Field Border', 'productkit-for-woocommerce' ),
	},
	{
		key: 'fill',
		label: __( 'Field Fill', 'productkit-for-woocommerce' ),
	},
	{
		key: 'onPrimary',
		label: __(
			'Over Primary Color',
			'productkit-for-woocommerce'
		),
	},
	{
		key: 'error',
		label: __(
			'Required / Error Color',
			'productkit-for-woocommerce'
		),
	},
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
		<section className="pkitfw-gs__card">
			<header className="pkitfw-gs__card-head">
				<span className="pkitfw-gs__card-icon">
					<Icon size={ 15 } aria-hidden="true" />
				</span>
				<span className="pkitfw-gs__card-titles">
					<span className="pkitfw-gs__card-title">{ title }</span>
					{ desc && (
						<span className="pkitfw-gs__card-desc">{ desc }</span>
					) }
				</span>
			</header>
			<div className="pkitfw-gs__card-body">{ children }</div>
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
		<div className="pkitfw-gs__dim">
			<div className="pkitfw-gs__dim-head">
				<span className="pkitfw-gs__dim-label">{ label }</span>
				<span className="pkitfw-gs__px">
					<input
						type="number"
						className="pkitfw-gs__px-input"
						value={ value }
						min={ min }
						max={ max }
						onChange={ ( e ) => onChange( e.target.value ) }
					/>
					<span className="pkitfw-gs__px-unit">
						{ __(
							'px',
							'productkit-for-woocommerce'
						) }
					</span>
				</span>
			</div>
			<input
				type="range"
				className="pkitfw-gs__slider"
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
							'productkit-for-woocommerce'
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
							className="pkitfw-drawer pkitfw-drawer--style"
							initial={ { x: '-100%', opacity: 0.4 } }
							animate={ { x: 0, opacity: 1 } }
							exit={ { x: '-100%', opacity: 0.4 } }
							transition={ {
								duration: 0.26,
								ease: [ 0.16, 1, 0.3, 1 ],
							} }
						>
							<header className="pkitfw-drawer__head">
								<span className="pkitfw-drawer__icon">
									<Palette size={ 18 } aria-hidden="true" />
								</span>
								<Dialog.Title className="pkitfw-drawer__title">
									{ __(
										'Global Style',
										'productkit-for-woocommerce'
									) }
									<span className="pkitfw-drawer__subtitle">
										{ __(
											'Live preview · applies to all option sets',
											'productkit-for-woocommerce'
										) }
									</span>
								</Dialog.Title>
								<button
									type="button"
									className="pkitfw-drawer__close"
									aria-label={ __(
										'Close',
										'productkit-for-woocommerce'
									) }
									onClick={ closePanel }
								>
									<X size={ 18 } />
								</button>
							</header>

							<div className="pkitfw-drawer__body pkitfw-gs">
								{ ! loaded ? (
									<div className="pkitfw-gs__loading">
										<SkeletonForm fields={ 6 } />
									</div>
								) : (
									<>
										<Card
											icon={ SlidersHorizontal }
											title={ __(
												'Dimensions',
												'productkit-for-woocommerce'
											) }
											desc={ __(
												'Set exact pixel values.',
												'productkit-for-woocommerce'
											) }
										>
											<PxField
												label={ __(
													'Option Fields Size',
													'productkit-for-woocommerce'
												) }
												value={ tokens.sizePx }
												min={ SIZE_MIN }
												max={ SIZE_MAX }
												onChange={ setSizePx }
											/>
											<PxField
												label={ __(
													'Option Fields Shape',
													'productkit-for-woocommerce'
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
												'productkit-for-woocommerce'
											) }
											desc={ __(
												'Pick a preset, then fine-tune below.',
												'productkit-for-woocommerce'
											) }
										>
											<div className="pkitfw-gs__dots">
												{ PALETTES.map( ( p ) => {
													const active =
														tokens.palette ===
														p.key;
													const quarters = `conic-gradient(${ p.ramp[ 0 ] } 0 25%, ${ p.ramp[ 1 ] } 0 50%, ${ p.ramp[ 2 ] } 0 75%, ${ p.ramp[ 3 ] } 0)`;
													return (
														<button
															key={ p.key }
															type="button"
															className={ `pkitfw-gs__dot${
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
																className="pkitfw-gs__dot-fill"
																style={ {
																	background:
																		quarters,
																} }
															/>
															{ active && (
																<span className="pkitfw-gs__dot-check">
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
												'productkit-for-woocommerce'
											) }
										>
											<div className="pkitfw-gs__colors">
												{ COLOR_FIELDS.map( ( f ) => (
													<div
														key={ f.key }
														className="pkitfw-gs__crow"
													>
														<span className="pkitfw-gs__crow-label">
															{ f.label }
														</span>
														<ColorField
															value={
																tokens.colors[
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

							<footer className="pkitfw-gs__foot">
								<button
									type="button"
									className="pkitfw-btn pkitfw-btn--ghost"
									onClick={ closePanel }
								>
									{ __(
										'Close',
										'productkit-for-woocommerce'
									) }
								</button>
								<button
									type="button"
									className="pkitfw-btn pkitfw-btn--primary"
									disabled={ saving || ! loaded }
									onClick={ onSave }
								>
									{ saving
										? __(
												'Saving…',
												'productkit-for-woocommerce'
										  )
										: __(
												'Save style',
												'productkit-for-woocommerce'
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
