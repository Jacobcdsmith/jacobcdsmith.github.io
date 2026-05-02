import { useEffect, useState } from 'react'
import { fetchUserEvents, relativeTime } from '../lib/github.js'

function describeEvent(ev) {
  const repo = ev?.repo?.name || ''
  if (!repo) return null
  switch (ev.type) {
    case 'PushEvent': {
      const count = ev.payload?.commits?.length || ev.payload?.size || 0
      const branch = (ev.payload?.ref || '').replace('refs/heads/', '')
      const verb = count === 1 ? 'Pushed 1 commit' : `Pushed ${count} commits`
      return {
        kind: 'push',
        label: `${verb} to ${repo}${branch ? ` (${branch})` : ''}`,
      }
    }
    case 'ReleaseEvent': {
      const tag = ev.payload?.release?.tag_name || ev.payload?.release?.name || ''
      return {
        kind: 'release',
        label: `Released ${tag ? `${tag} ` : ''}on ${repo}`,
      }
    }
    case 'PullRequestEvent': {
      const action = ev.payload?.action || 'opened'
      return {
        kind: 'pr',
        label: `${cap(action)} PR in ${repo}`,
      }
    }
    case 'CreateEvent': {
      const refType = ev.payload?.ref_type || 'item'
      const ref = ev.payload?.ref ? ` "${ev.payload.ref}"` : ''
      return {
        kind: 'create',
        label: `Created ${refType}${ref} in ${repo}`,
      }
    }
    case 'IssuesEvent': {
      const action = ev.payload?.action || 'opened'
      return {
        kind: 'issue',
        label: `${cap(action)} issue in ${repo}`,
      }
    }
    case 'IssueCommentEvent':
      return { kind: 'comment', label: `Commented on issue in ${repo}` }
    case 'WatchEvent':
      return { kind: 'star', label: `Starred ${repo}` }
    case 'ForkEvent':
      return { kind: 'fork', label: `Forked ${repo}` }
    case 'PullRequestReviewEvent':
      return { kind: 'review', label: `Reviewed PR in ${repo}` }
    default:
      return null
  }
}

function cap(s) {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1)
}

export default function GitHubActivity({ username = 'Jacobcdsmith', limit = 10 }) {
  const [events, setEvents] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchUserEvents(username).then(data => {
      if (cancelled) return
      if (!data) {
        setError(true)
        return
      }
      setEvents(data)
    })
    return () => {
      cancelled = true
    }
  }, [username])

  if (error) {
    return (
      <p className="github-activity-status">
        GitHub activity is currently unavailable.
      </p>
    )
  }

  if (!events) {
    return <p className="github-activity-status">Loading recent activity…</p>
  }

  const items = events
    .map(ev => ({ ev, desc: describeEvent(ev) }))
    .filter(x => x.desc)
    .slice(0, limit)

  if (items.length === 0) {
    return (
      <p className="github-activity-status">No recent public activity.</p>
    )
  }

  return (
    <ul className="github-activity">
      {items.map(({ ev, desc }) => {
        const repo = ev?.repo?.name || ''
        const href = repo ? `https://github.com/${repo}` : null
        return (
          <li key={ev.id} className="github-activity-item">
            <span className={`github-activity-kind kind-${desc.kind}`}>
              [{desc.kind.toUpperCase()}]
            </span>
            <span className="github-activity-label">
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {desc.label}
                </a>
              ) : (
                desc.label
              )}
            </span>
            <span className="github-activity-time">
              {relativeTime(ev.created_at)}
            </span>
          </li>
        )
      })}
      <li className="github-activity-footer">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See full activity on GitHub →
        </a>
      </li>
    </ul>
  )
}
