<?php
/**
 * Numeric literal node.
 *
 * @package ProductKit\Formula\Ast\Node
 */

namespace ProductKit\Formula\Ast\Node;

use ProductKit\Formula\Ast\ExpressionEngine;

defined( 'ABSPATH' ) || exit;

/**
 * A constant numeric value parsed straight from the source.
 */
final class NumberNode implements NodeInterface {

	/**
	 * The literal value.
	 *
	 * @var float
	 */
	private $value;

	/**
	 * @param mixed $value Numeric literal.
	 */
	public function __construct( $value ) {
		$this->value = (float) $value;
	}

	/**
	 * Return the literal value unchanged.
	 *
	 * @param ExpressionEngine $engine Engine (unused).
	 * @param array            $ctx    Context (unused).
	 * @return float
	 */
	public function evaluate( ExpressionEngine $engine, array $ctx = array() ) {
		return $this->value;
	}
}
