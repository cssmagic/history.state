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
		window.addEventListener('popstate', function (ev) {
			history['state'] = ev.state
		})
	}
	function _inject() {
		var proto = history.__proto__
		var oldPushState = proto.pushState
		var oldReplaceState = proto.replaceState
		proto.pushState = function () {
			oldPushState.apply(this, arguments)
			this.state = arguments[0]
		}
		proto.replaceState = function () {
			oldReplaceState.apply(this, arguments)
			this.state = arguments[0]
		}
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
		if (_hasHistoryAPI()) {
			if (!_hasHistoryState()) {
				history['state'] = null
				_bind()
				_inject()
			}
		} else {
			var msg = '[history.state] This browser doesn\'t support History APIs. Cannot fulfill polyfill.'
			var log = window.console && (console.error || console.warn || console.log)
			if (typeof log === 'function') log(msg)
		}
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
