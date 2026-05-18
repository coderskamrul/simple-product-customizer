/**
 * Storefront analytics pings.
 *
 * Fires POST `restUrl + 'analytics/hit'` with { setId, metric }:
 *   - 'impressions' once per set when it scrolls into view (IntersectionObserver)
 *   - 'clicks'      on the first interaction within a set
 * Throttled per set + metric via localStorage (cookie fallback):
 *   impression window 18h, click window 16h.
 *
 * @package DPO\Store
 */

const IMPRESSION_WINDOW = 18 * 60 * 60 * 1000;
const CLICK_WINDOW = 16 * 60 * 60 * 1000;

/**
 * Read the localised store config defensively.
 *
 * @return {object} dpoStore global or {}.
 */
function store() {
	return ( typeof window !== 'undefined' && window.dpoStore ) || {};
}

/**
 * Throttle key for a set + metric.
 *
 * @param {number} setId  Set id.
 * @param {string} metric Metric.
 * @return {string} Storage key.
 */
function key( setId, metric ) {
	return 'dpo_a_' + metric + '_' + setId;
}

/**
 * Read a stored timestamp (localStorage, cookie fallback).
 *
 * @param {string} k Key.
 * @return {number} Epoch ms, 0 when absent.
 */
function readTs( k ) {
	try {
		const v = window.localStorage.getItem( k );
		if ( v ) {
			return parseInt( v, 10 ) || 0;
		}
	} catch ( e ) {
		/* localStorage blocked — fall through to cookie. */
	}
	const m = document.cookie.match(
		new RegExp( '(?:^|; )' + k + '=([^;]+)' )
	);
	return m ? parseInt( decodeURIComponent( m[ 1 ] ), 10 ) || 0 : 0;
}

/**
 * Persist a timestamp (localStorage, cookie fallback).
 *
 * @param {string} k  Key.
 * @param {number} ts Epoch ms.
 * @return {void}
 */
function writeTs( k, ts ) {
	try {
		window.localStorage.setItem( k, String( ts ) );
		return;
	} catch ( e ) {
		/* fall through to cookie. */
	}
	const expires = new Date( ts + IMPRESSION_WINDOW ).toUTCString();
	document.cookie =
		k + '=' + encodeURIComponent( ts ) + '; expires=' + expires +
		'; path=/; SameSite=Lax';
}

/**
 * Whether a metric for a set is still throttled.
 *
 * @param {number} setId  Set id.
 * @param {string} metric Metric.
 * @param {number} window Throttle window ms.
 * @return {boolean} True when within the window.
 */
function throttled( setId, metric, window ) {
	const last = readTs( key( setId, metric ) );
	return last > 0 && Date.now() - last < window;
}

/**
 * Send a metric ping (best-effort; failures are silent).
 *
 * @param {number} setId  Set id.
 * @param {string} metric Metric ('impressions' | 'clicks').
 * @return {void}
 */
function ping( setId, metric ) {
	const cfg = store();
	const url = ( cfg.restUrl || '' ) + 'analytics/hit';
	if ( ! cfg.restUrl || ! setId ) {
		return;
	}
	const body = JSON.stringify( { setId, metric } );
	const headers = {
		'Content-Type': 'application/json',
		'X-WP-Nonce': cfg.nonce || '',
	};

	try {
		if ( navigator.sendBeacon && metric === 'impressions' ) {
			const blob = new Blob( [ body ], {
				type: 'application/json',
			} );
			navigator.sendBeacon( url, blob );
		} else {
			window
				.fetch( url, {
					method: 'POST',
					headers,
					body,
					credentials: 'same-origin',
					keepalive: true,
				} )
				.catch( () => {} );
		}
	} catch ( e ) {
		/* never break the page on analytics. */
	}
	writeTs( key( setId, metric ), Date.now() );
}

/**
 * Attach impression + click tracking for every set under a root.
 *
 * @param {HTMLElement} root `.dpo-options` wrapper.
 * @return {Function} Cleanup function.
 */
export function initAnalytics( root ) {
	const sets = root.querySelectorAll( '.dpo-set[data-set-id]' );
	const cleanups = [];

	sets.forEach( ( setEl ) => {
		const setId = parseInt(
			setEl.getAttribute( 'data-set-id' ) || '0',
			10
		);
		if ( ! setId ) {
			return;
		}

		// Impressions via IntersectionObserver (fallback: immediate).
		const fireImpression = () => {
			if ( ! throttled( setId, 'impressions', IMPRESSION_WINDOW ) ) {
				ping( setId, 'impressions' );
			}
		};
		if ( typeof window.IntersectionObserver === 'function' ) {
			const io = new window.IntersectionObserver(
				( entries ) => {
					entries.forEach( ( e ) => {
						if ( e.isIntersecting ) {
							fireImpression();
							io.disconnect();
						}
					} );
				},
				{ threshold: 0.25 }
			);
			io.observe( setEl );
			cleanups.push( () => io.disconnect() );
		} else {
			fireImpression();
		}

		// First interaction → click.
		const onInteract = () => {
			if ( ! throttled( setId, 'clicks', CLICK_WINDOW ) ) {
				ping( setId, 'clicks' );
			}
			setEl.removeEventListener( 'change', onInteract );
			setEl.removeEventListener( 'input', onInteract );
		};
		setEl.addEventListener( 'change', onInteract );
		setEl.addEventListener( 'input', onInteract );
		cleanups.push( () => {
			setEl.removeEventListener( 'change', onInteract );
			setEl.removeEventListener( 'input', onInteract );
		} );
	} );

	return () => cleanups.forEach( ( fn ) => fn() );
}
