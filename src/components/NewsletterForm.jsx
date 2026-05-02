import { useState } from 'react'
import { trackEvent } from '../lib/analytics.js'
import profile from '../data/profile.js'

const BUTTONDOWN_USERNAME = import.meta.env.VITE_BUTTONDOWN_USERNAME || ''
const BUTTONDOWN_ENDPOINT = BUTTONDOWN_USERNAME
  ? `https://buttondown.com/api/emails/embed-subscribe/${encodeURIComponent(BUTTONDOWN_USERNAME)}`
  : ''

export default function NewsletterForm({ variant = 'inline', heading, sub }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submitToButtondown = async value => {
    const body = new URLSearchParams({ email: value, embed: '1' })
    await fetch(BUTTONDOWN_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  }

  const fallbackMailto = value => {
    const subject = encodeURIComponent('Subscribe me to the newsletter')
    const body = encodeURIComponent(
      `Please subscribe ${value} to the newsletter.\n\n— Sent from jacobcdsmith.github.io`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const onSubmit = async e => {
    e.preventDefault()
    const trimmed = email.trim()
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!looksLikeEmail) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }

    trackEvent('newsletter_signup')

    if (!BUTTONDOWN_ENDPOINT) {
      if (import.meta.env.DEV) {
        console.warn(
          '[NewsletterForm] VITE_BUTTONDOWN_USERNAME is not set; falling back to mailto.',
        )
      }
      setStatus('success')
      setMessage('Thanks — opening your email client to confirm subscription.')
      fallbackMailto(trimmed)
      return
    }

    setStatus('loading')
    setMessage('Subscribing…')
    try {
      await submitToButtondown(trimmed)
      setStatus('success')
      setMessage(
        'Thanks — check your inbox for a confirmation email from Buttondown to finish subscribing.',
      )
      setEmail('')
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[NewsletterForm] Buttondown subscribe failed:', err)
      }
      setStatus('error')
      setMessage(
        'Something went wrong subscribing. Please try again, or email me directly.',
      )
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className={`newsletter newsletter-${variant}`} onSubmit={onSubmit} noValidate>
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
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn btn-primary btn-md newsletter-submit"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {status !== 'idle' && (
        <p
          className={`newsletter-message newsletter-message-${status}`}
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {message}
        </p>
      )}
      <p className="newsletter-fineprint">
        By subscribing you agree to receive occasional emails from Jacob C. Smith. No spam, no
        third-party sharing — your address is stored by{' '}
        <a
          href="https://buttondown.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buttondown
        </a>
        . Unsubscribe anytime via the link in any email.
      </p>
    </form>
  )
}
