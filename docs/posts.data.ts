import { createContentLoader } from "vitepress";

export default createContentLoader('posts/*.md', {
    includeSrc: true,
    render: true,
    excerpt: true,
    transform(raw): any[] {
        return raw
        .filter(({ frontmatter, url }) => {
            if (frontmatter?.draft) return false
            if (!frontmatter?.date) return false
            if (url === '/posts/' || url === '/posts') return false
            return true
        })
        .sort((a, b) => {
            const timeA = +new Date(a.frontmatter.date)
            const timeB = +new Date(b.frontmatter.date)
            return timeB - timeA
        })
    }
})