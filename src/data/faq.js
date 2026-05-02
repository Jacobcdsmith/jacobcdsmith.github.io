export const homeFaq = [
  {
    q: 'Who is Jacob C. Smith?',
    a: 'Jacob C. Smith is a systems engineer and AI systems builder based in Buckhannon, West Virginia. He builds industrial tooling for Readyfuels (WVRTP facility inspection system, Excel formula systems for safety and KPIs), ships and dissects AI agent stacks (Hermes plugin for Nous Research, the JCLAW agentic runtime, MCPStarfleetCommand), and works across embedded/edge hardware (ESP32-S3, UNIHIKER K10/M10). He is a NewForce Cohort 11 graduate and a member of Bridging Innovations Morgantown.',
  },
  {
    q: 'What services does Jacob offer?',
    a: 'Four scoped offerings: industrial / operations tooling (full-stack web apps, QR + Power Automate, Excel formula systems), agent & AI systems (subagent orchestration, persistent identity layers, MCP infrastructure), local-first AI systems (JCLAW, MCP gateways, sovereignty-first runtimes), and embedded & edge integration (ESP32-S3 firmware in C/ESP-IDF, UNIHIKER SDK work). See the Services page for scope and process.',
  },
  {
    q: 'What is Jacob currently working on?',
    a: 'Currently shipping the WVRTP facility inspection system and a 1,135-formula safety + KPI Excel workbook for Readyfuels; the Hermes agent plugin (three-subagent stack with persistent SOUL.md identity) for Nous Research; JCLAW and MCPStarfleetCommand on the agent / MCP infrastructure side; and ESP32-S3 plus UNIHIKER K10 firmware and SDK work on the embedded side.',
  },
  {
    q: 'Is Jacob open to full-time roles?',
    a: 'Yes. Actively targeting remote Data Analyst, BI Analyst, and Junior Data Engineer roles at $70K+ in addition to consulting engagements. The fastest way to start a conversation is email — jacobcsmithd@gmail.com.',
  },
  {
    q: 'What is JCLAW?',
    a: 'JCLAW is a SQLite-backed agentic runtime that treats the LLM API as a programmable execution environment. It supports persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation.',
  },
  {
    q: 'How do I work with Jacob?',
    a: 'Email jacobcsmithd@gmail.com with a one-paragraph description of the problem you are trying to solve. Most engagements begin with a free 30-minute discovery call to confirm fit before any scoping work.',
  },
]

export const servicesFaq = [
  {
    q: 'Why both industrial tooling and AI?',
    a: 'Both are systems work. Building a QR-driven facility inspection system that real operators will actually use, and building a three-subagent stack with a persistent identity layer, share more than they look like — both are exercises in modeling a workflow, instrumenting it, and shipping something that survives contact with reality. Working across both keeps the AI work grounded and keeps the industrial work modern.',
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
    a: 'Yes. After a successful initial engagement, many clients move into a monthly retainer for iteration, on-call work, and training.',
  },
  {
    q: 'Why local-first AI?',
    a: 'Local-first AI keeps data, prompts, and conversations on your infrastructure. It eliminates telemetry leakage, supports air-gapped environments, and gives you full reproducibility. For sensitive industrial and regulated work it is often the only defensible architecture.',
  },
  {
    q: 'Are you available for full-time employment?',
    a: 'Yes — actively targeting remote Data Analyst, BI Analyst, or Junior Data Engineer roles at $70K+ in parallel with consulting work.',
  },
]

export default { homeFaq, servicesFaq }
