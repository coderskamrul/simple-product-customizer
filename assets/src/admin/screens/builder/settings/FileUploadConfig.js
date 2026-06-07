/**
 * General-tab config for the File Upload field. Groups the many upload
 * settings into clear sections (pricing, labels, size, count, allowed types)
 * rather than one long column, and offers a chip-based allowed-types picker.
 * Writes the exact `config` keys FileUploadField + upload.js consume; pricing
 * lives on choices[0] like the other single-value priced fields.
 *
 * @package
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { X, Plus } from 'lucide-react';
import { Field, TextControl } from '../../../components';
import ValuePricing from './ValuePricing';

/** Common file extensions offered as quick-pick chips. */
const COMMON_TYPES = [
	'jpg',
	'jpeg',
	'png',
	'gif',
	'webp',
	'svg',
	'pdf',
	'doc',
	'docx',
	'csv',
	'xls',
	'zip',
	'mp4',
];

/**
 * Chip multi-select for allowed file extensions. Toggles common types and
 * lets the editor add custom ones.
 *
 * @param {Object}   props          Component props.
 * @param {string[]} props.value    Selected extensions.
 * @param {Function} props.onChange (next:string[]) => void.
 * @return {JSX.Element} The picker.
 */
function TypePicker( { value, onChange } ) {
	const [ custom, setCustom ] = useState( '' );
	const selected = Array.isArray( value ) ? value : [];
	const all = Array.from( new Set( [ ...COMMON_TYPES, ...selected ] ) );

	const toggle = ( ext ) =>
		onChange(
			selected.includes( ext )
				? selected.filter( ( e ) => e !== ext )
				: [ ...selected, ext ]
		);

	const addCustom = () => {
		const ext = custom.trim().replace( /^\./, '' ).toLowerCase();
		if ( ext && ! selected.includes( ext ) ) {
			onChange( [ ...selected, ext ] );
		}
		setCustom( '' );
	};

	return (
		<div className="pkitfw-typechips">
			<div className="pkitfw-typechips__list">
				{ all.map( ( ext ) => (
					<button
						key={ ext }
						type="button"
						className={ `pkitfw-typechip${
							selected.includes( ext ) ? ' is-active' : ''
						}` }
						onClick={ () => toggle( ext ) }
					>
						{ ext }
						{ selected.includes( ext ) && <X size={ 12 } /> }
					</button>
				) ) }
			</div>
			<div className="pkitfw-typechips__add">
				<TextControl
					value={ custom }
					placeholder={ __(
						'Add type (e.g. tiff)',
						'productkit-for-woocommerce'
					) }
					onChange={ setCustom }
				/>
				<button
					type="button"
					className="pkitfw-btn pkitfw-btn--ghost"
					onClick={ addCustom }
					disabled={ ! custom.trim() }
				>
					<Plus size={ 14 } />
					{ __( 'Add', 'productkit-for-woocommerce' ) }
				</button>
			</div>
		</div>
	);
}

/**
 * FileUploadConfig.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The config block.
 */
export default function FileUploadConfig( { node, patch } ) {
	const cfg = node.config || {};
	const setKey = ( key, value ) =>
		patch( { config: { ...cfg, [ key ]: value } } );

	return (
		<>
			<ValuePricing node={ node } patch={ patch } />

			<div className="pkitfw-settings__group">
				<p className="pkitfw-field-group__title">
					{ __(
						'Labels',
						'productkit-for-woocommerce'
					) }
				</p>
				<div className="pkitfw-settings__grid2">
					<Field
						label={ __(
							'Upload text',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							value={ cfg.uploadText ?? '' }
							onChange={ ( v ) => setKey( 'uploadText', v ) }
						/>
					</Field>
					<Field
						label={ __(
							'Drag & drop text',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							value={ cfg.dragText ?? '' }
							onChange={ ( v ) => setKey( 'dragText', v ) }
						/>
					</Field>
				</div>
			</div>

			<div className="pkitfw-settings__group">
				<p className="pkitfw-field-group__title">
					{ __(
						'File size',
						'productkit-for-woocommerce'
					) }
				</p>
				<div className="pkitfw-settings__grid2">
					<Field
						label={ __(
							'Maximum file size (MB)',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ cfg.maxSize ?? '' }
							onChange={ ( v ) => setKey( 'maxSize', v ) }
						/>
					</Field>
					<Field
						label={ __(
							'Too-large error message',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							value={ cfg.sizeError ?? '' }
							onChange={ ( v ) => setKey( 'sizeError', v ) }
						/>
					</Field>
				</div>
				<Field
					label={ __(
						'File size hint text',
						'productkit-for-woocommerce'
					) }
					help={ __(
						'Use [max_size] for the configured size.',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.sizePrefix ?? '' }
						onChange={ ( v ) => setKey( 'sizePrefix', v ) }
					/>
				</Field>
			</div>

			<div className="pkitfw-settings__group">
				<p className="pkitfw-field-group__title">
					{ __(
						'File count',
						'productkit-for-woocommerce'
					) }
				</p>
				<div className="pkitfw-settings__grid2">
					<Field
						label={ __(
							'Minimum number of files',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ cfg.minNumber ?? '' }
							onChange={ ( v ) => setKey( 'minNumber', v ) }
						/>
					</Field>
					<Field
						label={ __(
							'Maximum number of files',
							'productkit-for-woocommerce'
						) }
					>
						<TextControl
							type="number"
							value={ cfg.maxNumber ?? '' }
							onChange={ ( v ) => setKey( 'maxNumber', v ) }
						/>
					</Field>
				</div>
				<Field
					label={ __(
						'Too-many error message',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.countError ?? '' }
						onChange={ ( v ) => setKey( 'countError', v ) }
					/>
				</Field>
				<Field
					label={ __(
						'File count hint text',
						'productkit-for-woocommerce'
					) }
					help={ __(
						'Use [max_files] for the configured maximum.',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.countPrefix ?? '' }
						onChange={ ( v ) => setKey( 'countPrefix', v ) }
					/>
				</Field>
			</div>

			<div className="pkitfw-settings__group">
				<p className="pkitfw-field-group__title">
					{ __(
						'Allowed file types',
						'productkit-for-woocommerce'
					) }
				</p>
				<Field
					label={ __(
						'Allowed types hint text',
						'productkit-for-woocommerce'
					) }
					help={ __(
						'Use [allowed_types] for the chosen list.',
						'productkit-for-woocommerce'
					) }
				>
					<TextControl
						value={ cfg.typePrefix ?? '' }
						onChange={ ( v ) => setKey( 'typePrefix', v ) }
					/>
				</Field>
				<TypePicker
					value={ cfg.allowedTypes }
					onChange={ ( v ) => setKey( 'allowedTypes', v ) }
				/>
			</div>
		</>
	);
}
