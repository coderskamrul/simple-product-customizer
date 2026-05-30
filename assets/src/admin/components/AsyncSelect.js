/**
 * Debounced async multiselect. Queries a fetcher on keystroke, shows a
 * results dropdown, and renders selected items as removable chips.
 *
 * @package
 */

import { useState, useEffect, useRef, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { errorMessage } from '../api/client';

/**
 * AsyncSelect.
 *
 * @param {Object}   props               Component props.
 * @param {Array}    props.value         Selected items [{id,label}].
 * @param {Function} props.onChange      (nextItems) => void.
 * @param {Function} props.fetcher       async (term) => items[].
 * @param {string}   [props.placeholder] Input placeholder.
 * @param {boolean}  [props.single]      Single-select mode.
 * @param {number}   [props.max]         Optional cap on selection count.
 * @return {JSX.Element} The control.
 */
export default function AsyncSelect( {
	value = [],
	onChange,
	fetcher,
	placeholder,
	single = false,
	max = 0,
} ) {
	const [ term, setTerm ] = useState( '' );
	const [ results, setResults ] = useState( [] );
	const [ busy, setBusy ] = useState( false );
	const [ open, setOpen ] = useState( false );
	const [ err, setErr ] = useState( '' );
	const timer = useRef( null );
	const boxRef = useRef( null );

	useEffect( () => {
		const onDoc = ( e ) => {
			if ( boxRef.current && ! boxRef.current.contains( e.target ) ) {
				setOpen( false );
			}
		};
		document.addEventListener( 'mousedown', onDoc );
		return () => document.removeEventListener( 'mousedown', onDoc );
	}, [] );

	const runSearch = useCallback(
		( q ) => {
			if ( timer.current ) {
				window.clearTimeout( timer.current );
			}
			timer.current = window.setTimeout( async () => {
				setBusy( true );
				setErr( '' );
				try {
					const items = await fetcher( q );
					setResults( items || [] );
					setOpen( true );
				} catch ( e ) {
					setErr( errorMessage( e ) );
				} finally {
					setBusy( false );
				}
			}, 300 );
		},
		[ fetcher ]
	);

	const selectedIds = new Set( value.map( ( v ) => v.id ) );
	const capped = max > 0 && value.length >= max;

	/**
	 * Add an item to the selection (respecting single/max).
	 *
	 * @param {Object} item Result row.
	 * @return {void}
	 */
	const add = ( item ) => {
		if ( single ) {
			onChange( [ item ] );
		} else if ( ! selectedIds.has( item.id ) && ! capped ) {
			onChange( [ ...value, item ] );
		}
		setTerm( '' );
		setResults( [] );
		setOpen( false );
	};

	/**
	 * Remove an item from the selection.
	 *
	 * @param {number|string} id Item id.
	 * @return {void}
	 */
	const remove = ( id ) => onChange( value.filter( ( v ) => v.id !== id ) );

	return (
		<div className="dpo-async-select" ref={ boxRef }>
			<div className="dpo-async-select__chips">
				{ value.map( ( v ) => (
					<span key={ v.id } className="dpo-chip">
						{ v.img && (
							<img
								className="dpo-chip__img"
								src={ v.img }
								alt=""
							/>
						) }
						<span className="dpo-chip__label">{ v.label }</span>
						<button
							type="button"
							className="dpo-chip__x"
							onClick={ () => remove( v.id ) }
							aria-label={ __(
								'Remove',
								'dynamic-product-options-for-woocommerce'
							) }
						>
							×
						</button>
					</span>
				) ) }
			</div>
			<input
				type="text"
				className="dpo-input"
				value={ term }
				placeholder={
					capped
						? __(
								'Selection limit reached',
								'dynamic-product-options-for-woocommerce'
						  )
						: placeholder ||
						  __(
								'Type to search…',
								'dynamic-product-options-for-woocommerce'
						  )
				}
				disabled={ capped }
				onChange={ ( e ) => {
					setTerm( e.target.value );
					runSearch( e.target.value );
				} }
				onFocus={ () => results.length && setOpen( true ) }
			/>
			{ open && (
				<ul className="dpo-async-select__menu" role="listbox">
					{ busy && (
						<li className="dpo-async-select__msg">
							{ __(
								'Searching…',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
					) }
					{ ! busy && err && (
						<li className="dpo-async-select__msg dpo-async-select__msg--err">
							{ err }
						</li>
					) }
					{ ! busy && ! err && results.length === 0 && (
						<li className="dpo-async-select__msg">
							{ __(
								'No results.',
								'dynamic-product-options-for-woocommerce'
							) }
						</li>
					) }
					{ ! busy &&
						results.map( ( r ) => (
							<li key={ r.id }>
								<button
									type="button"
									className="dpo-async-select__opt"
									disabled={ selectedIds.has( r.id ) }
									onClick={ () => add( r ) }
								>
									{ r.img && <img src={ r.img } alt="" /> }
									<span>{ r.label }</span>
								</button>
							</li>
						) ) }
				</ul>
			) }
		</div>
	);
}
