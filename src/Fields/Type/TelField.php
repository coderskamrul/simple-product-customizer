<?php
/**
 * Telephone input field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * HTML5 tel input with optional validation pattern.
 */
final class TelField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'tel';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();
		$def     = $this->prop( 'defaults', '' );
		$def     = is_array( $def ) ? ( isset( $def[0] ) ? $def[0] : '' ) : $def;

		return '<input type="tel" class="dpo-input" name="' . esc_attr( $this->input_name() ) . '"'
			. $this->attrs(
				array_merge(
					array(
						'placeholder' => (string) $this->prop( 'placeholder', '' ),
						'value'       => (string) $def,
						'pattern'     => (string) $this->cfg( 'pattern', '' ),
					),
					$this->choice_price_attrs( $choice ),
					array(
						'required' => ! empty( $this->prop( 'required' ) ),
					)
				)
			) . ' />';
	}
}
