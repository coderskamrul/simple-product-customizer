<?php
/**
 * On/off toggle switch field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * A single boolean switch. The first choice carries the price applied
 * when the switch is enabled.
 */
final class ToggleField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'toggle';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();
		$on      = ! empty( $choice['selected'] );

		$html  = '<label class="dpo-toggle">';
		$html .= '<input type="checkbox" class="dpo-toggle__input" name="' . esc_attr( $this->choice_name() ) . '" value="0"'
			. $this->attrs(
				array_merge(
					array(
						'data-uid'   => isset( $choice['uid'] ) ? (string) $choice['uid'] : '',
						'data-label' => isset( $choice['label'] ) ? (string) $choice['label'] : '',
					),
					$this->choice_price_attrs( $choice ),
					array(
						'checked' => $on,
					)
				)
			) . ' />';
		$html .= '<span class="dpo-toggle__track"><span class="dpo-toggle__thumb"></span></span>';
		if ( '' !== (string) $this->cfg( 'onText', '' ) || '' !== (string) $this->cfg( 'offText', '' ) ) {
			$html .= '<span class="dpo-toggle__text" data-on="' . esc_attr( (string) $this->cfg( 'onText', '' ) ) . '" data-off="' . esc_attr( (string) $this->cfg( 'offText', '' ) ) . '"></span>';
		}
		$html .= $this->price_badge( $choice );
		$html .= '</label>';
		return $html;
	}
}
