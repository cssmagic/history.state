# history.state

> Polyfill `history.state` on iOS 5- and Android 4.3-.

## 简介

iOS 5+ 和 Android 4+ 已经比较稳定地实现了 HTML5 History API（`history.pushState()`、`.replaceState()` 方法和 `popstate` 事件），但直到 iOS 6+ 和 Android 4.4+ 才支持 `history.state` 属性。

这个属性还是很重要的，通过它，脚本在任何时候都可以获知当前处于哪个 state，而不是只能在 `popstate` 事件的回调中通过 `event.state` 来获知。

本项目将在那些支持 `popstate` 事件但不支持 `history.state` 属性的浏览器中模拟原生的 `history.state` 行为。

## 兼容性

作为一个 polyfill 脚本，本项目是透明的：

* 在不需要打补丁的环境中，直接退出
* 在需要打补丁的环境中，模拟原生行为
* 在无法打补丁的环境中，向控制台报错后退出

本项目的初衷是面向移动浏览器的，将在以下移动平台的主流浏览器中发挥作用：

* iOS 5.x
* Android 4.0 ~ 4.3

（更早的移动浏览器对 HTML5 History API 的实现有缺陷，无法保证效果。）

## 安装

0. 通过 Bower 安装：

	```sh
	$ bower install history.state
	```

0. 在页面中加载本项目的脚本文件：

	```html
	<script src="bower_components/history.state/src/history.state.js"></script>
	```

## API 文档

所有文档入口在 [Wiki 页面](https://github.com/cssmagic/history.state/wiki)，快去看吧！

## 单元测试

0. 把本项目的代码 fork 并 clone 到本地。
0. 在本项目的根目录运行 `bower install`，安装必要的依赖。
0. 在浏览器中打开 `test/test.html` 即可运行单元测试。

如果想在移动设备上运行单元测试，可尝试以下任一方法：

* 在本地建立 Web 服务，以便移动设备通过局域网访问上述单元测试页面。
* 把本项目的所有文件（及必要的依赖）发布至公网，以便移动设备访问上述单元测试页面。

## 谁在用？

以下开源项目采用本项目作为基础组件：

* [Subview](https://github.com/cssmagic/subview)
* [CMUI](https://github.com/CMUI/CMUI)

因此，本项目运行在以下网站：

* [百姓网 - 手机版](http://m.baixing.com/)

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
