<?php
/**
 * Advanced formula price field (Pro only).
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Core\Capabilities;
use DPO\Fields\AbstractField;

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

		return '<div class="dpo-formula dpo-formula--advanced" data-expression="' . esc_attr( $expression ) . '"'
			. $this->attrs( array( 'data-bidmap' => $bid_map ) ) . '>'
			. '<span class="dpo-formula__value"></span>'
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
