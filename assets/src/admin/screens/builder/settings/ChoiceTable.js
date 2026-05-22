/**
 * The choices/options editor — a sortable table of choice rows (label,
 * optional image/colour, price type, regular & sale price, active default)
 * with inline add, drag reordering and per-type extras. The image/colour
 * control lives inline as its own column (matching the field-settings
 * reference designs) so editors set per-choice media without a second row.
 * Enforces the free tier's 3-choice cap with an upgrade hint.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	KeyboardSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	useSortable,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, ImageIcon, X } from 'lucide-react';
import { PRICE_MODES, makeChoice } from '../../../fields/registry';
import { useConfig } from '../../../store/ConfigContext';

const FREE_CAP = 3;

/** Map each choice type to its extra inline column (image|color|font). */
const EXTRA_BY_TYPE = {
	radio: 'image',
	checkbox: 'image',
	select: 'image',
	imageswatch: 'image',
	colorswatch: 'color',
	fontpicker: 'font',
};

/**
 * Compact inline image picker for a choice row. Opens the WP media frame and
 * shows a small thumbnail with a clear (×) badge once set.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.value    Current image URL.
 * @param {Function} props.onChange ({id,url}|null) => void.
 * @return {JSX.Element} The picker cell.
 */
function ImageCell( { value, onChange } ) {
	const available = !! ( window.wp && window.wp.media );

	const open = () => {
		const media = window.wp && window.wp.media;
		if ( ! media ) {
			return;
		}
		const frame = media( {
			title: __(
				'Select image',
				'dynamic-product-options-for-woocommerce'
			),
			button: {
				text: __(
					'Use image',
					'dynamic-product-options-for-woocommerce'
				),
			},
			multiple: false,
			library: { type: 'image' },
		} );
		frame.on( 'select', () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			onChange( { id: att.id, url: att.url } );
		} );
		frame.open();
	};

	if ( value ) {
		return (
			<span className="dpo-choices__media dpo-choices__media--set">
				<button
					type="button"
					className="dpo-choices__media-btn"
					onClick={ open }
					aria-label={ __(
						'Change image',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<img src={ value } alt="" />
				</button>
				<button
					type="button"
					className="dpo-choices__media-clear"
					onClick={ () => onChange( null ) }
					aria-label={ __(
						'Remove image',
						'dynamic-product-options-for-woocommerce'
					) }
				>
					<X size={ 11 } />
				</button>
			</span>
		);
	}

	return (
		<button
			type="button"
			className="dpo-choices__media dpo-choices__media-btn"
			onClick={ open }
			disabled={ ! available }
			aria-label={ __(
				'Select image',
				'dynamic-product-options-for-woocommerce'
			) }
		>
			<ImageIcon size={ 16 } />
		</button>
	);
}

/**
 * One sortable choice row.
 *
 * @param {Object}   props              Component props.
 * @param {Object}   props.choice       Choice row data.
 * @param {number}   props.index        Row index.
 * @param {Array}    props.priceOptions Price-mode options.
 * @param {boolean}  props.proActive    Whether Pro is active.
 * @param {?string}  props.extra        Extra column kind (color|image|font).
 * @param {Function} props.onPatch      (delta) => void.
 * @param {Function} props.onRemove     () => void.
 * @return {JSX.Element} The row.
 */
function ChoiceRow( {
	choice,
	index,
	priceOptions,
	proActive,
	extra,
	onPatch,
	onRemove,
} ) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable( { id: choice.uid } );

	return (
		<div
			ref={ setNodeRef }
			style={ {
				transform: CSS.Transform.toString( transform ),
				transition,
			} }
			className={ `dpo-choices__row${
				isDragging ? ' is-dragging' : ''
			}` }
		>
			<button
				type="button"
				className="dpo-choices__grip"
				aria-label={ __(
					'Reorder',
					'dynamic-product-options-for-woocommerce'
				) }
				{ ...attributes }
				{ ...listeners }
			>
				<GripVertical size={ 15 } />
			</button>

			<input
				className="dpo-input"
				value={ choice.label }
				placeholder={ sprintf(
					/* translators: %d: row number */
					__(
						'Option %d',
						'dynamic-product-options-for-woocommerce'
					),
					index + 1
				) }
				onChange={ ( e ) => onPatch( { label: e.target.value } ) }
			/>

			{ extra === 'image' && (
				<ImageCell
					value={ choice.image }
					onChange={ ( m ) =>
						onPatch( {
							image: m ? m.url : '',
							imageId: m ? m.id : 0,
						} )
					}
				/>
			) }
			{ extra === 'color' && (
				<input
					type="color"
					className="dpo-choices__color"
					value={
						/^#[0-9a-fA-F]{6}$/.test( choice.color || '' )
							? choice.color
							: '#000000'
					}
					onChange={ ( e ) => onPatch( { color: e.target.value } ) }
					aria-label={ __(
						'Choose colour',
						'dynamic-product-options-for-woocommerce'
					) }
				/>
			) }
			{ extra === 'font' && (
				<input
					className="dpo-input"
					value={ choice.fontFamily }
					placeholder={ __(
						'font-family',
						'dynamic-product-options-for-woocommerce'
					) }
					onChange={ ( e ) =>
						onPatch( { fontFamily: e.target.value } )
					}
				/>
			) }

			<select
				className="dpo-input dpo-select-control"
				value={ choice.priceMode }
				onChange={ ( e ) => onPatch( { priceMode: e.target.value } ) }
			>
				{ priceOptions.map( ( o ) => (
					<option
						key={ o.value }
						value={ o.value }
						disabled={ o.disabled }
					>
						{ o.label }
					</option>
				) ) }
			</select>

			<input
				className="dpo-input"
				type="number"
				value={ choice.regular }
				placeholder="0"
				onChange={ ( e ) => onPatch( { regular: e.target.value } ) }
			/>

			<input
				className="dpo-input"
				type="number"
				value={ choice.sale }
				placeholder={
					proActive
						? ''
						: __( 'Pro', 'dynamic-product-options-for-woocommerce' )
				}
				disabled={ ! proActive }
				onChange={ ( e ) => onPatch( { sale: e.target.value } ) }
			/>

			<span
				className="dpo-switch dpo-choices__active"
				title={ __(
					'Selected by default',
					'dynamic-product-options-for-woocommerce'
				) }
			>
				<input
					type="checkbox"
					className="dpo-switch__input"
					aria-label={ __(
						'Selected by default',
						'dynamic-product-options-for-woocommerce'
					) }
					checked={ !! choice.selected }
					onChange={ ( e ) =>
						onPatch( { selected: e.target.checked } )
					}
				/>
				<span className="dpo-switch__track" aria-hidden="true" />
			</span>

			<button
				type="button"
				className="dpo-choices__del"
				aria-label={ __(
					'Delete option',
					'dynamic-product-options-for-woocommerce'
				) }
				onClick={ onRemove }
			>
				<Trash2 size={ 15 } />
			</button>
		</div>
	);
}

/**
 * ChoiceTable.
 *
 * @param {Object}   props       Component props.
 * @param {Object}   props.node  Selected node.
 * @param {Function} props.patch (partialNode) => void.
 * @return {JSX.Element} The choices editor.
 */
export default function ChoiceTable( { node, patch } ) {
	const { proActive } = useConfig();
	const choices = node.choices || [];
	const extra = EXTRA_BY_TYPE[ node.type ] || null;

	const sensors = useSensors(
		useSensor( PointerSensor, { activationConstraint: { distance: 5 } } ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} )
	);

	const priceOptions = PRICE_MODES.map( ( m ) => ( {
		value: m.value,
		label: m.pro && ! proActive ? `${ m.label } (Pro)` : m.label,
		disabled: m.pro && ! proActive,
	} ) );

	const setChoice = ( idx, delta ) =>
		patch( {
			choices: choices.map( ( c, i ) =>
				i === idx ? { ...c, ...delta } : c
			),
		} );

	const removeChoice = ( idx ) =>
		patch( { choices: choices.filter( ( _, i ) => i !== idx ) } );

	const addChoice = () => patch( { choices: [ ...choices, makeChoice() ] } );

	const onDragEnd = ( { active, over } ) => {
		if ( ! over || active.id === over.id ) {
			return;
		}
		const from = choices.findIndex( ( c ) => c.uid === active.id );
		const to = choices.findIndex( ( c ) => c.uid === over.id );
		if ( from < 0 || to < 0 ) {
			return;
		}
		patch( { choices: arrayMove( choices, from, to ) } );
	};

	const canAdd = proActive || choices.length < FREE_CAP;
	const mediaLabel =
		extra === 'color'
			? __( 'Color', 'dynamic-product-options-for-woocommerce' )
			: extra === 'font'
			? __( 'Font', 'dynamic-product-options-for-woocommerce' )
			: __( 'Image', 'dynamic-product-options-for-woocommerce' );

	return (
		<div
			className={ `dpo-choices${ extra ? ' dpo-choices--media' : '' }` }
		>
			<div className="dpo-choices__head">
				<span />
				<span>
					{ __( 'Title', 'dynamic-product-options-for-woocommerce' ) }
				</span>
				{ extra && <span>{ mediaLabel }</span> }
				<span>
					{ __(
						'Price Type',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<span>
					{ __(
						'Regular',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<span className="dpo-choices__pro-col">
					{ __( 'Sales', 'dynamic-product-options-for-woocommerce' ) }
					{ ! proActive && <em className="dpo-pro-tag">Pro</em> }
				</span>
				<span>
					{ __(
						'Active',
						'dynamic-product-options-for-woocommerce'
					) }
				</span>
				<span />
			</div>

			<DndContext
				sensors={ sensors }
				collisionDetection={ closestCenter }
				onDragEnd={ onDragEnd }
			>
				<SortableContext
					items={ choices.map( ( c ) => c.uid ) }
					strategy={ verticalListSortingStrategy }
				>
					{ choices.map( ( choice, idx ) => (
						<ChoiceRow
							key={ choice.uid }
							choice={ choice }
							index={ idx }
							priceOptions={ priceOptions }
							proActive={ proActive }
							extra={ extra }
							onPatch={ ( delta ) => setChoice( idx, delta ) }
							onRemove={ () => removeChoice( idx ) }
						/>
					) ) }
				</SortableContext>
			</DndContext>

			<div className="dpo-choices__foot">
				<button
					type="button"
					className="dpo-btn dpo-btn--primary dpo-choices__add"
					onClick={ addChoice }
					disabled={ ! canAdd }
				>
					<Plus size={ 15 } />
					{ __(
						'Add New Option',
						'dynamic-product-options-for-woocommerce'
					) }
				</button>
				{ ! canAdd && (
					<p className="dpo-choices__cap">
						{ sprintf(
							/* translators: %d: free choice cap */
							__(
								'The free version allows up to %d options. Upgrade for unlimited.',
								'dynamic-product-options-for-woocommerce'
							),
							FREE_CAP
						) }
					</p>
				) }
			</div>
		</div>
	);
}
