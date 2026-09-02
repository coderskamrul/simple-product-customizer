/**
 * Accessible on/off switch (checkbox under the hood, styled as a toggle).
 *
 * @package
 */

import useId from '../app/useId';

/**
 * ToggleField.
 *
 * @param {Object}   props          Component props.
 * @param {boolean}  props.checked  Current state.
 * @param {Function} props.onChange (next:boolean) => void.
 * @param {string}   [props.label]  Inline label text.
 * @return {JSX.Element} The toggle.
 */
export default function ToggleField( { checked, onChange, label } ) {
	const id = useId( 'spcus-toggle' );
	return (
		<label className="spcus-toggle" htmlFor={ id }>
			<input
				id={ id }
				type="checkbox"
				className="spcus-toggle__input"
				checked={ !! checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
			<span className="spcus-toggle__track" aria-hidden="true">
				<span className="spcus-toggle__thumb" />
			</span>
			{ label && <span className="spcus-toggle__label">{ label }</span> }
		</label>
	);
}
