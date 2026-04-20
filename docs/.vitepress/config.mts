import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Personal Blog',
  description: '记录学习与生活',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '日志', link: '/posts/' },
      { text: '关于', link: '/about' }
    ],
    sidebar: [
      {
        text: '2025 日志',
        items: [
          { text: 'hello-world', link: '/posts/2025-hello-world.md' },
          { text: '我的第一篇博客文章', link: '/posts/2025-我的第一篇博客文章.md' },
        ]
      },
      {
        text: '2026 日志',
        items: [
          { text: '迁移复盘', link: '/posts/2026-04-18-vitepress-migration-retrospective' },
          { text: 'VitePress 文档阅读 01', link: '/posts/2026-04-19-vitepress-docsRead-01' },
          { text: 'VitePress 文档阅读 02', link: '/posts/2026-04-20-vitepress-docsRead-02' },
        ]
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/pengyu2378' }]
  }
})
