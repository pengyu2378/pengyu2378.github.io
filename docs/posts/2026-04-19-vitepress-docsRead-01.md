---
title: 今日阅读：VitePress文档-01
date: 2026-04-19
---

::: info 自定义容器
This is an 自定义容器 box. 我用来测试
INFO--灰色 / TIP--紫色 / WARNING--浅黄 / DANGER--红色 / details--缩放
:::

::: details 不要点开我
```js
console.log('Hello，调皮鬼，说了不要点开啦~')
```
:::

- 可以通过在站点配置中添加以下内容来全局设置自定义标题
```ts
// config.ts
export default defineConfig({
  // ...
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  }
  // ...
})
```