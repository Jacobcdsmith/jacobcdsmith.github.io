export default function Quote({ quote, name, role, company, placeholder }) {
  return (
    <figure className={`quote-card${placeholder ? ' quote-card-placeholder' : ''}`}>
      <blockquote className="quote-text">
        <span aria-hidden="true" className="quote-mark">“</span>
        {quote}
      </blockquote>
      <figcaption className="quote-attribution">
        <span className="quote-name">{name}</span>
        {(role || company) && (
          <span className="quote-role">
            {role}
            {role && company ? ', ' : ''}
            {company}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
