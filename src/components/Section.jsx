export function Section({ id, eyebrow, title, lead, children, align = 'left', tone = 'default', as: Tag = 'section' }) {
  return (
    <Tag id={id} className={`section section-tone-${tone} section-align-${align}`}>
      <div className="section-inner">
        {(eyebrow || title || lead) && (
          <header className="section-header">
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {lead && <p className="section-lead">{lead}</p>}
          </header>
        )}
        <div className="section-body">{children}</div>
      </div>
    </Tag>
  )
}

export default Section
