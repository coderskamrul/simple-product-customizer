/**
 * Conditional-logic engine.
 *
 * Reads each field's `data-logic-rules` JSON
 * ({ match:'all'|'any', rules:[{ source, operator, value }] }) and toggles
 * `.dpo-hidden` on the field wrapper. Operators per ARCHITECTURE §6:
 * is, is_not, empty, not_empty, contains, not_contains, gt, lt, gte, lte,
 * starts_with, between, checked.
 *
 * Hidden fields are excluded from pricing and required validation by the
 * controller, which reads the visibility map produced here.
 *
 * @package DPO\Store
 */

import { toNumber } from './money';

/**
 * Reduce a selection entry to a comparable scalar string for operators.
 *
 * @param {object|undefined} entry Selection entry for the source field.
 * @return {string} Comparable string ('' when nothing chosen).
 */
function sourceScalar( entry ) {
	if ( ! entry ) {
		return '';
	}
	const v = entry.value;
	if ( v === null || v === undefined ) {
		return '';
	}
	if ( Array.isArray( v ) ) {
		return v
			.map( ( x ) =>
				x && typeof x === 'object'
					? String( x.label !== undefined ? x.label : x.name || '' )
					: String( x )
			)
			.join( ',' );
	}
	if ( typeof v === 'object' ) {
		// datetime { date, time } etc.
		return Object.keys( v )
			.map( ( k ) => String( v[ k ] ) )
			.join( ' ' )
			.trim();
	}
	return String( v );
}

/**
 * Whether the source field currently has any selection/value.
 *
 * @param {object|undefined} entry Source selection entry.
 * @return {boolean} True when non-empty.
 */
function sourceChecked( entry ) {
	if ( ! entry ) {
		return false;
	}
	if (
		Array.isArray( entry.choiceIndexes ) &&
		entry.choiceIndexes.length
	) {
		return true;
	}
	const s = sourceScalar( entry );
	return s !== '' && s !== '0';
}

/**
 * Evaluate one rule against the live selections map.
 *
 * @param {object} rule       { source, operator, value }.
 * @param {object} selections fieldId → selection entry.
 * @return {boolean} Rule outcome.
 */
function evalRule( rule, selections ) {
	const entry = selections[ rule.source ];
	const left = sourceScalar( entry );
	const right = rule.value === undefined ? '' : String( rule.value );
	const op = rule.operator;

	switch ( op ) {
		case 'is':
			return left === right;
		case 'is_not':
			return left !== right;
		case 'empty':
			return left === '';
		case 'not_empty':
			return left !== '';
		case 'contains':
			return left.indexOf( right ) !== -1;
		case 'not_contains':
			return left.indexOf( right ) === -1;
		case 'gt':
			return toNumber( left ) > toNumber( right );
		case 'lt':
			return toNumber( left ) < toNumber( right );
		case 'gte':
			return toNumber( left ) >= toNumber( right );
		case 'lte':
			return toNumber( left ) <= toNumber( right );
		case 'starts_with':
			return left.indexOf( right ) === 0;
		case 'between': {
			const parts = right.split( ',' ).map( ( p ) => toNumber( p ) );
			const n = toNumber( left );
			if ( parts.length < 2 ) {
				return false;
			}
			const lo = Math.min( parts[ 0 ], parts[ 1 ] );
			const hi = Math.max( parts[ 0 ], parts[ 1 ] );
			return n >= lo && n <= hi;
		}
		case 'checked':
			return sourceChecked( entry );
		default:
			return true;
	}
}

/**
 * Parse a field's logic rules from its wrapper.
 *
 * @param {HTMLElement} fieldEl `.dpo-field` wrapper.
 * @return {object|null} { match, rules } or null when no logic.
 */
export function readLogic( fieldEl ) {
	if ( fieldEl.getAttribute( 'data-logic' ) !== 'yes' ) {
		return null;
	}
	const raw = fieldEl.getAttribute( 'data-logic-rules' );
	if ( ! raw ) {
		return null;
	}
	try {
		const parsed = JSON.parse( raw );
		if (
			parsed &&
			Array.isArray( parsed.rules ) &&
			parsed.rules.length
		) {
			return {
				match: parsed.match === 'any' ? 'any' : 'all',
				rules: parsed.rules,
			};
		}
	} catch ( e ) {
		return null;
	}
	return null;
}

/**
 * Decide a field's visibility from its logic + the live selections.
 *
 * @param {object} logic      { match, rules } (from readLogic).
 * @param {object} selections fieldId → selection entry.
 * @return {boolean} True = the field should be visible.
 */
export function isVisible( logic, selections ) {
	if ( ! logic ) {
		return true;
	}
	const results = logic.rules.map( ( r ) => evalRule( r, selections ) );
	if ( logic.match === 'any' ) {
		return results.some( Boolean );
	}
	return results.every( Boolean );
}

/**
 * Apply a visibility decision to a field wrapper.
 *
 * @param {HTMLElement} fieldEl Field wrapper.
 * @param {boolean}     visible Visible flag.
 * @return {void}
 */
export function applyVisibility( fieldEl, visible ) {
	if ( visible ) {
		fieldEl.classList.remove( 'dpo-hidden' );
	} else {
		fieldEl.classList.add( 'dpo-hidden' );
	}
}
