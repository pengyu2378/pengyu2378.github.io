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
    socialLinks: [{ icon: 'github', link: 'https://github.com/pengyu2378' }]
  }
})
