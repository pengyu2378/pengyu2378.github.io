<template>
  <div class="site-shell">
    <header class="site-nav">
      <div class="site-nav-inner">
        <a class="site-brand" href="/">{{ site.title || 'Pengyu\'s Blog' }}</a>
        <nav class="site-nav-links">
          <a
            v-for="item in navItems"
            :key="item.link"
            :href="item.link"
            class="site-nav-link"
            :class="{ active: isActive(item.link) }"
          >
            {{ item.text }}
          </a>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <NotFound v-if="page.isNotFound" />
      <Home v-else-if="frontmatter.layout === 'home'" />
      <Page v-else />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import NotFound from './NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, frontmatter, theme, site } = useData()

const navItems = computed(() => theme.value?.nav || [])

const normalizePath = (value = '') => {
  if (!value) return '/'
  const withSlash = value.startsWith('/') ? value : `/${value}`
  const clean = withSlash.replace(/\.md$/, '')
  return clean === '/' ? clean : clean.replace(/\/+$/, '')
}

const currentPath = computed(() => {
  const relativePath = page.value?.relativePath || ''
  if (!relativePath) return '/'

  if (relativePath.endsWith('/index.md')) {
    return normalizePath(relativePath.replace(/index\.md$/, ''))
  }

  return normalizePath(relativePath)
})

const isActive = (link) => {
  const target = normalizePath(link)
  const current = currentPath.value

  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}
</script>

<style scoped>
.site-shell {
  min-height: 100vh;
  background: var(--vp-c-bg);
}

.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  border-bottom: 1px solid var(--vp-c-divider);
}

.site-nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  min-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.site-brand {
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.site-nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.site-nav-link {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.site-nav-link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.site-nav-link.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.site-main {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
}

@media (max-width: 900px) {
  .site-nav-inner {
    min-height: 56px;
    padding: 8px 14px;
    flex-direction: column;
    align-items: flex-start;
  }

  .site-nav-links {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
