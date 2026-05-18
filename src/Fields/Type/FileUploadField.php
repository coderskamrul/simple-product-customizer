<?php
/**
 * File upload field.
 *
 * @package DPO
 */

namespace DPO\Fields\Type;

use DPO\Fields\AbstractField;

defined( 'ABSPATH' ) || exit;

/**
 * Drag-and-drop file upload. Files are POSTed to the public upload REST
 * route; the hidden input holds a JSON list of { name, path } records.
 */
final class FileUploadField extends AbstractField {

	/**
	 * Runtime slug.
	 *
	 * @return string
	 */
	public function type() {
		return 'fileupload';
	}

	/**
	 * Normalise the allowed-types config into an accept string.
	 *
	 * @return string
	 */
	private function accept() {
		$types = $this->cfg( 'allowedTypes', array() );
		if ( is_string( $types ) ) {
			$types = array_filter( array_map( 'trim', explode( ',', $types ) ) );
		}
		if ( ! is_array( $types ) || empty( $types ) ) {
			return '';
		}
		return implode(
			',',
			array_map(
				static function ( $ext ) {
					$ext = ltrim( trim( (string) $ext ), '.' );
					return '.' . $ext;
				},
				$types
			)
		);
	}

	/**
	 * Control markup.
	 *
	 * @return string
	 */
	protected function inner() {
		$choices = $this->choices();
		$choice  = isset( $choices[0] ) && is_array( $choices[0] ) ? $choices[0] : array();
		$uid     = 'dpo-upload-' . $this->id();

		$html  = '<div class="dpo-upload" data-field-id="' . esc_attr( $this->id() ) . '"'
			. $this->attrs( $this->choice_price_attrs( $choice ) ) . '>';
		$html .= '<input type="hidden" class="dpo-upload__data" name="' . esc_attr( $this->input_name() ) . '" value="" />';
		$html .= '<label class="dpo-dropzone" for="' . esc_attr( $uid ) . '">';
		$html .= '<span class="dpo-dropzone__icon" aria-hidden="true">&#8682;</span>';
		$html .= '<span class="dpo-dropzone__text">' . esc_html__( 'Click or drag files here to upload', 'dynamic-product-options-for-woocommerce' ) . '</span>';
		$html .= '<input type="file" id="' . esc_attr( $uid ) . '" class="dpo-upload__input" multiple'
			. $this->attrs(
				array(
					'accept'        => $this->accept(),
					'data-max-size' => '' !== (string) $this->cfg( 'maxSize', '' ) ? (int) $this->cfg( 'maxSize' ) : '',
					'data-min'      => '' !== (string) $this->cfg( 'minNumber', '' ) ? (int) $this->cfg( 'minNumber' ) : '',
					'data-max'      => '' !== (string) $this->cfg( 'maxNumber', '' ) ? (int) $this->cfg( 'maxNumber' ) : '',
				)
			) . ' />';
		$html .= '</label>';
		$html .= '<div class="dpo-upload__progress" hidden><span class="dpo-upload__bar"></span></div>';
		$html .= '<div class="dpo-upload__result"></div>';
		$html .= '</div>';
		return $html;
	}

	/**
	 * Human readable representation of uploaded files.
	 *
	 * @param mixed $value Selection value.
	 * @return string
	 */
	public function summarize( $value ) {
		if ( is_array( $value ) ) {
			$names = array();
			foreach ( $value as $file ) {
				if ( is_array( $file ) && isset( $file['name'] ) ) {
					$names[] = sanitize_text_field( (string) $file['name'] );
				}
			}
			return implode( ', ', $names );
		}
		return parent::summarize( $value );
	}
}
