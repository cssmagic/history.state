# API 文档

## JavaScript 接口 <a name="js-api">&nbsp;</a>

### `historyState.isSupported()` <a name="js-api--isSupported">&nbsp;</a>

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

***

### [已弃用] ~~`historyState.polyfill()`~~ <a name="js-api--polyfill">&nbsp;</a>

初始化方法。

（注：从 2.0 版开始，此方法会自动执行，无需手动调用。）
