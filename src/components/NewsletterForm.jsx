import { useState } from 'react'
import { trackEvent } from '../lib/analytics.js'
import profile from '../data/profile.js'

export default function NewsletterForm({ variant = 'inline', heading, sub }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }
    trackEvent('newsletter_signup', { email_domain: email.split('@')[1] })
    setStatus('success')
    setMessage('Thanks — opening your email client to confirm subscription.')
    const subject = encodeURIComponent('Subscribe me to the newsletter')
    const body = encodeURIComponent(
      `Please subscribe ${email} to the newsletter.\n\n— Sent from jacobcdsmith.github.io`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <form className={`newsletter newsletter-${variant}`} onSubmit={onSubmit}>
      {heading && <h3 className="newsletter-heading">{heading}</h3>}
      {sub && <p className="newsletter-sub">{sub}</p>}
      <div className="newsletter-row">
        <label htmlFor={`nl-email-${variant}`} className="visually-hidden">
          Email address
        </label>
        <input
          id={`nl-email-${variant}`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="newsletter-input"
        />
        <button type="submit" className="btn btn-primary btn-md newsletter-submit">
          Subscribe
        </button>
      </div>
      {status !== 'idle' && (
        <p className={`newsletter-message newsletter-message-${status}`}>{message}</p>
      )}
      <p className="newsletter-fineprint">
        No spam. Occasional notes on analytics, AI, and consciousness research.
      </p>
    </form>
  )
}
