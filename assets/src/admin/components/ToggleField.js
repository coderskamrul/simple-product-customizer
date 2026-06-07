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
	const id = useId( 'pkitfw-toggle' );
	return (
		<label className="pkitfw-toggle" htmlFor={ id }>
			<input
				id={ id }
				type="checkbox"
				className="pkitfw-toggle__input"
				checked={ !! checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
			<span className="pkitfw-toggle__track" aria-hidden="true">
				<span className="pkitfw-toggle__thumb" />
			</span>
			{ label && <span className="pkitfw-toggle__label">{ label }</span> }
		</label>
	);
}
