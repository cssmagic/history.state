void function () {

	// shortcut
	var history = window.history || {}

	// sandbox
	var src = '_sandbox.html'
	var $iframeSandbox = $('<iframe></iframe>')
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
	var sandbox = $iframeSandbox[0].contentWindow
	//var $sandbox = $(sandbox)

	// util
	var callbacks = {}
	function _registerSandboxReady(fn) {
		var key = (Date.now() + Math.random()).toString(36)
		$iframeSandbox.attr('src', src + '?key=' + key)
		callbacks[key] = fn
	}

	function _listenSandboxReady() {
		_.dom.$win.on('sandbox-ready', function (ev, key) {
			var fn = callbacks[key]
			if (_.isFunction(fn)) {
				fn()
			}
		})
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

	describe('APIs', function () {
		before(function () {
			_listenSandboxReady()
		})
		describe('historyState.polyfill()', function () {
			it('does basic functionality', function () {
				//...
			})
		})
		describe('historyState.isSupported()', function () {
			it('returns false on iOS 5-', function (done) {
				if (_.ua.isIOS && _.str.toFloat(_.ua.osVersion) < 6) {
					_registerSandboxReady(function () {
						console.log('ready1')
						expect(sandbox.historyState.isSupported()).to.be.false
						done()
					})
				} else {
					done()
				}
			})
			it('returns false on Android 4.3-', function (done) {
				if (_.ua.isAndroid && _.str.toFloat(_.ua.osVersion) < 4.4) {
					_registerSandboxReady(function () {
						expect(sandbox.historyState.isSupported()).to.be.false
						done()
					})
				} else {
					done()
				}
			})
			it('returns true after polyfill on browsers supporting history api', function (done) {
				if (!historyState.isSupported() && historyState.__hasHistoryAPI()) {
					_registerSandboxReady(function () {
						console.log('test2')
						sandbox.historyState.polyfill()
						expect(sandbox.historyState.isSupported()).to.be.true
						done()
					})
				} else {
					done()
				}
			})
		})
	})

}()

