/**
 * Color input pairing a native color picker with a hex text field so the
 * value stays editable/clearable.
 *
 * @package DPO\Admin
 */

/**
 * ColorField.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.value    Hex string (e.g. #ff0000).
 * @param {Function} props.onChange (hex) => void.
 * @param {string}   [props.id]     Element id.
 * @return {JSX.Element} The color control.
 */
export default function ColorField( { value, onChange, id } ) {
	const hex = value || '';
	return (
		<div className="dpo-color-field">
			<input
				type="color"
				className="dpo-color-field__swatch"
				value={ /^#[0-9a-fA-F]{6}$/.test( hex ) ? hex : '#000000' }
				onChange={ ( e ) => onChange( e.target.value ) }
				aria-hidden="true"
				tabIndex={ -1 }
			/>
			<input
				id={ id }
				type="text"
				className="dpo-input dpo-color-field__text"
				value={ hex }
				placeholder="#000000"
				onChange={ ( e ) => onChange( e.target.value ) }
			/>
		</div>
	);
}
