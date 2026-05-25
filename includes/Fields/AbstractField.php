<?php
/**
 * Base class for every option type.
 *
 * @package DPO
 */

namespace DPO\Fields;

use DPO\Core\Capabilities;
use DPO\Fields\Concerns\HandlesPricing;
use DPO\Fields\Concerns\RendersMarkup;
use DPO\Support\Arr;

defined( 'ABSPATH' ) || exit;

/**
 * Provides node accessors, the standard field wrapper (DOM contract §8),
 * label/description markup, choice handling and Pro gating. Concrete types
 * implement type() and the inner control markup via inner().
 */
abstract class AbstractField implements FieldContract {

	use RendersMarkup;
	use HandlesPricing;

	/**
	 * Raw field node.
	 *
	 * @var array
	 */
	protected $node;

	/**
	 * Owning product id.
	 *
	 * @var int
	 */
	protected $product_id;

	/**
	 * Owning option-set id (for analytics/serialisation).
	 *
	 * @var int
	 */
	protected $set_id;

	/**
	 * Constructor.
	 *
	 * @param array $node       Field node.
	 * @param int   $product_id Product id.
	 * @param int   $set_id     Option-set id.
	 */
	public function __construct( array $node, $product_id = 0, $set_id = 0 ) {
		$this->node       = $node;
		$this->product_id = (int) $product_id;
		$this->set_id     = (int) $set_id;
	}

	/* ----------------------------------------------------------------- */
	/* Node accessors                                                     */
	/* ----------------------------------------------------------------- */

	/**
	 * Node id.
	 *
	 * @return string
	 */
	protected function id() {
		return (string) Arr::get( $this->node, 'id', '' );
	}

	/**
	 * Node property accessor.
	 *
	 * @param string $key     Key.
	 * @param mixed  $default Default.
	 * @return mixed
	 */
	protected function prop( $key, $default = '' ) {
		return Arr::get( $this->node, $key, $default );
	}

	/**
	 * Type-specific config bag.
	 *
	 * @param string $key     Config key.
	 * @param mixed  $default Default.
	 * @return mixed
	 */
	protected function cfg( $key, $default = '' ) {
		$config = Arr::get( $this->node, 'config', array() );
		return is_array( $config ) ? Arr::get( $config, $key, $default ) : $default;
	}

	/**
	 * Choices, Pro-capped (free tier: first 3).
	 *
	 * @return array
	 */
	protected function choices() {
		$choices = Arr::get( $this->node, 'choices', array() );
		$choices = is_array( $choices ) ? array_values( $choices ) : array();
		if ( ! Capabilities::pro() && count( $choices ) > 3 ) {
			$choices = array_slice( $choices, 0, 3 );
		}
		return $choices;
	}

	/**
	 * Input name for single-value controls.
	 *
	 * @return string
	 */
	protected function input_name() {
		return 'dpo_input_' . $this->id();
	}

	/**
	 * Group name for choice controls.
	 *
	 * @return string
	 */
	protected function choice_name() {
		return 'dpo_choice_' . $this->id();
	}

	/**
	 * Per-choice quantity input, rendered only when the field enables
	 * quantity. Honours the configured min/max quantity bounds so the
	 * storefront control matches the builder settings.
	 *
	 * @param int $index Choice index (for a unique input name).
	 * @return string Input HTML, or '' when quantity is disabled.
	 */
	protected function qty_input( $index ) {
		if ( empty( $this->cfg( 'enableQty' ) ) ) {
			return '';
		}
		$min = '' !== (string) $this->cfg( 'minQty', '' ) ? (int) $this->cfg( 'minQty' ) : 0;
		$max = '' !== (string) $this->cfg( 'maxQty', '' ) ? (int) $this->cfg( 'maxQty' ) : '';

		return '<input type="number" class="dpo-choice__qty" name="dpo_qty_' . esc_attr( $this->id() ) . '_' . esc_attr( (string) $index ) . '"'
			. $this->attrs(
				array(
					'min'   => $min,
					'max'   => $max,
					'value' => $min,
				)
			) . ' />';
	}

	/**
	 * Inline style for a swatch box (size + border-radius). The radius falls
	 * back to the configured shape preset. Kept in lock-step with the
	 * builder's swatchStyle() so the storefront matches the live preview.
	 *
	 * @return string CSS declarations (no trailing semicolon required).
	 */
	protected function swatch_style() {
		$parts = array();
		$width  = (string) $this->cfg( 'swatchWidth', '' );
		$height = (string) $this->cfg( 'swatchHeight', '' );
		$radius = (string) $this->cfg( 'swatchRadius', '' );
		$shape  = (string) $this->cfg( 'shape', '' );

		if ( '' !== $width ) {
			$parts[] = 'width:' . (int) $width . 'px';
		}
		if ( '' !== $height ) {
			$parts[] = 'height:' . (int) $height . 'px';
		}
		if ( '' !== $radius ) {
			$parts[] = 'border-radius:' . (int) $radius . 'px';
		} elseif ( 'circle' === $shape ) {
			$parts[] = 'border-radius:50%';
		} elseif ( 'rounded' === $shape ) {
			$parts[] = 'border-radius:10px';
		} elseif ( 'square' === $shape ) {
			$parts[] = 'border-radius:4px';
		}

		return implode( ';', $parts );
	}

	/**
	 * Default-by-default. Concrete priced types may override.
	 *
	 * @return bool
	 */
	public function priceable() {
		return true;
	}

	/* ----------------------------------------------------------------- */
	/* Wrapper / label                                                    */
	/* ----------------------------------------------------------------- */

	/**
	 * Standard outer wrapper attributes.
	 *
	 * @return string
	 */
	protected function wrapper_attrs() {
		$logic   = ! empty( $this->prop( 'logicEnabled' ) );
		$rules   = $this->prop( 'logic', array() );
		$classes = $this->classes(
			array(
				'dpo-field',
				'dpo-field--' . $this->type(),
				$this->width_class( (string) $this->prop( 'width', 'full' ) ),
				$logic && ! empty( $rules['rules'] ) ? 'dpo-hidden' : '',
				(string) $this->prop( 'cssClass', '' ),
			)
		);

		return 'class="' . esc_attr( $classes ) . '" id="dpo-field-' . esc_attr( $this->id() ) . '"' . $this->attrs(
			array(
				'data-field-id'    => $this->id(),
				'data-type'        => $this->type(),
				'data-set-id'      => $this->set_id,
				'data-required'    => ! empty( $this->prop( 'required' ) ) ? 'yes' : 'no',
				'data-logic'       => $logic ? 'yes' : 'no',
				'data-logic-rules' => $logic ? $rules : '',
				'data-defaults'    => $this->prop( 'defaults', array() ),
			)
		);
	}

	/**
	 * Label + optional required marker + description.
	 *
	 * @return string
	 */
	protected function label_html() {
		if ( ! empty( $this->prop( 'hideLabel' ) ) ) {
			return '';
		}
		$label = (string) $this->prop( 'label', '' );
		if ( '' === $label ) {
			return '';
		}
		$req = ! empty( $this->prop( 'required' ) ) ? ' <span class="dpo-required" aria-hidden="true">*</span>' : '';

		$html  = '<div class="dpo-field__label">';
		$html .= '<span class="dpo-field__label-text">' . esc_html( $label ) . $req . '</span>';
		$html .= $this->label_suffix();
		if ( 'tooltip' === $this->prop( 'descriptionPlacement' ) && '' !== (string) $this->prop( 'description', '' ) ) {
			$html .= '<span class="dpo-tooltip" tabindex="0" data-tip="' . esc_attr( wp_strip_all_tags( (string) $this->prop( 'description' ) ) ) . '">?</span>';
		}
		$html .= '</div>';

		if ( 'below_label' === $this->prop( 'descriptionPlacement', 'below_label' ) && '' !== (string) $this->prop( 'description', '' ) ) {
			$html .= '<div class="dpo-field__desc">' . wp_kses_post( $this->prop( 'description' ) ) . '</div>';
		}
		return $html;
	}

	/**
	 * Optional markup appended right after the title text inside the label
	 * (e.g. a single-value field's price badge). Empty by default; value
	 * types that price a single control override this.
	 *
	 * @return string
	 */
	protected function label_suffix() {
		return '';
	}

	/**
	 * Description rendered below the control (when configured).
	 *
	 * @return string
	 */
	protected function below_field_desc() {
		if ( 'below_field' === $this->prop( 'descriptionPlacement' ) && '' !== (string) $this->prop( 'description', '' ) ) {
			return '<div class="dpo-field__desc dpo-field__desc--below">' . wp_kses_post( $this->prop( 'description' ) ) . '</div>';
		}
		return '';
	}

	/* ----------------------------------------------------------------- */
	/* Render pipeline                                                    */
	/* ----------------------------------------------------------------- */

	/**
	 * Final field HTML. Concrete types implement inner().
	 *
	 * @return string
	 */
	public function render() {
		$html  = '<div ' . $this->wrapper_attrs() . '>';
		$html .= $this->label_html();
		$html .= '<div class="dpo-field__control">' . $this->inner() . '</div>';
		$html .= $this->below_field_desc();
		$html .= '<div class="dpo-field__error" role="alert"></div>';
		$html .= '</div>';
		return $html;
	}

	/**
	 * Inner control markup.
	 *
	 * @return string
	 */
	abstract protected function inner();

	/**
	 * Default summariser: scalar to string.
	 *
	 * @param mixed $value Selection value.
	 * @return string
	 */
	public function summarize( $value ) {
		if ( is_array( $value ) ) {
			$flat = array();
			foreach ( $value as $v ) {
				if ( is_array( $v ) && isset( $v['label'] ) ) {
					$flat[] = $v['label'] . ( isset( $v['count'] ) && $v['count'] > 1 ? ' ×' . (int) $v['count'] : '' );
				} else {
					$flat[] = is_scalar( $v ) ? (string) $v : wp_json_encode( $v );
				}
			}
			return implode( ', ', array_map( 'sanitize_text_field', $flat ) );
		}
		return sanitize_text_field( (string) $value );
	}
}
