import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import techGraph from '../lib/tech-graph.js'

const TYPE_LABEL = { project: 'Project', post: 'Writing', tag: 'Technology' }

export default function TechGraph({ id = 'tech-graph' }) {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const active = hovered ?? selected

  const { nodes, edges, neighbors, width, height } = techGraph
  const nodeById = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])
  const activeNeighbors = active ? neighbors.get(active) : null

  const isDimmed = n => active !== null && n.id !== active && !activeNeighbors?.has(n.id)
  const isEdgeActive = e => active !== null && (e.source === active || e.target === active)

  const selectedNode = selected ? nodeById.get(selected) : null
  const selectedNeighbors = selected
    ? [...(neighbors.get(selected) || [])].map(nid => nodeById.get(nid)).filter(Boolean)
    : []

  const select = nid => setSelected(prev => (prev === nid ? null : nid))

  return (
    <figure className="tech-graph" data-active={active ? 'true' : 'false'}>
      <svg
        className="tech-graph-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${id}-title`}>Skills, projects, and writing — connected</title>
        <desc id={`${id}-desc`}>
          A force-directed graph connecting {nodes.filter(n => n.type === 'project').length} projects
          and {nodes.filter(n => n.type === 'post').length} blog posts through{' '}
          {nodes.filter(n => n.type === 'tag').length} shared technologies. Click any node to see
          what it connects to.
        </desc>

        <g className="tech-graph-edges" aria-hidden="true">
          {edges.map((e, i) => {
            const a = nodeById.get(e.source)
            const b = nodeById.get(e.target)
            if (!a || !b) return null
            return (
              <line
                key={i}
                className={'tech-graph-edge' + (isEdgeActive(e) ? ' is-active' : '')}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              />
            )
          })}
        </g>

        <g className="tech-graph-nodes">
          {nodes.map(n => {
            const dimmed = isDimmed(n)
            const isActive = active === n.id
            const isSelected = selected === n.id
            const cls =
              `tech-node tech-node-${n.type}` +
              (isActive ? ' is-active' : '') +
              (isSelected ? ' is-selected' : '') +
              (dimmed ? ' is-dimmed' : '')
            const handlers = {
              role: 'button',
              tabIndex: 0,
              'aria-label': `${TYPE_LABEL[n.type]}: ${n.label}`,
              'aria-pressed': isSelected,
              onMouseEnter: () => setHovered(n.id),
              onMouseLeave: () => setHovered(null),
              onFocus: () => setHovered(n.id),
              onBlur: () => setHovered(null),
              onClick: () => select(n.id),
              onKeyDown: e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  select(n.id)
                } else if (e.key === 'Escape') {
                  setSelected(null)
                }
              },
            }
            return (
              <g key={n.id} className={cls} {...handlers}>
                {n.type === 'project' ? (
                  <rect
                    className="tech-node-shape"
                    x={n.x - n.r} y={n.y - n.r} width={n.r * 2} height={n.r * 2}
                  />
                ) : (
                  <circle className="tech-node-shape" cx={n.x} cy={n.y} r={n.r} />
                )}
                {n.type !== 'tag' && (
                  <text className="tech-node-label" x={n.x} y={n.y + n.r + 13} textAnchor="middle">
                    {n.label.length > 20 ? n.label.slice(0, 19) + '…' : n.label}
                  </text>
                )}
                {n.type === 'tag' && (
                  <text className="tech-node-tag-label" x={n.x} y={n.y + n.r + 10} textAnchor="middle">
                    {n.label.length > 14 ? n.label.slice(0, 13) + '…' : n.label}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      <div className="tech-graph-legend" aria-hidden="true">
        <span className="tech-graph-legend-item"><span className="tech-legend-swatch tech-legend-project" /> Project</span>
        <span className="tech-graph-legend-item"><span className="tech-legend-swatch tech-legend-post" /> Writing</span>
        <span className="tech-graph-legend-item"><span className="tech-legend-swatch tech-legend-tag" /> Technology</span>
      </div>

      <figcaption className="tech-graph-caption" aria-live="polite">
        {selectedNode ? (
          <>
            <p className="tech-graph-caption-eyebrow">{TYPE_LABEL[selectedNode.type]}</p>
            <p className="tech-graph-caption-lead">{selectedNode.label}</p>
            <p className="tech-graph-caption-body">
              Connects to: {selectedNeighbors.map(n => n.label).join(', ')}
            </p>
            {selectedNode.type === 'post' && (
              <p className="tech-graph-caption-body">
                <Link to={`/blog/${selectedNode.meta.slug}`}>Read the post →</Link>
              </p>
            )}
            <button
              type="button"
              className="tech-graph-caption-close"
              onClick={() => setSelected(null)}
              aria-label="Close detail panel"
            >
              Close ×
            </button>
          </>
        ) : (
          <p className="tech-graph-hint">
            <span className="tech-graph-hint-key">Click</span>any node to see what it connects to.{' '}
            <span className="tech-graph-hint-key">Hover</span>highlights connections. Keyboard:{' '}
            <kbd>Tab</kbd> to focus, <kbd>Enter</kbd> to open.
          </p>
        )}
      </figcaption>

      <div className="visually-hidden">
        <p>Graph, in text — what each project and post connects to:</p>
        <ul>
          {nodes.filter(n => n.type !== 'tag').map(n => (
            <li key={n.id}>
              <strong>{n.label}</strong> ({TYPE_LABEL[n.type]}): {
                [...(neighbors.get(n.id) || [])].map(nid => nodeById.get(nid)?.label).filter(Boolean).join(', ')
              }
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
