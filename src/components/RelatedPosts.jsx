import { Link } from 'react-router-dom'

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) return null
  return (
    <aside className="related-posts" aria-label="Related posts">
      <h3 className="related-heading">Related writing</h3>
      <ul className="related-list" role="list">
        {posts.map(p => (
          <li key={p.slug} className="related-item">
            <Link to={`/blog/${p.slug}`} className="related-link">
              <span className="related-title">{p.title}</span>
              <span className="related-meta">{p.readingTime} min read</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
