import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide, forceX, forceY } from 'd3-force'
import { projects } from '../data/projects.js'
import { posts } from '../data/posts.js'

const WIDTH = 1040
const HEIGHT = 860
const PAD = 30
const MIN_TAG_DEGREE = 2
const LABEL_MAX_CHARS = 20

function truncate(label, max = LABEL_MAX_CHARS) {
  return label.length > max ? label.slice(0, max - 1) + '…' : label
}

// Collision radius needs to account for the label rendered below each node —
// plain shape-radius collision leaves adjacent labels overlapping.
function collideRadius(n) {
  const labelLen = truncate(n.label, n.type === 'tag' ? 14 : LABEL_MAX_CHARS).length
  const charWidth = n.type === 'tag' ? 4.4 : 5.2
  return Math.max(n.r + 6, (labelLen * charWidth) / 2 + 4)
}

function projectId(p) {
  return `project:${p.name}`
}
function postId(p) {
  return `post:${p.slug}`
}
function tagId(t) {
  return `tag:${t}`
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function buildGraph() {
  const tagCounts = new Map()
  const rawLinks = []

  for (const p of projects) {
    for (const t of p.tags) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
      rawLinks.push({ source: projectId(p), target: tagId(t), tag: t })
    }
  }
  for (const p of posts) {
    for (const t of p.tags) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
      rawLinks.push({ source: postId(p), target: tagId(t), tag: t })
    }
  }

  const validTags = new Set(
    [...tagCounts.entries()].filter(([, count]) => count >= MIN_TAG_DEGREE).map(([t]) => t)
  )
  const links = rawLinks.filter(l => validTags.has(l.tag))

  const usedItemIds = new Set()
  for (const l of links) usedItemIds.add(l.source)

  const projectNodes = projects
    .filter(p => usedItemIds.has(projectId(p)))
    .map(p => ({ id: projectId(p), type: 'project', label: p.name, r: 20, meta: p }))

  const postNodes = posts
    .filter(p => usedItemIds.has(postId(p)))
    .map(p => ({ id: postId(p), type: 'post', label: p.title, r: 15, meta: p }))

  const tagNodes = [...validTags].map(t => {
    const degree = tagCounts.get(t)
    return { id: tagId(t), type: 'tag', label: t, r: clamp(6 + degree * 1.4, 7, 16), meta: { degree } }
  })

  const nodes = [...projectNodes, ...postNodes, ...tagNodes]
  const nodeIndex = new Map(nodes.map(n => [n.id, n]))
  const edges = links
    .filter(l => nodeIndex.has(l.source) && nodeIndex.has(l.target))
    .map(l => ({ ...l }))

  const sim = forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-480).distanceMax(420))
    .force('link', forceLink(edges).id(d => d.id).distance(110).strength(0.3))
    .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
    .force('collide', forceCollide().radius(n => collideRadius(n) * 1.2).iterations(5))
    .force('x', forceX(WIDTH / 2).strength(0.01))
    .force('y', forceY(HEIGHT / 2).strength(0.01))
    .stop()

  for (let i = 0; i < 700; i++) sim.tick()

  for (const n of nodes) {
    n.x = clamp(n.x, PAD + n.r, WIDTH - PAD - n.r)
    n.y = clamp(n.y, PAD + n.r, HEIGHT - PAD - n.r)
  }

  const neighbors = new Map(nodes.map(n => [n.id, new Set()]))
  for (const e of edges) {
    neighbors.get(e.source.id ?? e.source)?.add(e.target.id ?? e.target)
    neighbors.get(e.target.id ?? e.target)?.add(e.source.id ?? e.source)
  }

  return {
    width: WIDTH,
    height: HEIGHT,
    nodes,
    edges: edges.map(e => ({
      source: e.source.id ?? e.source,
      target: e.target.id ?? e.target,
    })),
    neighbors,
  }
}

export const techGraph = buildGraph()
export default techGraph
