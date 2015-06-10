void function () {
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
	function _registerSandboxTest(fn) {
		var testId = _getRandomStr()
		$iframeSandbox.attr('src', src + '?testId=' + testId)
		registeredTests[testId] = fn
	}
	function _listenSandboxReady() {
		_.dom.$body.on('sandbox-ready', function (ev, testId) {
			var fn = registeredTests[testId]
			if (_.isFunction(fn)) fn()
		})
	}

	// bridge for sandbox
	// shouldn't run tests in sandbox scope, so use event to trigger tests in host scope
	mocha.runRegisteredTest = function (testId) {
		_.dom.$body.trigger('sandbox-ready', [testId])
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
			_listenSandboxReady()
		})
		describe('historyState.polyfill()', function () {
			it('fulfills polyfill - updating `history.state` after push state', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_registerSandboxTest(function () {
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
					_registerSandboxTest(function () {
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
			it('fulfills polyfill - updating `history.state` after `popstate` event', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_registerSandboxTest(function () {
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
		})
		describe('historyState.isSupported()', function () {
			it('returns false on iOS 5-', function (done) {
				if (_.ua.isIOS && _.str.toFloat(_.ua.osVersion) < 6) {
					_registerSandboxTest(function () {
						var sandboxWindow = _getSandboxWindow()
						expect(sandboxWindow.historyState.isSupported()).to.be.false
						done()
					})
				} else {
					done()
				}
			})
			it('returns false on Android 4.3-', function (done) {
				if (_.ua.isAndroid && _.str.toFloat(_.ua.osVersion) < 4.4) {
					_registerSandboxTest(function () {
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
					_registerSandboxTest(function () {
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

