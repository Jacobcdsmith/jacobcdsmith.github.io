import profile from '../data/profile.js'

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: profile.siteUrl,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buckhannon',
      addressRegion: 'WV',
      addressCountry: 'US',
    },
    sameAs: [profile.github, profile.linkedin],
    description: profile.authorBio,
  }
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${profile.name} — ${profile.role}`,
    url: profile.siteUrl,
    image: `${profile.siteUrl}/og-default.svg`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Buckhannon',
      addressRegion: 'WV',
      addressCountry: 'US',
    },
    areaServed: 'Worldwide (remote)',
    description: profile.subtagline,
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: profile.name,
    url: profile.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${profile.siteUrl}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    provider: { '@type': 'Person', name: profile.name, url: profile.siteUrl },
    areaServed: 'Worldwide (remote)',
    serviceType: service.title,
  }
}

export function blogPostingSchema(post) {
  const url = `${profile.siteUrl}/blog/${post.slug}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: profile.name, url: profile.siteUrl },
    publisher: { '@type': 'Person', name: profile.name },
    url,
    mainEntityOfPage: url,
    image: `${profile.siteUrl}/og-default.svg`,
    keywords: (post.tags || []).join(', '),
    wordCount: post.markdown ? post.markdown.split(/\s+/).filter(Boolean).length : undefined,
  }
}
