import { useState } from 'react'

export default function FAQ({ items, defaultOpen = -1 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <ul className="faq-list" role="list">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li key={i} className={`faq-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span aria-hidden="true" className="faq-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="faq-answer" hidden={!isOpen}>
              <p>{item.a}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
