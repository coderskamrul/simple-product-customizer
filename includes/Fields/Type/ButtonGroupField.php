<?php
/**
 * Button-styled choice group field.
 *
 * @package ProductKit
 */

namespace ProductKit\Fields\Type;

use ProductKit\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Choice group rendered as toggleable buttons. Single-select by default,
 * multi-select when cfg('multiple') is true.
 */
final class ButtonGroupField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'buttongroup';
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		if ( empty( $choices ) ) {
			return '';
		}

		$multiple = ! empty( $this->cfg( 'multiple' ) );
		$columns  = (int) $this->cfg( 'columns', 0 );
		$input_t  = $multiple ? 'checkbox' : 'radio';
		$name     = $multiple ? $this->choice_name() . '[]' : $this->choice_name();

		$html = '<div class="pkitfw-buttongroup"'
			. $this->attrs(
				array(
					'data-columns'    => $columns > 0 ? $columns : '',
					'data-min-select' => $multiple && '' !== (string) $this->cfg( 'minSelect', '' ) ? (int) $this->cfg( 'minSelect' ) : '',
					'data-max-select' => $multiple && '' !== (string) $this->cfg( 'maxSelect', '' ) ? (int) $this->cfg( 'maxSelect' ) : '',
				)
			) . '>';

		foreach ( $choices as $index => $choice ) {
			$label = isset( $choice['label'] ) ? (string) $choice['label'] : '';

			$html .= '<label class="pkitfw-choice pkitfw-choice--button">';
			$html .= '<input type="' . esc_attr( $input_t ) . '" class="pkitfw-choice__native" name="' . esc_attr( $name ) . '" value="' . esc_attr( $index ) . '"'
				. $this->attrs(
					array_merge(
						array(
							'data-uid'   => isset( $choice['uid'] ) ? (string) $choice['uid'] : '',
							'data-label' => $label,
						),
						$this->choice_price_attrs( is_array( $choice ) ? $choice : array() ),
						array(
							'checked' => ! empty( $choice['selected'] ),
						)
					)
				) . ' />';
			$html .= '<span class="pkitfw-btn">';
			$html .= '<span class="pkitfw-choice__label">' . esc_html( $label ) . '</span>';
			$html .= $this->price_badge( is_array( $choice ) ? $choice : array() );
			$html .= '</span>';
			$html .= '</label>';
		}

		$html .= '</div>';
		return $html;
	}
}
