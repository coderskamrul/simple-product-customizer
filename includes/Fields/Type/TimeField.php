<?php
/**
 * Time picker field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Text input enhanced into a time picker by the store JS.
 */
final class TimeField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'time';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();

		return '<input type="text" readonly class="dpo-input dpo-time-input" name="' . esc_attr( $this->input_name() ) . '"'
			. $this->attrs(
				array_merge(
					array(
						'placeholder'      => (string) $this->prop( 'placeholder', '' ),
						'data-time-format' => (string) $this->cfg( 'timeFormat', 'H:i' ),
						'data-min-time'    => (string) $this->cfg( 'minTime', '' ),
						'data-max-time'    => (string) $this->cfg( 'maxTime', '' ),
						'data-step'        => '' !== (string) $this->cfg( 'step', '' ) ? (int) $this->cfg( 'step' ) : '',
					),
					$this->choice_price_attrs( $choice ),
					array(
						'required' => ! empty( $this->prop( 'required' ) ),
					)
				)
			) . ' />';
	}
}
