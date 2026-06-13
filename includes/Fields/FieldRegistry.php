<?php
/**
 * Field type registry.
 *
 * @package ProductKit
 */

namespace ProductKit\Fields;

defined( 'ABSPATH' ) || exit;

/**
 * Maps a type slug to its renderer class and instantiates field objects.
 *
 * Pro-only types (e.g. fontpicker, advancedformula) are NOT defined here — they
 * are injected by the ProductKit Pro plugin through the `pkitfw_field_types`
 * filter, and only when its license is valid. With Pro absent the slugs are
 * unknown, so {@see self::make()} returns null and the type renders nothing.
 * There is no boolean flag to flip: the renderer code for those types simply
 * does not exist in the free plugin.
 */
final class FieldRegistry {

	/**
	 * slug => FQCN map.
	 *
	 * @var array<string,string>
	 */
	private $map;

	/**
	 * Build the default map.
	 */
	public function __construct() {
		$base = __NAMESPACE__ . '\\Type\\';
		$this->map = apply_filters(
			'pkitfw_field_types',
			array(
				'text'            => $base . 'TextField',
				'textarea'        => $base . 'TextareaField',
				'email'           => $base . 'EmailField',
				'url'             => $base . 'UrlField',
				'tel'             => $base . 'TelField',
				'number'          => $base . 'NumberField',
				'checkbox'        => $base . 'CheckboxField',
				'radio'           => $base . 'RadioField',
				'select'          => $base . 'SelectField',
				'toggle'          => $base . 'ToggleField',
				'range'           => $base . 'RangeField',
				'date'            => $base . 'DateField',
				'time'            => $base . 'TimeField',
				'datetime'        => $base . 'DatetimeField',
				'colorpicker'     => $base . 'ColorPickerField',
				'colorswatch'     => $base . 'ColorSwatchField',
				'imageswatch'     => $base . 'ImageSwatchField',
				'fileupload'      => $base . 'FileUploadField',
				'heading'         => $base . 'HeadingField',
				'html'            => $base . 'HtmlField',
				'divider'         => $base . 'DividerField',
				'spacer'          => $base . 'SpacerField',
				'section'         => $base . 'SectionField',
				'buttongroup'     => $base . 'ButtonGroupField',
				'popup'           => $base . 'PopupField',
				'shortcode'       => $base . 'ShortcodeField',
				'linkedproducts'  => $base . 'LinkedProductsField',
				'formula'         => $base . 'FormulaField',
			)
		);
	}

	/**
	 * Whether a slug is registered.
	 *
	 * @param string $type Slug.
	 * @return bool
	 */
	public function has( $type ) {
		return isset( $this->map[ $type ] );
	}

	/**
	 * Registered slugs.
	 *
	 * @return string[]
	 */
	public function types() {
		return array_keys( $this->map );
	}

	/**
	 * Instantiate a field from a node.
	 *
	 * @param array $node       Field node.
	 * @param int   $product_id Product id.
	 * @param int   $set_id     Option-set id.
	 * @return FieldContract|null
	 */
	public function make( array $node, $product_id = 0, $set_id = 0 ) {
		$type = isset( $node['type'] ) ? $node['type'] : '';
		if ( ! $this->has( $type ) ) {
			return null;
		}
		$class = $this->map[ $type ];
		if ( ! class_exists( $class ) ) {
			return null;
		}
		return new $class( $node, $product_id, $set_id );
	}
}
