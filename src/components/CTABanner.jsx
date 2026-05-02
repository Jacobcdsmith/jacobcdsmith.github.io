import Button from './Button.jsx'

export default function CTABanner({
  title = 'Have a problem worth solving?',
  body = 'Most engagements start with a free 30-minute discovery call.',
  primary = { label: 'Email Jacob', href: 'mailto:jacobcsmithd@gmail.com', track: 'cta_email' },
  secondary,
}) {
  return (
    <div className="cta-banner">
      <div className="cta-banner-text">
        <h3 className="cta-banner-title">{title}</h3>
        <p className="cta-banner-body">{body}</p>
      </div>
      <div className="cta-banner-actions">
        <Button
          href={primary.href}
          to={primary.to}
          variant="primary"
          size="lg"
          trackName={primary.track}
        >
          {primary.label}
        </Button>
        {secondary && (
          <Button
            href={secondary.href}
            to={secondary.to}
            variant="ghost"
            size="lg"
            trackName={secondary.track}
          >
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  )
}
