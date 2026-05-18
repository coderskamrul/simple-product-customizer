<?php
/**
 * Date picker field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Text input enhanced into a date picker by the store JS.
 */
final class DateField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'date';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();

		return '<input type="text" readonly class="dpo-input dpo-date-input" name="' . esc_attr( $this->input_name() ) . '"'
			. $this->attrs(
				array_merge(
					array(
						'placeholder'        => (string) $this->prop( 'placeholder', '' ),
						'data-format'        => (string) $this->cfg( 'format', 'Y-m-d' ),
						'data-min-date'      => (string) $this->cfg( 'minDate', '' ),
						'data-max-date'      => (string) $this->cfg( 'maxDate', '' ),
						'data-disable-days'  => $this->cfg( 'disableDays', array() ),
						'data-disable-dates' => $this->cfg( 'disableDates', array() ),
					),
					$this->choice_price_attrs( $choice ),
					array(
						'required' => ! empty( $this->prop( 'required' ) ),
					)
				)
			) . ' />';
	}
}
