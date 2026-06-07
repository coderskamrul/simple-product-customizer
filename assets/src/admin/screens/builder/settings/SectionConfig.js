/**
 * General-tab config for the Section container. Mirrors the reference design:
 * a Style switch (plain Section vs. collapsible Accordion) and — for the
 * accordion — its Initial State (open or closed). Values are written to the
 * exact `config` keys SectionField.php, the canvas chrome and the store
 * `wireSection` widget consume, so the builder and storefront stay in sync.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { Field } from '../../../components';

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
		<div className="pkitfw-seg" role="radiogroup">
			{ options.map( ( opt ) => (
				<button
					key={ opt.value }
					type="button"
					role="radio"
					aria-checked={ value === opt.value }
					className={ `pkitfw-seg__btn${
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
 * SectionConfig.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The config block.
 */
export default function SectionConfig( { node, patch } ) {
	const cfg = node.config || {};
	const style = cfg.style === 'accordion' ? 'accordion' : 'section';
	const initialState = cfg.initialState === 'close' ? 'close' : 'open';
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	return (
		<div className="pkitfw-settings__grid2">
			<Field
				label={ __(
					'Style',
					'productkit-for-woocommerce'
				) }
			>
				<Segmented
					value={ style }
					onChange={ ( v ) => setKey( 'style', v ) }
					options={ [
						{
							value: 'section',
							label: __(
								'Section',
								'productkit-for-woocommerce'
							),
						},
						{
							value: 'accordion',
							label: __(
								'Accordion',
								'productkit-for-woocommerce'
							),
						},
					] }
				/>
			</Field>

			{ style === 'accordion' && (
				<Field
					label={ __(
						'Initial state',
						'productkit-for-woocommerce'
					) }
				>
					<Segmented
						value={ initialState }
						onChange={ ( v ) => setKey( 'initialState', v ) }
						options={ [
							{
								value: 'open',
								label: __(
									'Open',
									'productkit-for-woocommerce'
								),
							},
							{
								value: 'close',
								label: __(
									'Close',
									'productkit-for-woocommerce'
								),
							},
						] }
					/>
				</Field>
			) }
		</div>
	);
}
