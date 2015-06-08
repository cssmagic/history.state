# API 文档

## JavaScript 接口<a name="js-api"></a>

### `historyState.polyfill()`<a name="js-api-init"></a>

初始化方法。

本项目是一个 polyfill 脚本，此初始化方法的行为如下：

* 在不需要打补丁的环境中，直接退出
* 在需要打补丁的环境中，模拟原生行为
* 在无法打补丁的环境中，向控制台报错后退出

**注意**：此初始化方法需要尽可能早地调用。在此方法调用之前创建的 state 可能无法通过 `history.state` 属性获取。

#### 参数

（无）

#### 返回值

（无）

#### 示例

```js
// 在支持 HTML5 History API 的浏览器中运行：
historyState.polyfill()

history.replaceState({test: 1}, '')
history.state  // => {test: 1}
```

***

### `historyState.isSupported()`<a name="js-api-sample"></a>

判断当前环境是否支持通过 `history.state` 属性获取当前 state。

这是一个非常重要的方法，如果你的业务需要使用 `history.state` 特性，务必先使用此方法探测其是否可用。

#### 参数

（无）

#### 返回值

布尔值。

#### 示例

```js
// 在 iOS 5.x 或 Android 4.0~4.3 下运行：
historyState.isSupported()  // => false

historyState.polyfill()
historyState.isSupported()  // => true
```
