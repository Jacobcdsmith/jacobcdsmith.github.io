export const services = [
  {
    slug: 'analytics-engagements',
    title: 'Operational Analytics Engagements',
    summary:
      'Turn the data you already have into reliable dashboards, forecasts, and decisions you can defend in a meeting — including the kind of formula-heavy KPI and safety scoring systems that operators actually use in the field.',
    forWho: 'Operations leaders, EHS managers, RevOps, and data-light teams who need answers, not another tool.',
    deliverables: [
      'SQL/Python data audit with documented gaps and quick wins',
      'Production-ready Tableau, Power BI, or Streamlit dashboards',
      'Excel formula systems for KPIs, safety scoring, and conditional logic that survive contact with operators',
      'Forecasts and KPI models with explainability',
      'Loom + written handoff so your team owns the work',
    ],
    process: [
      'Discovery call (free) — clarify the decision the dashboard must support',
      '2-week scoped pilot with one shipped artifact',
      'Optional retainer for iteration, training, and on-call analysis',
    ],
    proofUrl: 'https://readyfuels.com',
    proofLabel: 'Recent delivery: 1,135-formula safety + KPI workbook for Readyfuels (WVRTP).',
  },
  {
    slug: 'ai-red-teaming',
    title: 'AI Red-Teaming & Safety Reviews',
    summary:
      'Adversarial testing of LLM-powered features and agent stacks: prompt injection, jailbreaks, agentic loops, and tool-use exploits — by someone who has built and shipped a red-team subagent as part of a delivered system.',
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
    proofUrl: 'https://nousresearch.com',
    proofLabel: 'Delivery example: red-team subagent inside the Hermes plugin for Nous Research.',
  },
  {
    slug: 'local-first-ai',
    title: 'Local-First AI Systems',
    summary:
      'Custom LLM tooling that runs on your hardware or your VPC: zero telemetry, full sovereignty, MCP-ready. Backed by JCLAW, MCPStarfleetCommand, and a local WebSocket MCP gateway built to sever cloud dependencies by design.',
    forWho: 'Teams with sensitive data, air-gapped requirements, or strong privacy posture.',
    deliverables: [
      'Architecture review and model selection (llama.cpp, Ollama, vLLM, LM Studio)',
      'JCLAW-style agentic runtime integrated with your stack — persistent sessions, branching, evals, agentic loops',
      'Local MCP server + WebSocket gateway so internal tools route without leaving your network',
      'Documentation, runbooks, and team training',
    ],
    process: [
      'Discovery + hardware / network assessment',
      'Phased build (foundation → tools → agent workflows)',
      'Handoff with runbooks and monitoring',
    ],
  },
  {
    slug: 'systems-audits',
    title: 'Systems Audits & Decision Architecture',
    summary:
      'For founders and leaders who need an outside systems-thinker to map what’s actually happening and what to do next — including platform-pivot evaluations, infrastructure migrations, and stakeholder coordination across operational and EHS surfaces.',
    forWho: 'Founders, ops leaders, and small teams stuck between “growing” and “scaling.”',
    deliverables: [
      'Process map of current state with bottleneck callouts',
      'Decision architecture: who decides what, with what data',
      'Vendor / platform pivot evaluations (e.g. ecommerce, infrastructure, identity)',
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
