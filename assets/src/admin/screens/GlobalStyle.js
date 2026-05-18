/**
 * Global Style screen — token editors (typography, colors, spacing,
 * control style, swatch/border) that compile to a CSS string saved via
 * POST style. Supports a separate "thematic" variant toggle.
 *
 * @package DPO\Admin
 */

import { useState, useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import { useToast } from '../store/ToastContext';
import {
	Panel,
	Spinner,
	Field,
	TextControl,
	SelectControl,
	ColorField,
	ToggleField,
} from '../components';

/** Default token set. */
const DEFAULTS = {
	fontFamily: 'inherit',
	fontSize: '15',
	labelColor: '#1e1e1e',
	textColor: '#333333',
	accentColor: '#2563eb',
	borderColor: '#d4d4d8',
	radius: '6',
	spacing: '16',
	controlHeight: '40',
	swatchSize: '34',
	swatchShape: 'rounded',
};

/**
 * Compile tokens into a scoped CSS string (mirrors the storefront scope
 * `.dpo-options`).
 *
 * @param {Object} t Token object.
 * @return {string} CSS text.
 */
function compileCss( t ) {
	const radiusMap = { circle: '50%', square: '0', rounded: '6px' };
	return [
		`.dpo-options{`,
		`--dpo-font:${ t.fontFamily };`,
		`--dpo-font-size:${ t.fontSize }px;`,
		`--dpo-label:${ t.labelColor };`,
		`--dpo-text:${ t.textColor };`,
		`--dpo-accent:${ t.accentColor };`,
		`--dpo-border:${ t.borderColor };`,
		`--dpo-radius:${ t.radius }px;`,
		`--dpo-space:${ t.spacing }px;`,
		`--dpo-control-h:${ t.controlHeight }px;`,
		`--dpo-swatch:${ t.swatchSize }px;`,
		`--dpo-swatch-radius:${ radiusMap[ t.swatchShape ] || '6px' };`,
		`}`,
	].join( '' );
}

/**
 * GlobalStyle.
 *
 * @return {JSX.Element} The screen.
 */
export default function GlobalStyle() {
	const { notify } = useToast();
	const [ status, setStatus ] = useState( 'loading' );
	const [ error, setError ] = useState( '' );
	const [ tokens, setTokens ] = useState( DEFAULTS );
	const [ thematic, setThematic ] = useState( false );
	const [ saving, setSaving ] = useState( false );

	useEffect( () => {
		let cancelled = false;
		api.getStyle()
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				setTokens( {
					...DEFAULTS,
					...( res.global || {} ),
				} );
				setStatus( 'ready' );
			} )
			.catch( ( e ) => {
				if ( cancelled ) {
					return;
				}
				setError( errorMessage( e ) );
				setStatus( 'error' );
			} );
		return () => {
			cancelled = true;
		};
	}, [] );

	const css = useMemo( () => compileCss( tokens ), [ tokens ] );

	/**
	 * Patch one token.
	 *
	 * @param {string} key Token key.
	 * @param {*}      val New value.
	 * @return {void}
	 */
	const set = ( key, val ) =>
		setTokens( ( t ) => ( { ...t, [ key ]: val } ) );

	/**
	 * Persist tokens + compiled CSS.
	 *
	 * @return {Promise<void>} Resolves after save.
	 */
	const onSave = async () => {
		setSaving( true );
		try {
			await api.saveStyle( tokens, css, thematic );
			notify(
				__(
					'Style saved.',
					'dynamic-product-options-for-woocommerce'
				),
				'success'
			);
		} catch ( e ) {
			notify( errorMessage( e ), 'error' );
		} finally {
			setSaving( false );
		}
	};

	if ( status === 'loading' ) {
		return (
			<Panel>
				<Spinner />
			</Panel>
		);
	}
	if ( status === 'error' ) {
		return (
			<Panel>
				<p className="dpo-error">{ error }</p>
			</Panel>
		);
	}

	return (
		<div className="dpo-style">
			<header className="dpo-screen-head">
				<div>
					<h1 className="dpo-screen-title">
						{ __(
							'Global Style',
							'dynamic-product-options-for-woocommerce'
						) }
					</h1>
					<p className="dpo-screen-sub">
						{ __(
							'Theme the storefront option fields. Scoped to .dpo-options so your theme stays untouched.',
							'dynamic-product-options-for-woocommerce'
						) }
					</p>
				</div>
				<div className="dpo-screen-head__actions">
					<label className="dpo-status-toggle">
						<span>
							{ __(
								'Thematic variant',
								'dynamic-product-options-for-woocommerce'
							) }
						</span>
						<input
							type="checkbox"
							checked={ thematic }
							onChange={ ( e ) =>
								setThematic( e.target.checked )
							}
						/>
					</label>
					<button
						type="button"
						className="dpo-btn dpo-btn--primary"
						disabled={ saving }
						onClick={ onSave }
					>
						{ saving
							? __(
									'Saving…',
									'dynamic-product-options-for-woocommerce'
							  )
							: __(
									'Save style',
									'dynamic-product-options-for-woocommerce'
							  ) }
					</button>
				</div>
			</header>

			<div className="dpo-style__grid">
				<Panel
					title={ __(
						'Typography',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<Field
						label={ __(
							'Font family',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							value={ tokens.fontFamily }
							onChange={ ( v ) =>
								set( 'fontFamily', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Base font size (px)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ tokens.fontSize }
							onChange={ ( v ) =>
								set( 'fontSize', v )
							}
						/>
					</Field>
				</Panel>

				<Panel
					title={ __(
						'Colors',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<Field
						label={ __(
							'Label color',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<ColorField
							value={ tokens.labelColor }
							onChange={ ( v ) =>
								set( 'labelColor', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Text color',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<ColorField
							value={ tokens.textColor }
							onChange={ ( v ) =>
								set( 'textColor', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Accent color',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<ColorField
							value={ tokens.accentColor }
							onChange={ ( v ) =>
								set( 'accentColor', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Border color',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<ColorField
							value={ tokens.borderColor }
							onChange={ ( v ) =>
								set( 'borderColor', v )
							}
						/>
					</Field>
				</Panel>

				<Panel
					title={ __(
						'Spacing & controls',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<Field
						label={ __(
							'Field spacing (px)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ tokens.spacing }
							onChange={ ( v ) =>
								set( 'spacing', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Control height (px)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ tokens.controlHeight }
							onChange={ ( v ) =>
								set( 'controlHeight', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Border radius (px)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ tokens.radius }
							onChange={ ( v ) =>
								set( 'radius', v )
							}
						/>
					</Field>
				</Panel>

				<Panel
					title={ __(
						'Swatches & border',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<Field
						label={ __(
							'Swatch size (px)',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ tokens.swatchSize }
							onChange={ ( v ) =>
								set( 'swatchSize', v )
							}
						/>
					</Field>
					<Field
						label={ __(
							'Swatch shape',
							'dynamic-product-options-for-woocommerce'
						) }
					>
						<SelectControl
							value={ tokens.swatchShape }
							onChange={ ( v ) =>
								set( 'swatchShape', v )
							}
							options={ [
								{
									value: 'circle',
									label: __(
										'Circle',
										'dynamic-product-options-for-woocommerce'
									),
								},
								{
									value: 'square',
									label: __(
										'Square',
										'dynamic-product-options-for-woocommerce'
									),
								},
								{
									value: 'rounded',
									label: __(
										'Rounded',
										'dynamic-product-options-for-woocommerce'
									),
								},
							] }
						/>
					</Field>
				</Panel>

				<Panel
					title={ __(
						'Generated CSS',
						'dynamic-product-options-for-woocommerce'
					) }
					className="dpo-style__css"
				>
					<pre className="dpo-codeblock">{ css }</pre>
				</Panel>
			</div>
		</div>
	);
}
