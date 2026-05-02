import { useState } from 'react'
import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Button from '../components/Button.jsx'
import profile from '../data/profile.js'
import { trackEvent } from '../lib/analytics.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = e => {
    e.preventDefault()
    trackEvent('contact_form_submit', {})
    const subject = encodeURIComponent(`Inquiry from ${name || 'website visitor'}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` <${email}>` : ''}\nSent from jacobcdsmith.github.io`,
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  return (
    <>
      <SEO
        title="Contact"
        description={`Get in touch with ${profile.name}. Email is the fastest way; phone for urgent matters.`}
        path="/contact"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Contact', url: `${profile.siteUrl}/contact` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Contact</p>
          <h1 className="page-title">Let’s talk.</h1>
          <p className="page-lead">
            One paragraph about the problem you’re trying to solve is enough to start. Discovery
            calls are free; NDAs welcome.
          </p>
        </div>
      </header>

      <Section>
        <div className="contact-grid">
          <ul className="contact-list">
            <li>
              <span className="contact-label">Email</span>
              <a className="contact-value" href={`mailto:${profile.email}`} onClick={() => trackEvent('contact_email_click')}>
                {profile.email}
              </a>
            </li>
            <li>
              <span className="contact-label">Phone</span>
              <a className="contact-value" href={`tel:${profile.phone}`} onClick={() => trackEvent('contact_phone_click')}>
                {profile.phoneDisplay}
              </a>
            </li>
            <li>
              <span className="contact-label">GitHub</span>
              <a className="contact-value" href={profile.github} target="_blank" rel="noopener noreferrer">
                Jacobcdsmith
              </a>
            </li>
            <li>
              <span className="contact-label">LinkedIn</span>
              <a className="contact-value" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                jacobcsmith
              </a>
            </li>
            <li>
              <span className="contact-label">Location</span>
              <span className="contact-value">{profile.location}</span>
            </li>
          </ul>

          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Your name
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              What are you trying to solve?
              <textarea
                name="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </label>
            <Button type="submit" variant="primary" size="md" trackName="contact_form_submit_button">
              Send via email
            </Button>
            <p className="newsletter-fineprint">
              The form opens your email client with the message pre-filled. No data is stored on this
              site.
            </p>
          </form>
        </div>
      </Section>
    </>
  )
}
