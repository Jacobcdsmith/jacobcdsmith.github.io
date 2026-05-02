import Button from './Button.jsx'
import profile from '../data/profile.js'

export default function CVDownload({ variant = 'secondary', size = 'md', label = 'Download CV' }) {
  return (
    <Button
      href={profile.resumePath}
      external={false}
      download="jacob-c-smith-resume.pdf"
      variant={variant}
      size={size}
      trackName="cv_download"
      ariaLabel="Download Jacob C. Smith resume PDF"
    >
      <span aria-hidden="true">↓</span> {label}
    </Button>
  )
}
