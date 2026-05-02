import { useState } from 'react'
import { trackEvent } from '../lib/analytics.js'

export default function SocialShare({ url, title }) {
  const [copied, setCopied] = useState(false)
  const fullUrl = url.startsWith('http') ? url : `https://jacobcdsmith.github.io${url}`
  const text = encodeURIComponent(title)
  const u = encodeURIComponent(fullUrl)
  const twitter = `https://twitter.com/intent/tweet?text=${text}&url=${u}`
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      trackEvent('share_copy', { url: fullUrl })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-bar" aria-label="Share this post">
      <span className="share-label">Share</span>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        onClick={() => trackEvent('share_twitter', { url: fullUrl })}
        aria-label="Share on X / Twitter"
      >
        X
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="share-btn"
        onClick={() => trackEvent('share_linkedin', { url: fullUrl })}
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <button type="button" className="share-btn" onClick={copy} aria-label="Copy link">
        {copied ? '✓ copied' : 'Copy link'}
      </button>
    </div>
  )
}
