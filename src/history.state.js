/**
 * history.state - Polyfill `history.state` on iOS 5- and Android 4.3-.
 * Released under the MIT license.
 * https://github.com/cssmagic/history.state
 */
var historyState = function (window) {
	'use strict'

	// namespace
	var ns = {}

	// shortcut
	var history = window.history

	// util
	function _bind() {

	}

	function _hasHistoryAPI() {
		return 'onpopstate' in window &&
			'replaceState' in history && typeof history.replaceState === 'function' &&
			'replaceState' in history && typeof history.replaceState === 'function'
	}
	function _hasHistoryState() {
		return 'state' in history
	}

	// fn
	function polyfill() {
		_bind()
	}
	function isSupported() {
		return _hasHistoryAPI() && _hasHistoryState()
	}

	// api
	ns.polyfill = polyfill
	ns.isSupported = isSupported

	/** DEBUG_INFO_START **/
	//exports for unit test
	ns.__hasHistoryAPI = _hasHistoryAPI
	ns.__hasHistoryState = _hasHistoryState
	/** DEBUG_INFO_END **/

	// exports
	return ns

}(window)
