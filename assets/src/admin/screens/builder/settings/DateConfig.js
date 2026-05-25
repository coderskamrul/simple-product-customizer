/**
 * General-tab config for the Date field. Groups the picker's behaviour into
 * clear sections — pricing, display format, the selectable date window, and the
 * "block these dates" rules (today, specific dates, weekdays, month-days).
 *
 * The control surface is deliberately our own (segmented range modes + toggle
 * chips) rather than a clone of any third-party picker UI. Every value is
 * written to the exact `config` keys DateField.php + the store `wireDate`
 * widget consume; pricing lives on choices[0] like the other value fields.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { X } from 'lucide-react';
import {
	Field,
	SelectControl,
	ToggleField,
	DatePicker,
} from '../../../components';
import ValuePricing from './ValuePricing';

/** Selectable display formats (value = PHP/flatpickr token, label = sample). */
const DATE_FORMATS = [
	{
		value: 'd/m/Y',
		label: __(
			'DD/MM/YYYY (31/07/2026)',
			'dynamic-product-options-for-woocommerce'
		),
	},
	{
		value: 'm/d/Y',
		label: __(
			'MM/DD/YYYY (07/31/2026)',
			'dynamic-product-options-for-woocommerce'
		),
	},
	{
		value: 'Y-m-d',
		label: __(
			'YYYY-MM-DD (2026-07-31)',
			'dynamic-product-options-for-woocommerce'
		),
	},
	{
		value: 'd-m-Y',
		label: __(
			'DD-MM-YYYY (31-07-2026)',
			'dynamic-product-options-for-woocommerce'
		),
	},
	{
		value: 'F j, Y',
		label: __(
			'Month D, YYYY (July 31, 2026)',
			'dynamic-product-options-for-woocommerce'
		),
	},
	{
		value: 'j F Y',
		label: __(
			'D Month YYYY (31 July 2026)',
			'dynamic-product-options-for-woocommerce'
		),
	},
];

/** Range-bound modes shared by the min + max selectors. */
const RANGE_MODES = [
	{
		value: 'none',
		label: __( 'None', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		value: 'today',
		label: __( 'Today', 'dynamic-product-options-for-woocommerce' ),
	},
	{
		value: 'custom',
		label: __( 'Custom', 'dynamic-product-options-for-woocommerce' ),
	},
];

/** Weekday chips (index = PHP/flatpickr day-of-week, 0 = Sunday). */
const WEEKDAYS = [
	{ value: 0, label: __( 'Sun', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 1, label: __( 'Mon', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 2, label: __( 'Tue', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 3, label: __( 'Wed', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 4, label: __( 'Thu', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 5, label: __( 'Fri', 'dynamic-product-options-for-woocommerce' ) },
	{ value: 6, label: __( 'Sat', 'dynamic-product-options-for-woocommerce' ) },
];

/** Days-of-month, 1–31. */
const MONTH_DAYS = Array.from( { length: 31 }, ( _, i ) => i + 1 );

/**
 * Small segmented (radio-like) button group.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.value    Selected value.
 * @param {Array}    props.options  [{ value, label }].
 * @param {Function} props.onChange (value) => void.
 * @return {JSX.Element} The control.
 */
function Segmented( { value, options, onChange } ) {
	return (
		<div className="dpo-seg" role="radiogroup">
			{ options.map( ( opt ) => (
				<button
					key={ opt.value }
					type="button"
					role="radio"
					aria-checked={ value === opt.value }
					className={ `dpo-seg__btn${
						value === opt.value ? ' is-active' : ''
					}` }
					onClick={ () => onChange( opt.value ) }
				>
					{ opt.label }
				</button>
			) ) }
		</div>
	);
}

/**
 * Toggleable chip grid for a numeric multi-select (weekdays / month-days).
 *
 * @param {Object}   props          Component props.
 * @param {number[]} props.value    Selected values.
 * @param {Array}    props.options  [{ value, label }].
 * @param {Function} props.onChange (next:number[]) => void.
 * @return {JSX.Element} The control.
 */
function ChipGrid( { value, options, onChange } ) {
	const selected = Array.isArray( value ) ? value : [];
	const toggle = ( v ) =>
		onChange(
			selected.includes( v )
				? selected.filter( ( x ) => x !== v )
				: [ ...selected, v ]
		);

	return (
		<div className="dpo-daychips">
			{ options.map( ( opt ) => {
				const v = typeof opt === 'object' ? opt.value : opt;
				const label = typeof opt === 'object' ? opt.label : opt;
				return (
					<button
						key={ v }
						type="button"
						className={ `dpo-daychip${
							selected.includes( v ) ? ' is-active' : ''
						}` }
						aria-pressed={ selected.includes( v ) }
						onClick={ () => toggle( v ) }
					>
						{ label }
					</button>
				);
			} ) }
		</div>
	);
}

/**
 * DateConfig.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.node          Selected node.
 * @param {Function} props.patch         (partialNode) => void.
 * @param {boolean}  [props.showPricing] Render the pricing panel (default true;
 *                                       the combined Date & Time field renders
 *                                       pricing once at the top instead).
 * @return {JSX.Element} The config block.
 */
export default function DateConfig( { node, patch, showPricing = true } ) {
	const cfg = node.config || {};
	const format = cfg.format || 'd/m/Y';
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	const disableDates = Array.isArray( cfg.disableDates )
		? cfg.disableDates
		: [];

	const addDisableDate = ( str ) => {
		if ( str && ! disableDates.includes( str ) ) {
			setKey( 'disableDates', [ ...disableDates, str ] );
		}
	};
	const removeDisableDate = ( str ) =>
		setKey(
			'disableDates',
			disableDates.filter( ( d ) => d !== str )
		);

	return (
		<>
			{ showPricing && <ValuePricing node={ node } patch={ patch } /> }

			<div className="dpo-settings__group">
				<p className="dpo-field-group__title">
					{ __(
						'Display',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<Field
					label={ __(
						'Date format',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<SelectControl
						value={ format }
						options={ DATE_FORMATS }
						onChange={ ( v ) => setKey( 'format', v ) }
					/>
				</Field>
			</div>

			<div className="dpo-settings__group">
				<p className="dpo-field-group__title">
					{ __(
						'Selectable range',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<div className="dpo-settings__grid2">
					<Field
						label={ __(
							'Earliest date',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<div className="dpo-daterange">
							<Segmented
								value={ cfg.minMode || 'none' }
								options={ RANGE_MODES }
								onChange={ ( v ) => setKey( 'minMode', v ) }
							/>
							{ cfg.minMode === 'custom' && (
								<DatePicker
									value={ cfg.minDate || '' }
									dateFormat={ format }
									onChange={ ( v ) => setKey( 'minDate', v ) }
								/>
							) }
						</div>
					</Field>
					<Field
						label={ __(
							'Latest date',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<div className="dpo-daterange">
							<Segmented
								value={ cfg.maxMode || 'none' }
								options={ RANGE_MODES }
								onChange={ ( v ) => setKey( 'maxMode', v ) }
							/>
							{ cfg.maxMode === 'custom' && (
								<DatePicker
									value={ cfg.maxDate || '' }
									dateFormat={ format }
									onChange={ ( v ) => setKey( 'maxDate', v ) }
								/>
							) }
						</div>
					</Field>
				</div>
				<div className="dpo-settings__toggle-row">
					<ToggleField
						checked={ !! cfg.disableToday }
						onChange={ ( v ) => setKey( 'disableToday', v ) }
						label={ __(
							"Block today's date",
							'dynamic-product-options-for-woocommerce'
						) }
					/>
				</div>
			</div>

			<div className="dpo-settings__group">
				<p className="dpo-field-group__title">
					{ __(
						'Blocked dates',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<Field
					label={ __(
						'Add a date to block',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<DatePicker
						value=""
						dateFormat={ format }
						placeholder={ __(
							'Pick a date…',
							'dynamic-product-options-for-woocommerce'
						) }
						onChange={ addDisableDate }
					/>
				</Field>
				{ disableDates.length > 0 && (
					<div className="dpo-daychips dpo-daychips--dates">
						{ disableDates.map( ( d ) => (
							<span key={ d } className="dpo-datechip">
								{ d }
								<button
									type="button"
									aria-label={ __(
										'Remove',
										'dynamic-product-options-for-woocommerce'
									) }
									onClick={ () => removeDisableDate( d ) }
								>
									<X size={ 12 } />
								</button>
							</span>
						) ) }
					</div>
				) }
			</div>

			<div className="dpo-settings__group">
				<p className="dpo-field-group__title">
					{ __(
						'Blocked weekdays',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<ChipGrid
					value={ cfg.disableWeekdays }
					options={ WEEKDAYS }
					onChange={ ( v ) => setKey( 'disableWeekdays', v ) }
				/>
			</div>

			<div className="dpo-settings__group">
				<p className="dpo-field-group__title">
					{ __(
						'Blocked days of the month',
						'dynamic-product-options-for-woocommerce'
					) }
				</p>
				<ChipGrid
					value={ cfg.disableMonthlyDays }
					options={ MONTH_DAYS }
					onChange={ ( v ) => setKey( 'disableMonthlyDays', v ) }
				/>
			</div>
		</>
	);
}
