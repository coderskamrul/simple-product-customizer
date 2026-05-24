/**
 * File-upload field behaviour.
 *
 * On file select/drop: validate count + size against the data-* limits the
 * renderer put on `.dpo-upload__input`, POST each file as FormData (field
 * `dpo_file`, plus `dpo_nonce` = dpoStore.uploadNonce) to
 * `dpoStore.restUrl + 'upload'` with an XMLHttpRequest progress bar, then
 * store the accumulated `[{ name, path }]` JSON in the hidden input
 * (`.dpo-upload__data`, name `dpo_input_{id}`) and render the item list.
 *
 * The upload REST route returns `{ ok:true, file:{ url, name } }`; we map
 * `path = file.url` for the §9 [{name,path}] contract.
 *
 * @package DPO\Store
 */

import { __ } from '@wordpress/i18n';

const TD = 'dynamic-product-options-for-woocommerce';

/**
 * Read the localised store config defensively.
 *
 * @return {object} dpoStore global or {}.
 */
function store() {
	return ( typeof window !== 'undefined' && window.dpoStore ) || {};
}

/**
 * Wire one fileupload field. Returns a cleanup function.
 *
 * @param {HTMLElement} fieldEl  `.dpo-field` wrapper (type=fileupload).
 * @param {Function}    onChange Called after the file list changes.
 * @return {Function} Detach handler.
 */
export function initUpload( fieldEl, onChange ) {
	const root = fieldEl.querySelector( '.dpo-upload' );
	if ( ! root ) {
		return () => {};
	}
	const input = root.querySelector( '.dpo-upload__input' );
	const hidden = root.querySelector( '.dpo-upload__data' );
	const progress = root.querySelector( '.dpo-upload__progress' );
	const bar = root.querySelector( '.dpo-upload__bar' );
	const result = root.querySelector( '.dpo-upload__result' );
	const dropzone = root.querySelector( '.dpo-dropzone' );
	if ( ! input || ! hidden ) {
		return () => {};
	}

	const maxSizeMb =
		parseInt( input.getAttribute( 'data-max-size' ) || '0', 10 ) || 0;
	const maxBytes = maxSizeMb > 0 ? maxSizeMb * 1024 * 1024 : 0;
	const minCount =
		parseInt( input.getAttribute( 'data-min' ) || '0', 10 ) || 0;
	const maxCount =
		parseInt( input.getAttribute( 'data-max' ) || '0', 10 ) || 0;
	const errSize =
		input.getAttribute( 'data-error-size' ) ||
		__( 'A file exceeds the size limit.', TD );
	const errMax =
		input.getAttribute( 'data-error-max' ) ||
		__( 'Too many files selected.', TD );

	let files = [];
	try {
		files = hidden.value ? JSON.parse( hidden.value ) || [] : [];
	} catch ( e ) {
		files = [];
	}

	/**
	 * Persist the list to the hidden input + repaint, then notify.
	 *
	 * @return {void}
	 */
	const sync = () => {
		hidden.value = files.length ? JSON.stringify( files ) : '';
		paint();
		if ( typeof onChange === 'function' ) {
			onChange();
		}
	};

	/**
	 * Show an error message inside the result region.
	 *
	 * @param {string} msg Message.
	 * @return {void}
	 */
	const showError = ( msg ) => {
		const errEl = fieldEl.querySelector( '.dpo-field__error' );
		if ( errEl ) {
			errEl.textContent = msg;
			errEl.classList.add( 'dpo-field__error--visible' );
		}
	};

	/**
	 * Format a byte count as a human-readable size.
	 *
	 * @param {number} bytes Size in bytes.
	 * @return {string} Formatted size (e.g. "136.31 KB").
	 */
	const formatSize = ( bytes ) => {
		const n = Number( bytes ) || 0;
		if ( n <= 0 ) {
			return '';
		}
		if ( n < 1024 ) {
			return n + ' B';
		}
		if ( n < 1024 * 1024 ) {
			return ( n / 1024 ).toFixed( 2 ) + ' KB';
		}
		return ( n / ( 1024 * 1024 ) ).toFixed( 2 ) + ' MB';
	};

	/** Whether a path/name points at a previewable image. */
	const isImage = ( path ) =>
		/\.(png|jpe?g|gif|webp|svg|bmp)$/i.test( String( path || '' ) );

	/**
	 * Repaint the uploaded-file list: thumbnail, name, size, a completed
	 * progress bar and a remove control.
	 *
	 * @return {void}
	 */
	function paint() {
		if ( ! result ) {
			return;
		}
		result.innerHTML = '';
		files.forEach( ( file, i ) => {
			const item = document.createElement( 'div' );
			item.className = 'dpo-upload-item';

			const rm = document.createElement( 'button' );
			rm.type = 'button';
			rm.className = 'dpo-upload-item__remove';
			rm.setAttribute( 'aria-label', __( 'Remove file', TD ) );
			rm.textContent = '×';
			rm.addEventListener( 'click', () => {
				files.splice( i, 1 );
				sync();
			} );

			const thumb = document.createElement( 'span' );
			thumb.className = 'dpo-upload-item__thumb';
			if ( isImage( file.path || file.name ) && file.path ) {
				const img = document.createElement( 'img' );
				img.src = file.path;
				img.alt = '';
				thumb.appendChild( img );
			} else {
				thumb.classList.add( 'is-file' );
			}

			const body = document.createElement( 'span' );
			body.className = 'dpo-upload-item__body';

			const top = document.createElement( 'span' );
			top.className = 'dpo-upload-item__top';
			const name = document.createElement( 'span' );
			name.className = 'dpo-upload-item__name';
			name.textContent = file.name || '';
			const size = document.createElement( 'span' );
			size.className = 'dpo-upload-item__size';
			size.textContent = formatSize( file.size );
			top.appendChild( name );
			top.appendChild( size );

			const track = document.createElement( 'span' );
			track.className = 'dpo-upload-item__bar';
			const fill = document.createElement( 'span' );
			fill.className = 'dpo-upload-item__bar-fill';
			fill.style.width = '100%';
			track.appendChild( fill );

			body.appendChild( top );
			body.appendChild( track );

			item.appendChild( rm );
			item.appendChild( thumb );
			item.appendChild( body );
			result.appendChild( item );
		} );
	}

	/**
	 * Upload a single File via XHR with progress.
	 *
	 * @param {File} file Selected file.
	 * @return {Promise<object>} Resolves with { name, path }.
	 */
	const uploadOne = ( file ) =>
		new Promise( ( resolve, reject ) => {
			const cfg = store();
			const url = ( cfg.restUrl || '' ) + 'upload';
			const fd = new FormData();
			fd.append( 'dpo_file', file );
			fd.append( 'dpo_nonce', cfg.uploadNonce || '' );

			const xhr = new XMLHttpRequest();
			xhr.open( 'POST', url, true );
			if ( cfg.nonce ) {
				xhr.setRequestHeader( 'X-WP-Nonce', cfg.nonce );
			}
			if ( progress ) {
				progress.hidden = false;
			}
			xhr.upload.onprogress = ( e ) => {
				if ( e.lengthComputable && bar ) {
					bar.style.width =
						Math.round( ( e.loaded / e.total ) * 100 ) + '%';
				}
			};
			xhr.onload = () => {
				if ( progress ) {
					progress.hidden = true;
				}
				if ( bar ) {
					bar.style.width = '0%';
				}
				let json = null;
				try {
					json = JSON.parse( xhr.responseText );
				} catch ( e ) {
					json = null;
				}
				if (
					xhr.status >= 200 &&
					xhr.status < 300 &&
					json &&
					json.ok &&
					json.file
				) {
					resolve( {
						name: json.file.name || file.name,
						path: json.file.url || json.file.path || '',
						size: file.size || 0,
					} );
				} else {
					reject(
						new Error(
							( json && json.message ) ||
								__( 'Upload failed.', TD )
						)
					);
				}
			};
			xhr.onerror = () => {
				if ( progress ) {
					progress.hidden = true;
				}
				reject( new Error( __( 'Upload failed.', TD ) ) );
			};
			xhr.send( fd );
		} );

	/**
	 * Validate + upload a FileList.
	 *
	 * @param {FileList} list Selected files.
	 * @return {void}
	 */
	const handleFiles = ( list ) => {
		const incoming = Array.prototype.slice.call( list || [] );
		if ( ! incoming.length ) {
			return;
		}
		if ( maxCount > 0 && files.length + incoming.length > maxCount ) {
			showError( errMax );
			return;
		}
		const valid = [];
		for ( let i = 0; i < incoming.length; i++ ) {
			const f = incoming[ i ];
			if ( maxBytes > 0 && f.size > maxBytes ) {
				showError( errSize );
				continue;
			}
			valid.push( f );
		}
		valid.reduce(
			( chain, f ) =>
				chain
					.then( () => uploadOne( f ) )
					.then( ( rec ) => {
						files.push( rec );
						sync();
					} )
					.catch( ( err ) => {
						showError(
							err && err.message
								? err.message
								: __( 'Upload failed.', TD )
						);
					} ),
			Promise.resolve()
		);
	};

	const onInput = () => handleFiles( input.files );
	const onDragOver = ( e ) => {
		e.preventDefault();
		if ( dropzone ) {
			dropzone.classList.add( 'dpo-dropzone--over' );
		}
	};
	const onDragLeave = () => {
		if ( dropzone ) {
			dropzone.classList.remove( 'dpo-dropzone--over' );
		}
	};
	const onDrop = ( e ) => {
		e.preventDefault();
		if ( dropzone ) {
			dropzone.classList.remove( 'dpo-dropzone--over' );
		}
		if ( e.dataTransfer && e.dataTransfer.files ) {
			handleFiles( e.dataTransfer.files );
		}
	};

	input.addEventListener( 'change', onInput );
	if ( dropzone ) {
		dropzone.addEventListener( 'dragover', onDragOver );
		dropzone.addEventListener( 'dragleave', onDragLeave );
		dropzone.addEventListener( 'drop', onDrop );
	}

	// Expose min for validate.js (it reads data-min directly off input).
	void minCount;
	paint();

	return () => {
		input.removeEventListener( 'change', onInput );
		if ( dropzone ) {
			dropzone.removeEventListener( 'dragover', onDragOver );
			dropzone.removeEventListener( 'dragleave', onDragLeave );
			dropzone.removeEventListener( 'drop', onDrop );
		}
	};
}
