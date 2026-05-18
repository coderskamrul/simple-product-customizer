<?php
/**
 * Font picker field (Pro only).
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Core\Capabilities;
use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Lets the customer pick a font for personalised products. Pro-only:
 * renders nothing when the license is inactive. Emits @font-face for
 * any custom uploaded font referenced by a choice.
 */
final class FontPickerField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'fontpicker';
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

		$choices = $this->choices();
		if ( empty( $choices ) ) {
			return '';
		}

		$custom = get_option( 'dpo_custom_fonts', array() );
		$custom = is_array( $custom ) ? $custom : array();
		$src_by = array();
		foreach ( $custom as $font ) {
			if ( ! empty( $font['family'] ) && ! empty( $font['src'] ) ) {
				$src_by[ (string) $font['family'] ] = array(
					'src'  => (string) $font['src'],
					'type' => isset( $font['file_type'] ) ? (string) $font['file_type'] : 'woff2',
				);
			}
		}

		$face = '';
		$html = '<div class="dpo-fontpicker dpo-select" data-field-id="' . esc_attr( $this->id() ) . '">';
		$html .= '<input type="hidden" class="dpo-select__value" name="' . esc_attr( $this->input_name() ) . '" value="" />';
		$html .= '<button type="button" class="dpo-select__toggle"><span class="dpo-select__placeholder">'
			. esc_html__( 'Choose a font', 'dynamic-product-options-for-woocommerce' ) . '</span></button>';
		$html .= '<div class="dpo-select__list" role="listbox">';

		foreach ( $choices as $index => $choice ) {
			$label  = isset( $choice['label'] ) ? (string) $choice['label'] : '';
			$family = isset( $choice['fontFamily'] ) ? (string) $choice['fontFamily'] : '';

			if ( '' !== $family && isset( $src_by[ $family ] ) ) {
				$face .= sprintf(
					"@font-face{font-family:'%s';src:url('%s') format('%s');font-display:swap;}",
					esc_attr( $family ),
					esc_url( $src_by[ $family ]['src'] ),
					esc_attr( $src_by[ $family ]['type'] )
				);
			}

			$html .= '<div class="dpo-select__opt" role="option" style="font-family:' . esc_attr( $family ) . '"'
				. $this->attrs(
					array_merge(
						array(
							'data-index' => (int) $index,
							'data-uid'   => isset( $choice['uid'] ) ? (string) $choice['uid'] : '',
							'data-label' => $label,
						),
						$this->choice_price_attrs( is_array( $choice ) ? $choice : array() )
					)
				) . '>';
			$html .= '<span class="dpo-select__opt-label">' . esc_html( '' !== $label ? $label : $family ) . '</span>';
			$html .= $this->price_badge( is_array( $choice ) ? $choice : array() );
			$html .= '</div>';
		}

		$html .= '</div></div>';

		if ( '' !== $face ) {
			$html = '<style>' . $face . '</style>' . $html;
		}
		return $html;
	}
}
