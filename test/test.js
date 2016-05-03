void function () {
	'use strict'

	// check env
	if (typeof window === 'undefined') {
		console.error('[history.state] Open test.html in browsers to run tests!')
		return
	}

	// util
	function _getRandomStr() {
		return (Date.now() + Math.random()).toString(36)
	}

	// sandbox
	var registeredTests = {}
	var src = '_sandbox.html'
	var $iframeSandbox
	function _initSandbox() {
		$iframeSandbox = $('<iframe></iframe>')
			.attr({
				src: 'about:blank',
				id: "sandbox",
				frameborder: 0
			})
			.css({
				display: 'block',
				height: 0
			})
			.appendTo(document.body)
	}
	function _getSandboxWindow() {
		return $iframeSandbox[0].contentWindow
	}
	function _startSandboxTest(fn) {
		var testId = _getRandomStr()
		registeredTests[testId] = fn
		$iframeSandbox.attr('src', src + '?testId=' + testId)
	}

	// bridge for sandbox
	// shouldn't run tests in sandbox scope, so post message to tell host scope to run tests
	function _listenSandboxMessage() {
		window.addEventListener('message', function (ev) {
			var data = JSON.parse(ev.data || '{}')
			var fn = registeredTests[data.testId]
			if (_.isFunction(fn)) fn()
		}, false)
	}

	describe('Util', function () {
		describe('historyState.__hasHistoryAPI()', function () {
			it('returns false if no `history.pushState()` method', function () {
				if (!history.pushState) {
					expect(historyState.__hasHistoryAPI()).to.be.false
				}
			})
			it('returns false if no `history.replaceState()` method', function () {
				if (!history.replaceState) {
					expect(historyState.__hasHistoryAPI()).to.be.false
				}
			})
			it('returns false if no `onpopstate` event', function () {
				if (window.onpopstate === undefined) {
					expect(historyState.__hasHistoryAPI()).to.be.false
				}
			})
		})
		describe('historyState.__hasHistoryState()', function () {
			it('returns false if no `history.state` property', function () {
				if (history.state === undefined) {
					expect(historyState.__hasHistoryState()).to.be.false
				}
			})
		})
	})

	describe('API', function () {
		before(function () {
			_initSandbox()
			_listenSandboxMessage()
		})
		describe('historyState.polyfill()', function () {
			it('fulfills polyfill - updating `history.state` after push state', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						sandboxWindow.historyState.polyfill()
						var key = _getRandomStr()
						var state = {
							testKey: key
						}
						sandboxWindow.history.pushState(state, '')
						var keyInState = sandboxWindow.history.state.testKey || ''
						expect(keyInState).to.equal(key)
						done()
					})
				} else {
					done()
				}
			})
			it('fulfills polyfill - updating `history.state` after replace state', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						sandboxWindow.historyState.polyfill()
						var key = _getRandomStr()
						var state = {
							testKey: key
						}
						sandboxWindow.history.replaceState(state, '')
						var keyInState = sandboxWindow.history.state.testKey || ''
						expect(keyInState).to.equal(key)
						done()
					})
				} else {
					done()
				}
			})
			it('fulfills polyfill - updating `history.state` after history back', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						sandboxWindow.historyState.polyfill()
						var key = _getRandomStr()
						var state = {
							testKey: key
						}
						sandboxWindow.history.replaceState(state, '')
						sandboxWindow.history.pushState(null, '')
						sandboxWindow.history.back()
						setTimeout(function () {
							var keyInState = sandboxWindow.history.state.testKey || ''
							expect(keyInState).to.equal(key)
							done()
						}, 100)
					})
				} else {
					done()
				}
			})
			it('fulfills polyfill - updating `history.state` after history forward', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						sandboxWindow.historyState.polyfill()
						var key = _getRandomStr()
						var state = {
							testKey: key
						}
						sandboxWindow.history.replaceState(null, '')
						sandboxWindow.history.pushState(state, '')
						sandboxWindow.history.back()
						sandboxWindow.history.forward()
						setTimeout(function () {
							var keyInState = sandboxWindow.history.state.testKey || ''
							expect(keyInState).to.equal(key)
							done()
						}, 100)
					})
				} else {
					done()
				}
			})
		})
		describe('historyState.isSupported()', function () {
			it('returns false on iOS 5-', function (done) {
				if (_.ua.isIOS && _.str.toFloat(_.ua.osVersion) < 6) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						expect(sandboxWindow.historyState.isSupported()).to.be.false
						done()
					})
				} else {
					done()
				}
			})
			it('returns false on Android < 4.4 (WebKit < 537)', function (done) {
				// android version is not reliable, cuz browser app could include its own core.
				var ua = _.ua.str
				var webKitVer = (/\bAppleWebKit[\/: ]?(\d+\.\d+)\b/i.exec(ua) || [0,'0'])[1]
				if (_.ua.isAndroid && _.str.toFloat(webKitVer) < 537) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						expect(sandboxWindow.historyState.isSupported()).to.be.false
						done()
					})
				} else {
					done()
				}
			})
			it('returns true after polyfill on browsers supporting history api', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_startSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						sandboxWindow.historyState.polyfill()
						expect(sandboxWindow.historyState.isSupported()).to.be.true
						done()
					})
				} else {
					done()
				}
			})
		})
	})

}()

