<?php
/**
 * Advanced formula price field (Pro only).
 *
 * @package SPCUS
 */

namespace SPCUS\Fields\Type;

use SPCUS\Core\Capabilities;
use SPCUS\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Pro-only price node evaluated by the AST expression engine. Supports
 * functions, comparisons and a bid map for shipping/weight dynamics.
 * Renders nothing when the license is inactive.
 */
final class AdvancedFormulaField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'advancedformula';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		if ( ! Capabilities::pro() ) {
			return '';
		}

		$expression = (string) $this->cfg( 'expression', '' );
		if ( '' === trim( $expression ) ) {
			return '';
		}

		$bid_map = $this->cfg( 'bidMap', array() );

		return '<div class="spcus-formula spcus-formula--advanced" data-expression="' . esc_attr( $expression ) . '"'
			. $this->attrs( array( 'data-bidmap' => $bid_map ) ) . '>'
			. '<span class="spcus-formula__value"></span>'
			. '</div>';
	}

	/**
	 * Advanced formula fields produce no human-readable selection text.
	 *
	 * @param mixed $value Selection value.
	 * @return string
	 */
	public function summarize( $value ) {
		return '';
	}
}
