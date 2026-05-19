<?php
/**
 * Free-form color picker field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Native color input with a hex text mirror and a reset control.
 */
final class ColorPickerField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'colorpicker';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();
		$default = (string) $this->cfg( 'defaultColor', '#000000' );

		$html  = '<div class="dpo-colorpicker" data-field-id="' . esc_attr( $this->id() ) . '">';
		$html .= '<input type="color" class="dpo-colorpicker__input" name="' . esc_attr( $this->input_name() ) . '"'
			. $this->attrs(
				array_merge(
					array(
						'value'        => $default,
						'data-default' => $default,
					),
					$this->choice_price_attrs( $choice )
				)
			) . ' />';
		$html .= '<input type="text" class="dpo-colorpicker__hex" value="' . esc_attr( $default ) . '" maxlength="7" />';
		$html .= '<button type="button" class="dpo-colorpicker__reset" aria-label="' . esc_attr__( 'Reset color', 'dynamic-product-options-for-woocommerce' ) . '">&times;</button>';
		$html .= '</div>';
		return $html;
	}
}
