import { useEffect, useState } from 'react'
import { fetchRepoStats, relativeTime } from '../lib/github.js'

export default function RepoStats({ repo }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!repo || typeof repo !== 'string' || !repo.includes('/')) return
    let cancelled = false
    const [owner, name] = repo.split('/')
    fetchRepoStats(owner, name).then(s => {
      if (!cancelled) setStats(s)
    })
    return () => {
      cancelled = true
    }
  }, [repo])

  if (!stats) return null

  return (
    <div className="repo-stats" aria-label={`GitHub stats for ${repo}`}>
      <span className="repo-stat">
        <span aria-hidden="true">★</span>
        <span>{stats.stars}</span>
      </span>
      <span className="repo-stat-sep" aria-hidden="true">·</span>
      <span className="repo-stat">
        <span>{stats.forks}</span>
        <span className="repo-stat-label">forks</span>
      </span>
      {stats.pushedAt && (
        <>
          <span className="repo-stat-sep" aria-hidden="true">·</span>
          <span className="repo-stat">
            <span className="repo-stat-label">pushed</span>
            <span>{relativeTime(stats.pushedAt)}</span>
          </span>
        </>
      )}
    </div>
  )
}
