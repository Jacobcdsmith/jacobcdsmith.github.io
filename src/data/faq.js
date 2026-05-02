export const homeFaq = [
  {
    q: 'Who is Jacob C. Smith?',
    a: 'Jacob C. Smith is an independent systems engineer, AI red-teamer, and consciousness researcher based in Buckhannon, West Virginia. He helps teams turn operational data into decisions, audits AI systems for safety issues, builds local-first AI tooling, and ships industrial software. Currently shipping the WVRTP facility inspection system for Readyfuels and the Hermes plugin for Nous Research, alongside the JCLAW agentic runtime and ongoing research on emergent meta-cognitive filtering.',
  },
  {
    q: 'What services does Jacob offer?',
    a: 'Operational analytics engagements (SQL, Python, BI dashboards, Excel formula systems for safety + KPIs), AI red-teaming and safety reviews for LLM-powered features and agent stacks, local-first AI system design (JCLAW, MCP infrastructure), and systems audits for founders and ops leaders. See the Services page for scoped offerings.',
  },
  {
    q: 'What is Jacob currently working on?',
    a: 'The WVRTP facility inspection system and a 1,135-formula safety + KPI Excel workbook for Readyfuels; the Hermes agent plugin (three-subagent stack with persistent SOUL.md identity layer) for Nous Research; JCLAW, MCPStarfleetCommand, and a local WebSocket MCP gateway on the agent / MCP infrastructure side; and ESP32-S3 plus UNIHIKER K10 firmware and SDK work on the embedded side.',
  },
  {
    q: 'What is the EMERGENT-MCF-EI project?',
    a: 'EMERGENT-MCF-EI is a research project modeling consciousness as a dynamic spectral filter operating in frequency space. It includes a GPU-accelerated lattice simulation, a Streamlit dashboard, and a forthcoming paper targeting Neurons and Cognition (arXiv q-bio.NC).',
  },
  {
    q: 'What is JCLAW?',
    a: 'JCLAW is a SQLite-backed agentic runtime that treats the LLM API as a programmable execution environment. It supports persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation.',
  },
  {
    q: 'How do I work with Jacob?',
    a: 'Start by emailing jacobcsmithd@gmail.com with a one-paragraph description of the problem you are trying to solve. Most engagements begin with a free 30-minute discovery call to confirm fit before any scoping work.',
  },
]

export const servicesFaq = [
  {
    q: 'How much do engagements cost?',
    a: 'Engagement cost depends on scope. Discovery calls are free. A typical 2-week analytics pilot lands in the low five figures; AI red-team reviews scale with surface area; local-first AI builds are quoted after a hardware and architecture assessment.',
  },
  {
    q: 'Do you work with companies outside the US?',
    a: 'Yes. Most work happens asynchronously over Slack, Linear, or email, with weekly video syncs. Time-zone overlap of at least 3 hours per business day is preferred but not required.',
  },
  {
    q: 'Can you sign an NDA before scoping?',
    a: 'Yes. I will sign your NDA or provide a mutual NDA before any sensitive details are shared.',
  },
  {
    q: 'Do you offer ongoing retainers?',
    a: 'Yes. After a successful initial engagement, many clients move into a monthly retainer for iteration, on-call analysis, and training.',
  },
  {
    q: 'Why local-first AI?',
    a: 'Local-first AI keeps data, prompts, and conversations on your infrastructure. It eliminates telemetry leakage, supports air-gapped environments, and gives you full reproducibility. For sensitive work it is often the only defensible architecture.',
  },
  {
    q: 'Why both analytics and AI?',
    a: 'Both are systems work. A dashboard a leadership team uses every Monday and a three-subagent stack with a persistent identity layer share more than they look like — both are exercises in modeling a workflow, instrumenting it, and shipping something that survives contact with reality. Working across both keeps each grounded in the other.',
  },
]

export default { homeFaq, servicesFaq }
