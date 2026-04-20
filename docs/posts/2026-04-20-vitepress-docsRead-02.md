---
title: 今日阅读：VitePress文档-02
author: Pengyu Jiang
date: 2026-04-20
---

# {{$frontmatter.title}}

## Markdown 扩展
### raw 容器
- 可以在这个页面里想展示一些自带样式的第三方内容，解决样式污染，与Vitepress自带样式隔离
::: info Tips
raw容器是进阶操作，初期可以暂时忽略。后期有需要可以在笔记中插入一个 Element Plus 的对话框示例 / 以及嵌入原生的HTML/CSS演示
:::

::: raw
Wraps in a `<div class="vp-raw">`
:::

- 创建 docs/postcss.config.mjs 文件并将以下内容添加到其中：
```js
// config.ts
import { postcssIsolateStyles } from 'vitepress'

export default {
  plugins: [postcssIsolateStyles()]
}
```

> [!TIP]
> 除了用自定义容器来渲染警报，也可以使用 "> [...]"来渲染Github风格的警报

### 代码高亮
VitePress 使用 Shiki 在 Markdown 代码块中使用彩色文本实现语法高亮。Shiki 支持多种编程语言。需要做的就是将有效的语言别名附加到代码块的开头
> [!CAUTION]
> 可以通过{单行、多行、混合}来实现代码的"行高亮"

### 代码块中聚焦
在某一行上添加 // [!code focus] 注释将聚焦它并模糊代码的其他部分。

此外，可以使用 `// [!code focus:<lines>] `定义要聚焦的行数。

### 代码组
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

<!-- 文件名默认用作标题 -->

<!-- <<< @/snippets/snippet.js -->

<!-- 也可以提供定制的代码组 -->

<!-- <<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region] -->

### 图片懒加载
通过在配置文件中将 lazyLoading 设置为 true，可以为通过 markdown 添加的每张图片启用懒加载。
```js
export default {
  markdown: {
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    }
  }
}
```

## 资源处理
- 静态资源尽量使用相对路径来引用资源
- 常见的图像，媒体和字体文件会被自动检测并视作资源。
### public目录
可以将静态资源放置在源目录的Public目录下
- 放置在 public 中的资源将按原样复制到输出目录的根目录中。

## 在 MarkDown 使用 Vue
> [!避免在 Markdown 中使用 <style_scoped>]
> 在 Markdown 中使用时，<style_scoped> 需要为当前页面的每个元素添加特殊属性，这将显著增加页面的大小。当我们需要局部范围的样式时 <style_module> 是首选。





<script setup>
import { useData } from 'vitepress'

// 拿到当前页面的所有元数据
const { page, frontmatter } = useData()
</script>

---
> 💡 本文标题是：**{{ page.title }}**
> 
> ✍️ 作者：{{ frontmatter.author }} | 发布日期：{{ frontmatter.date }}
> 
> 🔗 文件路径：`{{ page.relativePath }}`