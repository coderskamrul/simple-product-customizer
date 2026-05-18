/**
 * Builder state for a single option set: the field tree (managed by a
 * reducer), the selected field, the set title/status, dirty tracking, and
 * load/save side-effects. This is the heart of the builder screen.
 *
 * The reducer owns every structural mutation so the canvas, palette and
 * inspector only ever dispatch intent — never mutate the tree directly.
 *
 * @package DPO\Admin
 */

import {
	createContext,
	useContext,
	useReducer,
	useCallback,
	useEffect,
	useState,
} from '@wordpress/element';
import * as api from '../api/endpoints';
import { errorMessage } from '../api/client';
import {
	createNode,
	cloneNode,
	removeNode,
	insertNode,
	findNode,
	mapTree,
} from './treeOps';

const BuilderContext = createContext( {} );

/** Initial reducer state. */
const initialState = {
	id: 'new',
	title: '',
	status: 'draft',
	tree: [],
	selectedId: null,
	dirty: false,
};

/**
 * Builder reducer — every structural field-tree operation lives here.
 *
 * Actions:
 *  HYDRATE      replace state from a fetched set
 *  SET_META     patch title/status
 *  ADD          add a node ({ fieldType, parentId, index })
 *  UPDATE       shallow-merge a patch into a node ({ id, patch })
 *  REMOVE       delete a node ({ id })
 *  DUPLICATE    clone a node next to itself ({ id })
 *  MOVE         relocate a node ({ id, parentId, index })
 *  SELECT       set the selected field ({ id })
 *  MARK_SAVED   clear the dirty flag + adopt the persisted id
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 * @return {Object} Next state.
 */
function reducer( state, action ) {
	switch ( action.type ) {
		case 'HYDRATE':
			return {
				id: action.set.id,
				title: action.set.title || '',
				status: action.set.status || 'draft',
				tree: Array.isArray( action.set.fields )
					? action.set.fields
					: [],
				selectedId: null,
				dirty: false,
			};

		case 'SET_META':
			return { ...state, ...action.patch, dirty: true };

		case 'ADD': {
			const node = createNode(
				action.fieldType,
				action.parentId || ''
			);
			const tree = insertNode( state.tree, node, {
				parentId: action.parentId || '',
				index: action.index,
			} );
			return {
				...state,
				tree,
				selectedId: node.id,
				dirty: true,
			};
		}

		case 'UPDATE': {
			const tree = mapTree( state.tree, ( n ) =>
				n.id === action.id ? { ...n, ...action.patch } : n
			);
			return { ...state, tree, dirty: true };
		}

		case 'REMOVE': {
			const [ tree ] = removeNode( state.tree, action.id );
			return {
				...state,
				tree,
				selectedId:
					state.selectedId === action.id
						? null
						: state.selectedId,
				dirty: true,
			};
		}

		case 'DUPLICATE': {
			const original = findNode( state.tree, action.id );
			if ( ! original ) {
				return state;
			}
			const copy = cloneNode( original, original.parent );
			// Insert right after the original within the same parent.
			const parentNode = original.parent
				? findNode( state.tree, original.parent )
				: null;
			const siblings =
				parentNode && parentNode.children
					? parentNode.children
					: state.tree;
			const idx =
				siblings.findIndex( ( n ) => n.id === action.id ) + 1;
			const tree = insertNode( state.tree, copy, {
				parentId: original.parent,
				index: idx,
			} );
			return {
				...state,
				tree,
				selectedId: copy.id,
				dirty: true,
			};
		}

		case 'MOVE': {
			const [ without, moved ] = removeNode( state.tree, action.id );
			if ( ! moved ) {
				return state;
			}
			const tree = insertNode( without, moved, {
				parentId: action.parentId || '',
				index: action.index,
			} );
			return { ...state, tree, dirty: true };
		}

		case 'SELECT':
			return { ...state, selectedId: action.id };

		case 'MARK_SAVED':
			return {
				...state,
				id: action.id ?? state.id,
				dirty: false,
			};

		default:
			return state;
	}
}

/**
 * Provider — loads the set behind `setId` and exposes the reducer + save.
 *
 * @param {Object}      props          Component props.
 * @param {string}      props.setId    Set id from the route ("new" allowed).
 * @param {JSX.Element} props.children Subtree.
 * @return {JSX.Element} Provider.
 */
export function BuilderProvider( { setId, children } ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );
	const [ loading, setLoading ] = useState( true );
	const [ loadError, setLoadError ] = useState( '' );
	const [ saving, setSaving ] = useState( false );

	useEffect( () => {
		let cancelled = false;
		setLoading( true );
		setLoadError( '' );
		api.getSet( setId )
			.then( ( res ) => {
				if ( cancelled ) {
					return;
				}
				dispatch( { type: 'HYDRATE', set: res.set } );
			} )
			.catch( ( e ) => {
				if ( ! cancelled ) {
					setLoadError( errorMessage( e ) );
				}
			} )
			.finally( () => {
				if ( ! cancelled ) {
					setLoading( false );
				}
			} );
		return () => {
			cancelled = true;
		};
	}, [ setId ] );

	/**
	 * Persist the full field tree (server derives the required map).
	 *
	 * @return {Promise<number>} The persisted set id.
	 */
	const save = useCallback( async () => {
		setSaving( true );
		try {
			const res = await api.saveSet( {
				id: state.id,
				title:
					state.title ||
					/* translators: default option set title */
					'Untitled',
				status: state.status,
				fields: JSON.stringify( state.tree ),
				css: '',
			} );
			dispatch( { type: 'MARK_SAVED', id: res.id } );
			return res.id;
		} finally {
			setSaving( false );
		}
	}, [ state.id, state.title, state.status, state.tree ] );

	const selected = state.selectedId
		? findNode( state.tree, state.selectedId )
		: null;

	const value = {
		...state,
		selected,
		loading,
		loadError,
		saving,
		dispatch,
		save,
	};

	return (
		<BuilderContext.Provider value={ value }>
			{ children }
		</BuilderContext.Provider>
	);
}

/**
 * Access the builder store.
 *
 * @return {Object} Builder store API.
 */
export function useBuilder() {
	return useContext( BuilderContext );
}
