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
	const id = useId( 'dpo-toggle' );
	return (
		<label className="dpo-toggle" htmlFor={ id }>
			<input
				id={ id }
				type="checkbox"
				className="dpo-toggle__input"
				checked={ !! checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
			<span className="dpo-toggle__track" aria-hidden="true">
				<span className="dpo-toggle__thumb" />
			</span>
			{ label && <span className="dpo-toggle__label">{ label }</span> }
		</label>
	);
}
