import { marked } from 'marked'
import postsManifest from '../../blog/posts.json'

marked.use({ renderer: { html() { return '' } } })

const rawPosts = import.meta.glob('../../blog/posts/*.md', { query: '?raw', import: 'default', eager: true })

function bySlug(slug) {
  const entry = Object.entries(rawPosts).find(([path]) => path.endsWith(`/${slug}.md`))
  return entry ? entry[1] : null
}

function readingTimeFromMarkdown(md) {
  if (!md) return 1
  const words = md.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export const posts = postsManifest
  .map(post => {
    const markdown = bySlug(post.slug) || ''
    return {
      ...post,
      markdown,
      html: markdown ? marked.parse(markdown) : '',
      readingTime: readingTimeFromMarkdown(markdown),
      tags: Array.isArray(post.tags) ? post.tags : [],
      category: post.category || 'Notes',
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug) {
  return posts.find(p => p.slug === slug) || null
}

export function getRelatedPosts(slug, limit = 2) {
  const current = getPost(slug)
  if (!current) return []
  const tags = new Set(current.tags)
  const scored = posts
    .filter(p => p.slug !== slug)
    .map(p => ({
      post: p,
      score: (p.category === current.category ? 2 : 0) + p.tags.filter(t => tags.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
  return scored.slice(0, limit).map(s => s.post)
}

export function allTags() {
  const set = new Set()
  for (const p of posts) for (const t of p.tags) set.add(t)
  return Array.from(set).sort()
}

export function allCategories() {
  const set = new Set()
  for (const p of posts) set.add(p.category)
  return Array.from(set).sort()
}

export default posts
