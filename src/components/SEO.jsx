import { Helmet } from 'react-helmet-async'
import profile from '../data/profile.js'

export default function SEO({
  title,
  description,
  path = '/',
  type = 'website',
  image,
  noindex = false,
  jsonLd,
  publishedTime,
  modifiedTime,
  tags = [],
}) {
  const fullTitle = title
    ? `${title} | ${profile.name}`
    : `${profile.name} — ${profile.role}`
  const desc = description || profile.subtagline
  const url = `${profile.siteUrl}${path}`
  const ogImage = image || `${profile.siteUrl}/og-default.svg`

  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={profile.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && <meta property="article:author" content={profile.name} />}
      {tags.map(t => (
        <meta key={t} property="article:tag" content={t} />
      ))}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
