import { useState } from 'react'

const NODES = [
  {
    id: 'client',
    label: 'CLIENT',
    x: 60, y: 160, w: 100, h: 56,
    short: 'Editor / shell / app',
    desc:
      'Whatever surface initiates the request — an IDE plugin, a chat client, a CLI, or a custom tool calling into your local agent stack. Speaks MCP over the local WebSocket.',
    tools: 'No tools of its own. Only opens an MCP-shaped WebSocket connection.',
  },
  {
    id: 'gateway',
    label: 'WS GATEWAY',
    x: 180, y: 160, w: 100, h: 56,
    short: 'Local WebSocket MCP gateway',
    desc:
      'Sovereignty-first gateway that terminates the WebSocket on your network. Brokers MCP traffic between clients and the agent runtime — no cloud hop required, agents and tools stay local by design.',
    tools: 'Routes MCP frames; can speak stdio, SSE, or WebSocket to downstream tool servers.',
  },
  {
    id: 'soul',
    label: 'SOUL.md',
    x: 320, y: 160, w: 100, h: 56,
    short: 'Identity layer',
    desc:
      'A persistent SOUL.md identity layer. Stamps every routed call with stable values, voice, and operating constraints so subagents inherit a coherent self instead of improvising one each turn.',
    tools: 'Reads SOUL.md from disk; injects identity context into every subagent prompt.',
  },
  {
    id: 'router',
    label: 'ROUTER',
    x: 450, y: 160, w: 100, h: 56,
    short: 'Subagent dispatcher',
    desc:
      'Inspects the request and dispatches to one of three deterministic subagents. Each subagent contract is explicit, so the router never improvises behavior — it just selects the contract that fits.',
    tools: 'Multi-provider routing across OpenRouter, Anthropic, OpenAI, Groq, Gemini, Ollama, and LM Studio.',
  },
  {
    id: 'codegen',
    label: 'CODEGEN',
    x: 610, y: 60, w: 100, h: 56,
    short: 'Code generation subagent',
    desc:
      'Writes, edits, and reasons over code. Returns deterministic patches the router can apply or surface back to the client. No silent fallbacks — failures are explicit.',
    tools: 'Filesystem read/write, code search, language tools via MCP.',
  },
  {
    id: 'redteam',
    label: 'RED-TEAM',
    x: 610, y: 160, w: 100, h: 56,
    short: 'Red-team subagent',
    desc:
      'Adversarial review baked in as a first-class subagent — the system tests itself before shipping a response. Surfaces prompt-injection, jailbreak, and policy edge cases on every turn.',
    tools: 'Eval harnesses, attack-surface probes, policy checks.',
  },
  {
    id: 'resource',
    label: 'RESOURCE',
    x: 610, y: 260, w: 100, h: 56,
    short: 'Resource-gathering subagent',
    desc:
      'Pulls in external context — docs, API schemas, web fetches, MCP resources — so the codegen and red-team subagents reason against fresh material instead of stale weights.',
    tools: 'Web fetch, MCP resource reads, doc search.',
  },
  {
    id: 'tools',
    label: 'TOOL CALLS',
    x: 770, y: 160, w: 100, h: 56,
    short: 'MCP tool surface',
    desc:
      'Whichever tool surface the active subagent needs — local FS, shell, web, embedded device APIs — invoked through MCP so swap-in / swap-out is one config change, not a refactor.',
    tools: 'Anything MCP-shaped: stdio servers, SSE servers, custom WebSocket tools.',
  },
  {
    id: 'response',
    label: 'RESPONSE',
    x: 900, y: 160, w: 100, h: 56,
    short: 'Reply to client',
    desc:
      'Final composed response — identity-stamped, red-team reviewed — returned to the originating client over the same WebSocket the request arrived on.',
    tools: 'No tools. Emits MCP frames back through the gateway.',
  },
]

const EDGES = [
  { d: 'M 110 160 H 130' },
  { d: 'M 230 160 H 270' },
  { d: 'M 370 160 H 400' },
  { d: 'M 500 160 H 530 V 60 H 560' },
  { d: 'M 500 160 H 560' },
  { d: 'M 500 160 H 530 V 260 H 560' },
  { d: 'M 660 60 H 690 V 160 H 720' },
  { d: 'M 660 160 H 720' },
  { d: 'M 660 260 H 690 V 160 H 720' },
  { d: 'M 820 160 H 850' },
]

export default function AgentGatewaySchematic({ id = 'agent-gateway-schematic' }) {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const active = hovered ?? selected
  const paused = active !== null

  const selectedNode = NODES.find(n => n.id === selected) || null

  return (
    <figure className="schematic" data-paused={paused ? 'true' : 'false'}>
      <svg
        className="schematic-svg"
        viewBox="0 0 960 320"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={`${id}-title`}>Agent gateway request flow</title>
        <desc id={`${id}-desc`}>
          Schematic of a request flowing from a client, through a local WebSocket MCP gateway,
          a SOUL.md identity layer, and a router that dispatches to one of three subagents
          (codegen, red-team, resource), then through tool calls before returning a response.
        </desc>

        <g className="schematic-wires" aria-hidden="true">
          {EDGES.map((e, i) => (
            <path key={i} d={e.d} className="schematic-wire" />
          ))}
        </g>

        <g className="schematic-packets" aria-hidden="true">
          <circle className="schematic-packet schematic-packet-codegen" r="6" />
          <circle className="schematic-packet schematic-packet-redteam" r="6" />
          <circle className="schematic-packet schematic-packet-resource" r="6" />
        </g>

        <g className="schematic-nodes">
          {NODES.map(n => {
            const isActive = active === n.id
            const isSelected = selected === n.id
            return (
              <g
                key={n.id}
                className={
                  'schematic-node' +
                  (isActive ? ' is-active' : '') +
                  (isSelected ? ' is-selected' : '')
                }
                role="button"
                tabIndex={0}
                aria-label={`${n.label}. ${n.short}.`}
                aria-pressed={isSelected}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected(prev => (prev === n.id ? null : n.id))}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(prev => (prev === n.id ? null : n.id))
                  } else if (e.key === 'Escape') {
                    setSelected(null)
                  }
                }}
              >
                <rect
                  className="schematic-node-rect"
                  x={n.x - n.w / 2}
                  y={n.y - n.h / 2}
                  width={n.w}
                  height={n.h}
                />
                <text
                  className="schematic-node-label"
                  x={n.x}
                  y={n.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <figcaption className="schematic-caption" aria-live="polite">
        {selectedNode ? (
          <>
            <p className="schematic-caption-eyebrow">{selectedNode.label}</p>
            <p className="schematic-caption-lead">{selectedNode.short}</p>
            <p className="schematic-caption-body">{selectedNode.desc}</p>
            <p className="schematic-caption-tools">
              <span className="schematic-caption-tools-label">Tool surface</span>
              {selectedNode.tools}
            </p>
            <button
              type="button"
              className="schematic-caption-close"
              onClick={() => setSelected(null)}
              aria-label="Close detail panel"
            >
              Close ×
            </button>
          </>
        ) : (
          <p className="schematic-hint">
            <span className="schematic-hint-key">Click</span>any node to see what it does.{' '}
            <span className="schematic-hint-key">Hover</span>pauses the flow. Keyboard:{' '}
            <kbd>Tab</kbd> to focus, <kbd>Enter</kbd> to open.
          </p>
        )}
      </figcaption>

      <div className="visually-hidden">
        <p>Schematic, in text:</p>
        <ol>
          {NODES.map(n => (
            <li key={n.id}>
              <strong>{n.label}</strong>: {n.short}. {n.desc}
            </li>
          ))}
        </ol>
        <p>
          Flow: CLIENT to WS GATEWAY to SOUL.md to ROUTER to one of (CODEGEN, RED-TEAM,
          RESOURCE) to TOOL CALLS to RESPONSE.
        </p>
      </div>
    </figure>
  )
}
