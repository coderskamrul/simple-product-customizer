<?php
/**
 * Common contract for every AST node.
 *
 * @package SPCUS\Formula\Ast\Node
 */

namespace SPCUS\Formula\Ast\Node;

use SPCUS\Formula\Ast\ExpressionEngine;

defined( 'ABSPATH' ) || exit;

/**
 * Every node in the parsed expression tree knows how to evaluate itself
 * given an engine (for value/type coercion helpers) and a variable
 * context map.
 */
interface NodeInterface {

	/**
	 * Evaluate this node.
	 *
	 * @param ExpressionEngine $engine Engine providing coercion helpers.
	 * @param array            $ctx    Variable name => value map.
	 * @return mixed Numeric, boolean, or other scalar result.
	 */
	public function evaluate( ExpressionEngine $engine, array $ctx = array() );
}
