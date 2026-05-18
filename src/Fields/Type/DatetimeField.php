<?php
/**
 * Combined date + time field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Emits both a date and a time control. The selection value is
 * { date, time } per ARCHITECTURE §9.
 */
final class DatetimeField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'datetime';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();
		$variant = (string) $this->cfg( 'variant', 'datetime' );

		$html  = '<div class="dpo-datetime" data-variant="' . esc_attr( $variant ) . '" data-field-id="' . esc_attr( $this->id() ) . '"'
			. $this->attrs( $this->choice_price_attrs( $choice ) ) . '>';
		$html .= '<input type="text" readonly class="dpo-input dpo-date-input" name="' . esc_attr( $this->input_name() ) . '_date"'
			. $this->attrs(
				array(
					'data-format'        => (string) $this->cfg( 'format', 'Y-m-d' ),
					'data-min-date'      => (string) $this->cfg( 'minDate', '' ),
					'data-max-date'      => (string) $this->cfg( 'maxDate', '' ),
					'data-disable-days'  => $this->cfg( 'disableDays', array() ),
					'data-disable-dates' => $this->cfg( 'disableDates', array() ),
				)
			) . ' />';
		$html .= '<input type="text" readonly class="dpo-input dpo-time-input" name="' . esc_attr( $this->input_name() ) . '_time"'
			. $this->attrs(
				array(
					'data-time-format' => (string) $this->cfg( 'timeFormat', 'H:i' ),
					'data-min-time'    => (string) $this->cfg( 'minTime', '' ),
					'data-max-time'    => (string) $this->cfg( 'maxTime', '' ),
				)
			) . ' />';
		$html .= '</div>';
		return $html;
	}

	/**
	 * Human readable representation of a { date, time } value.
	 *
	 * @param mixed $value Selection value.
	 * @return string
	 */
	public function summarize( $value ) {
		if ( is_array( $value ) ) {
			$date = isset( $value['date'] ) ? (string) $value['date'] : '';
			$time = isset( $value['time'] ) ? (string) $value['time'] : '';
			return sanitize_text_field( trim( $date . ' ' . $time ) );
		}
		return parent::summarize( $value );
	}
}
