const cache = new Map()
const TTL_MS = 60_000

async function cachedFetch(url) {
  const now = Date.now()
  const hit = cache.get(url)
  if (hit && now - hit.t < TTL_MS) return hit.v
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) {
      cache.set(url, { t: now, v: null })
      return null
    }
    const v = await res.json()
    cache.set(url, { t: now, v })
    return v
  } catch {
    cache.set(url, { t: now, v: null })
    return null
  }
}

export async function fetchRepoStats(owner, repo) {
  if (!owner || !repo) return null
  const data = await cachedFetch(`https://api.github.com/repos/${owner}/${repo}`)
  if (!data || typeof data !== 'object') return null
  return {
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    pushedAt: data.pushed_at || null,
    htmlUrl: data.html_url || `https://github.com/${owner}/${repo}`,
  }
}

export async function fetchUserEvents(username) {
  if (!username) return null
  const data = await cachedFetch(`https://api.github.com/users/${username}/events/public`)
  if (!Array.isArray(data)) return null
  return data
}

export function relativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const diff = Math.floor((Date.now() - then) / 1000)
  if (diff < 30) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return `${m} minute${m === 1 ? '' : 's'} ago`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return `${h} hour${h === 1 ? '' : 's'} ago`
  }
  if (diff < 604800) {
    const d = Math.floor(diff / 86400)
    return `${d} day${d === 1 ? '' : 's'} ago`
  }
  if (diff < 2592000) {
    const w = Math.floor(diff / 604800)
    return `${w} week${w === 1 ? '' : 's'} ago`
  }
  if (diff < 31536000) {
    const mo = Math.floor(diff / 2592000)
    return `${mo} month${mo === 1 ? '' : 's'} ago`
  }
  const y = Math.floor(diff / 31536000)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

export function _resetCacheForTests() {
  cache.clear()
}
