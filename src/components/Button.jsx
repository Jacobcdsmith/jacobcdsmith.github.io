import { Link } from 'react-router-dom'
import { trackEvent } from '../lib/analytics.js'

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  trackName,
  trackProps,
  className = '',
  external = false,
  download,
  ariaLabel,
  type = 'button',
  ...rest
}) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim()

  const handle = e => {
    if (trackName) trackEvent(trackName, trackProps)
    if (onClick) onClick(e)
  }

  if (to) {
    return (
      <Link to={to} className={cls} onClick={handle} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    const linkProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {}
    return (
      <a
        href={href}
        className={cls}
        onClick={handle}
        download={download}
        aria-label={ariaLabel}
        {...linkProps}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button type={type} className={cls} onClick={handle} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  )
}
