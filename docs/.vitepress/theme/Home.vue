<template>
  <div class="home-layout">
    <section class="hero">
      <p class="hero-kicker">Personal Blog</p>
      <h1 class="hero-title">{{ frontmatter.hero?.name || "Pengyu Jiang's Blog" }}</h1>
      <p class="tagline">{{ frontmatter.hero?.tagline || '记录技术成长与项目实践' }}</p>

      <div v-if="frontmatter.hero?.actions?.length" class="actions">
        <a
          v-for="action in frontmatter.hero.actions"
          :key="action.link"
          :href="action.link"
          class="action-btn"
          :class="`is-${action.theme || 'default'}`"
        >
          {{ action.text }}
        </a>
      </div>
    </section>

    <section v-if="latestPosts.length" class="post-list-section">
      <div class="section-header">
        <h2 class="section-title">最新日志</h2>
        <a class="all-posts-link" href="/posts/">查看全部</a>
      </div>

      <div class="posts-grid">
        <a
          v-for="post in latestPosts"
          :key="post.url"
          :href="post.url"
          class="post-card"
        >
          <p class="post-date">{{ formatDate(post.frontmatter.date) }}</p>
          <h3 class="post-title">{{ post.frontmatter.title }}</h3>
          <p class="post-excerpt">{{ getSummary(post) }}</p>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.ts'

const { frontmatter } = useData()

const latestPosts = computed(() => posts.slice(0, 6))

const formatDate = (rawDate) => {
  if (!rawDate) return '未知日期'

  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return String(rawDate)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
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

const getSummary = (post) => {
  const description = post.frontmatter?.description
  if (description) return description

  const text = stripMarkdown(post.src || '')
  if (!text) return '点击查看全文'

  return text.length > 90 ? `${text.slice(0, 90)}...` : text
}
</script>

<style scoped>
.home-layout {
  max-width: 980px;
  margin: 0 auto;
  padding: 48px 24px 84px;
}

.hero {
  padding: 42px 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.hero-kicker {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.hero-title {
  margin: 12px 0 14px;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 1.1;
  background: linear-gradient(120deg, #b45309 20%, #16a34a 85%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tagline {
  margin: 0 auto;
  max-width: 680px;
  font-size: 18px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 10px 20px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn.is-brand {
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--vp-c-brand-1) 28%, transparent);
}

.action-btn.is-alt,
.action-btn.is-default {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.post-list-section {
  margin-top: 42px;
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
}

.section-title {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
}

.all-posts-link {
  font-size: 15px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.all-posts-link:hover {
  text-decoration: underline;
}

.posts-grid {
  margin-top: 20px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.post-card {
  display: block;
  padding: 18px 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.post-date {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.post-title {
  margin: 10px 0 8px;
  color: var(--vp-c-text-1);
  font-size: 23px;
  line-height: 1.4;
}

.post-excerpt {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

@media (max-width: 900px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-layout {
    padding: 32px 16px 56px;
  }

  .hero {
    padding: 32px 20px;
    border-radius: 16px;
  }

  .tagline {
    font-size: 16px;
  }

  .section-title {
    font-size: 30px;
  }
}
</style>
