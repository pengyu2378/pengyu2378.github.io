<template>
  <div v-if="isPostDetail" class="post-detail-page">
    <aside class="post-sidebar">
      <h2 class="sidebar-title">日志列表</h2>
      <ul class="sidebar-list">
        <li
          v-for="post in articlePosts"
          :key="post.url"
          class="sidebar-item"
          :class="{ active: isCurrentPost(post) }"
        >
          <a :href="post.url">{{ post.frontmatter.title }}</a>
          <p v-if="post.frontmatter.date" class="sidebar-date">{{ formatDate(post.frontmatter.date) }}</p>
        </li>
      </ul>
    </aside>

    <main class="post-main">
      <article class="post-card">
        <header class="post-header">
          <h1>{{ page.title }}</h1>
          <div class="post-meta">
            <span v-if="formattedDate">最近更新：{{ formattedDate }}</span>
            <span v-if="wordCount">全文字数：{{ wordCount }} 字</span>
            <span v-if="readingMinutes">阅读时长：{{ readingMinutes }} 分钟</span>
          </div>
        </header>

        <div class="post-content vp-doc">
          <Content />
        </div>
      </article>

      <nav v-if="prevPost || nextPost" class="post-pagination">
        <div class="pager-slot">
          <a v-if="prevPost" class="pager-card" :href="prevPost.url">
            <span class="pager-label">上一篇</span>
            <strong>{{ prevPost.frontmatter.title }}</strong>
          </a>
        </div>

        <div class="pager-slot align-right">
          <a v-if="nextPost" class="pager-card" :href="nextPost.url">
            <span class="pager-label">下一篇</span>
            <strong>{{ nextPost.frontmatter.title }}</strong>
          </a>
        </div>
      </nav>
    </main>
  </div>

  <article v-else class="page-layout vp-doc">
    <header v-if="showMeta" class="page-meta">
      <span v-if="frontmatter.date">发布日期：{{ frontmatter.date }}</span>
      <span v-if="frontmatter.author">作者：{{ frontmatter.author }}</span>
    </header>

    <Content />
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.ts'

const { page, frontmatter } = useData()

const normalizeUrl = (value = '') => {
  if (!value) return '/'
  const withSlash = value.startsWith('/') ? value : `/${value}`
  return withSlash === '/' ? withSlash : withSlash.replace(/\/+$/, '')
}

const pageUrl = computed(() => {
  const relativePath = page.value?.relativePath || ''
  if (!relativePath) return '/'

  if (relativePath.endsWith('/index.md')) {
    return `/${relativePath.replace(/index\.md$/, '')}`
  }

  return `/${relativePath.replace(/\.md$/, '')}`
})

const isPostDetail = computed(() => {
  const relativePath = page.value?.relativePath || ''
  return relativePath.startsWith('posts/') && relativePath !== 'posts/index.md'
})

const articlePosts = computed(() => {
  return posts.filter((post) => {
    const url = normalizeUrl(post.url)
    return Boolean(post.frontmatter?.date) && url !== '/posts'
  })
})

const currentPostIndex = computed(() => {
  const normalizedCurrent = normalizeUrl(pageUrl.value)
  return articlePosts.value.findIndex((post) => normalizeUrl(post.url) === normalizedCurrent)
})

const currentPost = computed(() => {
  if (currentPostIndex.value < 0) return null
  return articlePosts.value[currentPostIndex.value]
})

const prevPost = computed(() => {
  if (currentPostIndex.value <= 0) return null
  return articlePosts.value[currentPostIndex.value - 1]
})

const nextPost = computed(() => {
  if (currentPostIndex.value < 0 || currentPostIndex.value >= articlePosts.value.length - 1) return null
  return articlePosts.value[currentPostIndex.value + 1]
})

const formatDate = (rawDate) => {
  if (!rawDate) return ''
  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return String(rawDate)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isCurrentPost = (post) => {
  return normalizeUrl(post.url) === normalizeUrl(pageUrl.value)
}

const stripMarkdown = (value = '') => {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[>#*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const plainText = computed(() => stripMarkdown(currentPost.value?.src || ''))

const wordCount = computed(() => {
  if (!plainText.value) return 0

  const cjkCount = (plainText.value.match(/[一-鿿]/g) || []).length
  const latinWordCount = (
    plainText.value
      .replace(/[一-鿿]/g, ' ')
      .match(/[A-Za-z0-9_]+/g) || []
  ).length

  return cjkCount + latinWordCount
})

const readingMinutes = computed(() => {
  if (!wordCount.value) return 0
  return Math.max(1, Math.round(wordCount.value / 280))
})

const formattedDate = computed(() => {
  const sourceDate = frontmatter.value?.date || currentPost.value?.frontmatter?.date
  return formatDate(sourceDate)
})

const showMeta = computed(() => {
  return Boolean(frontmatter.value?.date || frontmatter.value?.author)
})
</script>

<style scoped>
.post-detail-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 28px 24px 72px;
}

.post-sidebar {
  position: fixed;
  top: 72px;
  left: max(16px, calc((100vw - 1280px) / 2 + 24px));
  width: 280px;
  height: calc(100vh - 88px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  padding: 20px;
  overflow: auto;
}

.sidebar-title {
  margin: 0;
  font-size: 24px;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.sidebar-item {
  padding: 10px 12px;
  border-radius: 10px;
  border-left: 2px solid transparent;
}

.sidebar-item + .sidebar-item {
  margin-top: 6px;
}

.sidebar-item a {
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.45;
  text-decoration: none;
}

.sidebar-item:hover {
  background: var(--vp-c-bg);
}

.sidebar-item.active {
  border-left-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.sidebar-item.active a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.sidebar-date {
  margin: 6px 0 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.post-main {
  min-width: 0;
  margin-left: 304px;
}

.post-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
  padding: 28px 32px;
}

.post-header h1 {
  margin: 0;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.12;
  color: var(--vp-c-brand-1);
}

.post-meta {
  margin-top: 14px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.post-content {
  margin-top: 22px;
}

.post-content :deep(h1:first-child) {
  display: none;
}

.post-content :deep(h2) {
  margin: 36px 0 12px;
  font-size: 26px;
  line-height: 1.3;
}

.post-content :deep(h3) {
  margin: 26px 0 10px;
  font-size: 20px;
}

.post-content :deep(p) {
  margin: 14px 0;
  font-size: 16px;
  line-height: 1.85;
}

.post-content :deep(li) {
  font-size: 16px;
  line-height: 1.8;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 10px;
}

.post-content :deep(img) {
  border-radius: 12px;
}

.post-pagination {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pager-slot {
  display: flex;
}

.pager-slot.align-right {
  justify-content: flex-end;
}

.pager-card {
  width: min(100%, 420px);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 14px 16px;
  text-decoration: none;
  min-height: 88px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pager-card:hover {
  border-color: var(--vp-c-brand-1);
}

.pager-label {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.pager-card strong {
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.page-layout {
  max-width: 860px;
  margin: 0 auto;
  padding: 52px 24px 84px;
}

.page-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

@media (max-width: 1180px) {
  .post-detail-page {
    grid-template-columns: 1fr;
  }

  .post-sidebar {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 18px 14px 56px;
    gap: 14px;
  }

  .post-card {
    padding: 20px 16px;
    border-radius: 14px;
  }

  .post-meta {
    font-size: 14px;
    gap: 10px;
  }

  .post-pagination {
    grid-template-columns: 1fr;
  }

  .pager-slot.align-right {
    justify-content: flex-start;
  }

  .page-layout {
    padding: 36px 16px 60px;
  }
}
</style>
