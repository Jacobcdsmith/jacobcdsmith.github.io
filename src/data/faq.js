export const homeFaq = [
  {
    q: 'Who is Jacob C. Smith?',
    a: 'Jacob C. Smith is a data scientist and ML engineer based in Buckhannon, West Virginia, transitioning from seven years of enterprise sales and account management (FleetPride, Cole Truck Parts) into applied analytics and machine learning via the NewForce Cohort 11 data science program. He builds GPU-accelerated ML systems, production analytics, and has shipped the WVRTP facility inspection system for Readyfuels and the Hermes plugin for Nous Research. He is open to full-time Data Scientist / ML Engineer roles.',
  },
  {
    q: 'What is Jacob looking for?',
    a: 'A full-time Data Scientist or Machine Learning Engineer role, remote or on-site. He is also available for scoped operational-analytics and AI-tooling engagements — see the Services page.',
  },
  {
    q: 'What is Jacob currently working on?',
    a: 'CONSIM, a GPU-accelerated signal-processing framework (20x performance uplift via CUDA/PyTorch/JAX); the GitHub Language Analysis Platform, a data-analysis capstone across 1,200+ repositories; the WVRTP facility inspection system and a 1,135-formula safety + KPI Excel workbook for Readyfuels; the Hermes agent plugin for Nous Research; and JCLAW / kairos on the local-first AI infrastructure side.',
  },
  {
    q: 'What is CONSIM?',
    a: 'CONSIM is a GPU-accelerated framework for real-time pattern detection in high-dimensional time-series data, built with CUDA/PyTorch and JAX. It achieves a 20x performance uplift over a CPU baseline and includes phase-coherence tracking and spectral-analysis modules for streaming anomaly detection.',
  },
  {
    q: 'What is JCLAW?',
    a: 'JCLAW is a SQLite-backed agentic runtime that treats the LLM API as a programmable execution environment. It supports persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation.',
  },
  {
    q: 'How do I get in touch with Jacob?',
    a: 'Start by emailing jacobcsmithd@gmail.com with a one-paragraph description of the role or problem. For consulting engagements, most start with a free 30-minute discovery call to confirm fit before any scoping work.',
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
