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
import { useGlobalStyle } from '../store/globalStyle';
import { cssVars } from '../store/globalStyleModel';
import SortableContainer from './SortableContainer';
import AddFieldButton from './AddFieldButton';
import FieldPreview from '../preview/FieldPreview';

/** A neutral product-gallery placeholder. */
function Gallery() {
	return (
		<div className="spcus-stage__gallery" aria-hidden="true">
			<div className="spcus-stage__gallery-main">
				<ImageIcon size={ 64 } />
			</div>
			<div className="spcus-stage__gallery-thumbs">
				{ [ 0, 1, 2 ].map( ( i ) => (
					<div key={ i } className="spcus-stage__thumb">
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
			className="spcus-empty"
			onClick={ () => openPicker( '' ) }
		>
			<span className="spcus-empty__icon">
				<MousePointerClick size={ 28 } />
			</span>
			<span className="spcus-empty__title">
				{ __(
					'Start building your options',
					'simple-product-customizer'
				) }
			</span>
			<span className="spcus-empty__text">
				{ __(
					'Add your first field — text, choices, swatches and more.',
					'simple-product-customizer'
				) }
			</span>
			<span className="spcus-empty__cta">
				{ __(
					'Add a field',
					'simple-product-customizer'
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
	const tokens = useGlobalStyle( ( s ) => s.tokens );
	const preview = view === 'preview';
	const empty = tree.length === 0;

	// Storefront theme tokens drive the in-canvas live preview (consumed by the
	// `--spcus-gs-*` fallbacks in the canvas SCSS).
	const styleVars = cssVars( tokens );

	return (
		<div
			className={ `spcus-stage${ preview ? ' is-preview' : '' }` }
			style={ styleVars }
		>
			<div className="spcus-stage__product">
				<Gallery />

				<div className="spcus-stage__summary">
					<h2 className="spcus-stage__title">
						{ __(
							'Sample Product',
							'simple-product-customizer'
						) }
					</h2>
					<div className="spcus-stage__price">
						{ formatPrice( 20 ) }
					</div>

					<div className="spcus-stage__options">
						{ empty && ! preview && <EmptyCanvas /> }

						{ empty && preview && (
							<p className="spcus-stage__hint">
								{ __(
									'No options to preview yet.',
									'simple-product-customizer'
								) }
							</p>
						) }

						{ ! empty && preview && (
							<div className="spcus-canvas__list">
								{ tree.map( ( node ) => (
									<div
										key={ node.id }
										className={ `spcus-card spcus-card--w-${
											node.width || 'full'
										} is-preview` }
									>
										<div className="spcus-card__body">
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
							className="spcus-stage__atc"
							disabled
						>
							{ __(
								'Add to cart',
								'simple-product-customizer'
							) }
						</button>
					) }
				</div>
			</div>
		</div>
	);
}
