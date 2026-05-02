export const services = [
  {
    slug: 'analytics-engagements',
    title: 'Operational Analytics Engagements',
    summary:
      'Turn the data you already have into reliable dashboards, forecasts, and decisions you can defend in a meeting.',
    forWho: 'Operations leaders, RevOps, and data-light teams who need answers, not another tool.',
    deliverables: [
      'SQL/Python data audit with documented gaps and quick wins',
      'Production-ready Tableau, Power BI, or Streamlit dashboards',
      'Forecasts and KPI models with explainability',
      'Loom + written handoff so your team owns the work',
    ],
    process: [
      'Discovery call (free) — clarify the decision the dashboard must support',
      '2-week scoped pilot with one shipped artifact',
      'Optional retainer for iteration, training, and on-call analysis',
    ],
  },
  {
    slug: 'ai-red-teaming',
    title: 'AI Red-Teaming & Safety Reviews',
    summary:
      'Adversarial testing of LLM-powered features: prompt injection, jailbreaks, agentic loops, and tool-use exploits.',
    forWho: 'Product teams shipping AI features who need an outside reviewer before launch.',
    deliverables: [
      'Threat model document tailored to your architecture',
      'Reproducible attack harness (your stack or JCLAW)',
      'Severity-ranked findings with mitigations',
      'Optional re-test after fixes',
    ],
    process: [
      'NDA + scoping call',
      '1–3 week engagement depending on surface area',
      'Findings report and live walkthrough with your team',
    ],
  },
  {
    slug: 'local-first-ai',
    title: 'Local-First AI Systems',
    summary:
      'Custom LLM tooling that runs on your hardware: zero telemetry, full sovereignty, MCP-ready.',
    forWho: 'Teams with sensitive data, air-gapped requirements, or strong privacy posture.',
    deliverables: [
      'Architecture review and model selection',
      'Local runtime (llama.cpp, Ollama, vLLM) integrated with your stack',
      'MCP servers for your internal tools',
      'Documentation and team training',
    ],
    process: [
      'Discovery + hardware assessment',
      'Phased build (foundation → tools → workflows)',
      'Handoff with runbooks and monitoring',
    ],
  },
  {
    slug: 'systems-audits',
    title: 'Systems Audits & Decision Architecture',
    summary:
      'For founders and leaders who need an outside systems-thinker to map what’s actually happening and what to do next.',
    forWho: 'Founders, ops leaders, and small teams stuck between “growing” and “scaling.”',
    deliverables: [
      'Process map of current state with bottleneck callouts',
      'Decision architecture: who decides what, with what data',
      'Prioritized roadmap with cost/impact estimates',
      'Optional 30/60/90 implementation support',
    ],
    process: [
      'Founder interview + 3–5 stakeholder interviews',
      'Data and process audit',
      'Findings + roadmap presentation',
    ],
  },
]

export default services
