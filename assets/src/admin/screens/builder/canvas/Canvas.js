/**
 * The builder canvas — a faithful product-page stage (gallery + product
 * summary card) with the option fields rendered inside it, exactly where a
 * shopper would see them. In Build mode each field is editable and sortable
 * with a floating toolbar; in Preview mode the same tree renders clean and
 * read-only. An empty tree shows a friendly call-to-action.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { ImageIcon, MousePointerClick } from 'lucide-react';
import { useConfig } from '../../../store/ConfigContext';
import { useBuilder } from '../../../store/BuilderContext';
import { useBuilderUI } from '../store/builderUi';
import SortableContainer from './SortableContainer';
import AddFieldButton from './AddFieldButton';
import FieldPreview from '../preview/FieldPreview';

/** A neutral product-gallery placeholder. */
function Gallery() {
	return (
		<div className="dpo-stage__gallery" aria-hidden="true">
			<div className="dpo-stage__gallery-main">
				<ImageIcon size={ 64 } />
			</div>
			<div className="dpo-stage__gallery-thumbs">
				{ [ 0, 1, 2 ].map( ( i ) => (
					<div key={ i } className="dpo-stage__thumb">
						<ImageIcon size={ 28 } />
					</div>
				) ) }
			</div>
		</div>
	);
}

/** Empty-state shown when the set has no fields yet. */
function EmptyCanvas() {
	const { openPicker } = useBuilderUI();
	return (
		<button
			type="button"
			className="dpo-empty"
			onClick={ () => openPicker( '' ) }
		>
			<span className="dpo-empty__icon">
				<MousePointerClick size={ 28 } />
			</span>
			<span className="dpo-empty__title">
				{ __(
					'Start building your options',
					'dynamic-product-options-for-woocommerce'
				) }
			</span>
			<span className="dpo-empty__text">
				{ __(
					'Add your first field — text, choices, swatches and more.',
					'dynamic-product-options-for-woocommerce'
				) }
			</span>
			<span className="dpo-empty__cta">
				{ __(
					'Add a field',
					'dynamic-product-options-for-woocommerce'
				) }
			</span>
		</button>
	);
}

/**
 * Canvas.
 *
 * @return {JSX.Element} The product stage.
 */
export default function Canvas() {
	const { tree } = useBuilder();
	const { view } = useBuilderUI();
	const { formatPrice } = useConfig();
	const preview = view === 'preview';
	const empty = tree.length === 0;

	return (
		<div className={ `dpo-stage${ preview ? ' is-preview' : '' }` }>
			<div className="dpo-stage__product">
				<Gallery />

				<div className="dpo-stage__summary">
					<h2 className="dpo-stage__title">
						{ __(
							'Sample Product',
							'dynamic-product-options-for-woocommerce'
						) }
					</h2>
					<div className="dpo-stage__price">
						{ formatPrice( 20 ) }
					</div>

					<div className="dpo-stage__options">
						{ empty && ! preview && <EmptyCanvas /> }

						{ empty && preview && (
							<p className="dpo-stage__hint">
								{ __(
									'No options to preview yet.',
									'dynamic-product-options-for-woocommerce'
								) }
							</p>
						) }

						{ ! empty && preview && (
							<div className="dpo-canvas__list">
								{ tree.map( ( node ) => (
									<div
										key={ node.id }
										className={ `dpo-card dpo-card--w-${
											node.width || 'full'
										} is-preview` }
									>
										<div className="dpo-card__body">
											<FieldPreview node={ node } />
										</div>
									</div>
								) ) }
							</div>
						) }

						{ ! empty && ! preview && (
							<>
								<SortableContainer nodes={ tree } parentId="" />
								<AddFieldButton parentId="" />
							</>
						) }
					</div>

					{ ! preview && (
						<button
							type="button"
							className="dpo-stage__atc"
							disabled
						>
							{ __(
								'Add to cart',
								'dynamic-product-options-for-woocommerce'
							) }
						</button>
					) }
				</div>
			</div>
		</div>
	);
}
