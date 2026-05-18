<?php
/**
 * Plugin settings controller (`dpo_settings`).
 *
 * @package DPO
 */

namespace DPO\Rest\Route;

use DPO\Core\Container;
use DPO\Core\Settings;
use DPO\Rest\RestServer;
use DPO\Support\Str;
use WP_REST_Request;

defined( 'ABSPATH' ) || exit;

/**
 * Read and persist the serialized settings option.
 */
final class SettingsController {

	/**
	 * Container.
	 *
	 * @var Container
	 */
	private $c;

	/**
	 * Constructor.
	 *
	 * @param Container $c Container.
	 */
	public function __construct( Container $c ) {
		$this->c = $c;
	}

	/**
	 * Route descriptors.
	 *
	 * @param RestServer $s Server.
	 * @return array
	 */
	public function routes( RestServer $s ) {
		return array(
			array(
				'path'       => 'settings',
				'methods'    => 'GET',
				'permission' => array( $s, 'can_read' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->get_settings( $r, $s );
				},
			),
			array(
				'path'       => 'settings',
				'methods'    => 'POST',
				'permission' => array( $s, 'can_manage' ),
				'callback'   => function ( WP_REST_Request $r ) use ( $s ) {
					return $this->save_settings( $r, $s );
				},
			),
		);
	}

	/**
	 * Settings service accessor.
	 *
	 * @return Settings|null
	 */
	private function settings() {
		$svc = $this->c->get( 'settings' );
		return $svc instanceof Settings ? $svc : null;
	}

	/**
	 * GET settings.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function get_settings( WP_REST_Request $r, RestServer $s ) {
		$svc = $this->settings();
		if ( ! $svc || ! method_exists( $svc, 'all' ) ) {
			return $s->fail( 'unavailable', __( 'Settings unavailable.', 'dynamic-product-options-for-woocommerce' ), 500 );
		}
		return $s->ok( array( 'settings' => $svc->all() ) );
	}

	/**
	 * POST settings.
	 *
	 * @param WP_REST_Request $r Request.
	 * @param RestServer      $s Server.
	 * @return \WP_REST_Response|\WP_Error
	 */
	private function save_settings( WP_REST_Request $r, RestServer $s ) {
		if ( ! $s->verify_nonce( $r ) ) {
			return $s->fail( 'bad_nonce', __( 'Invalid or missing nonce.', 'dynamic-product-options-for-woocommerce' ), 403 );
		}
		$svc = $this->settings();
		if ( ! $svc || ! method_exists( $svc, 'save' ) ) {
			return $s->fail( 'unavailable', __( 'Settings unavailable.', 'dynamic-product-options-for-woocommerce' ), 500 );
		}

		$values = Str::json( $r->get_param( 'settings' ), array() );
		if ( ! is_array( $values ) ) {
			return $s->fail( 'bad_payload', __( 'Invalid settings payload.', 'dynamic-product-options-for-woocommerce' ), 400 );
		}

		$clean = array();
		foreach ( $values as $key => $value ) {
			$key = sanitize_key( $key );
			if ( is_bool( $value ) ) {
				$clean[ $key ] = (bool) $value;
			} elseif ( is_int( $value ) || is_float( $value ) ) {
				$clean[ $key ] = $value;
			} else {
				$clean[ $key ] = sanitize_text_field( (string) $value );
			}
		}

		$svc->save( $clean );

		return $s->ok( array( 'settings' => $svc->all() ) );
	}
}
