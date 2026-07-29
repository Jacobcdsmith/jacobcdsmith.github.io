import profile from './profile.js'

export const projects = [
  {
    name: 'GitHub Language Analysis Platform',
    repo: 'Jacobcdsmith/GitHub-Language-Capstone',
    status: 'Live · Capstone',
    summary:
      'Data analysis capstone: reproducible Jupyter notebooks plus a Vite/React dashboard exploring language trends across 1,200+ GitHub repositories.',
    detail:
      'Six-notebook pipeline (exploration → language comparison with ANOVA → correlation analysis → advanced/3D Plotly visualizations → feature engineering) feeding derived CSVs into an interactive dashboard with sunburst, treemap, and animated-evolution views.',
    tags: ['python', 'pandas', 'data-analysis', 'react', 'plotly', 'jupyter'],
    actions: [
      { label: 'Live demo', href: 'https://git-hub-language-capstone.vercel.app/', external: true },
      { label: 'GitHub', href: 'https://github.com/Jacobcdsmith/GitHub-Language-Capstone', external: true },
    ],
  },
  {
    name: 'CONSIM — GPU-Accelerated Signal Processing',
    repo: 'Jacobcdsmith/CONSIM',
    status: 'Active development',
    summary:
      'GPU-accelerated framework for real-time pattern detection in high-dimensional time-series data — a 20x performance uplift over a CPU baseline.',
    detail:
      'CUDA/PyTorch + JAX for parallelized mutual-information computation, with phase-coherence tracking and spectral-analysis modules for streaming anomaly detection. Includes a Streamlit dashboard for live exploration and a results pipeline.',
    tags: ['pytorch', 'jax', 'cuda', 'gpu', 'signal-processing', 'streamlit'],
    actions: [{ label: 'GitHub', href: 'https://github.com/Jacobcdsmith/CONSIM', external: true }],
  },
  {
    name: 'WVRTP Facility Inspection System',
    status: 'Shipped · Client (Readyfuels)',
    summary:
      'Full-stack React/Vite/TypeScript web app on Vercel for facility inspections, with QR-driven capture wired into Power Automate.',
    detail:
      'Protected routes, role-aware UI, mobile-first capture with GPS reverse-geocoding, and a flat-JSON payload that pushes straight into a Microsoft 365 Excel backend — no database required. Companion artifact: a 1,135-formula Excel workbook for safety scoring and KPIs used by operators in the field.',
    tags: ['react', 'vite', 'typescript', 'vercel', 'power-automate', 'industrial'],
    actions: [
      { label: 'Read the case study', to: '/blog/wvrtp-satellites-to-street-signs' },
      { label: 'Readyfuels', href: 'https://readyfuels.com', external: true },
    ],
  },
  {
    name: 'JCLAW',
    repo: 'Jacobcdsmith/jclaw-framework',
    status: 'Active development',
    summary:
      'SQLite-backed agentic runtime that treats the LLM API as a programmable execution environment.',
    detail:
      'Persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation. Companion projects: MCPStarfleetCommand (dual-transport MCP server) and a local WebSocket MCP gateway. Designed for sovereignty: zero telemetry, fully local.',
    tags: ['llm', 'local-first', 'mcp', 'agent-stacks', 'sqlite'],
    actions: [{ label: 'GitHub', href: 'https://github.com/Jacobcdsmith/jclaw-framework', external: true }],
  },
  {
    name: 'Hermes plugin (Nous Research)',
    status: 'Shipped · Agent infrastructure',
    summary:
      'Three-subagent stack — codegen, red-team, resource-gathering — orchestrated under a persistent SOUL.md identity layer.',
    detail:
      'OpenRouter-based multi-provider routing, deterministic subagent contracts, and red-team-as-first-class behavior so the system tests itself. Built for the Hermes line at Nous Research.',
    tags: ['agent-stacks', 'openrouter', 'red-team', 'identity-layer'],
    actions: [{ label: 'Nous Research', href: 'https://nousresearch.com', external: true }],
  },
  {
    name: 'kairos',
    repo: 'Jacobcdsmith/kairos',
    status: 'Live · Open source',
    summary:
      'Local-first knowledge workspace that parses docs, code, and logs by actual structure and traces concepts through them via explicit, typed relations — no embeddings, no similarity guessing.',
    detail:
      'SQLite + FTS5 store, strict-typed Python 3.12 (Pyright strict, Ruff, full pytest coverage), zero network calls. CLI and a Textual-based terminal UI; every search result carries its exact provenance down to the line or JSON path.',
    tags: ['python', 'sqlite', 'local-first', 'cli', 'provenance'],
    actions: [{ label: 'GitHub', href: 'https://github.com/Jacobcdsmith/kairos', external: true }],
  },
  {
    name: 'agent-flow-canvas',
    repo: 'Jacobcdsmith/agent-flow-canvas',
    status: 'Live · Open source',
    summary:
      'Browser-based visual builder for AI agent workflows. Drag nodes onto a canvas, wire them together, configure LLM gateways, and run the flow — all in your browser. BYO API keys, zero telemetry.',
    detail:
      'Built with React, ReactFlow, and Vite. Drag-and-drop workflow canvas with LLM, Tool, Router, Memory, Subagent, and Trigger nodes. Supports OpenAI, Anthropic, Gemini, Ollama, and any OpenAI-compatible provider — API keys stay in your browser. One click generates runnable Python or JavaScript. Deployed on GitHub Pages, MIT licensed.',
    tags: ['react', 'ai-agents', 'workflow-builder', 'open-source', 'typescript'],
    actions: [
      { label: 'Live demo', href: 'https://jacobcdsmith.github.io/agent-flow-canvas/', external: true },
      { label: 'GitHub', href: 'https://github.com/Jacobcdsmith/agent-flow-canvas', external: true },
    ],
  },
  {
    name: 'Wave Analyzer (OmniWave)',
    repo: 'Jacobcdsmith/wave-analyzer',
    status: 'Active development · Android',
    summary:
      'Real-time audio & RF spectrum analyzer for Android — 7 visualization modes, an in-place Cooley-Tukey FFT core, and one-tap AI signal classification.',
    detail:
      'Kotlin + Jetpack Compose Canvas rendering waveform, spectrum, 3D waterfall, IQ constellation, and radar views; RTL-SDR remote support over TCP; Gemini-powered classification of peak spectral features. Unit-tested DSP core plus Robolectric/Roborazzi screenshot tests in CI.',
    tags: ['kotlin', 'android', 'dsp', 'fft', 'signal-processing'],
    actions: [{ label: 'GitHub', href: 'https://github.com/Jacobcdsmith/wave-analyzer', external: true }],
  },
  {
    name: 'NIGHTMARE Penetration Testing Suite',
    repo: 'Jacobcdsmith/nightmare-pentesting-suite',
    status: 'Active development · Security',
    summary:
      'Web-based penetration testing console for authorized security testing — interactive terminal, port/vulnerability scanning, and a real-time findings dashboard.',
    detail:
      'Built to give the AI red-teaming practice a concrete, hands-on artifact: WebSocket-backed PTY terminal, multi-target scan management, and severity-tagged reports, with rate limiting, CORS, and input validation baked into the API layer.',
    tags: ['security', 'red-team', 'node', 'websocket'],
    actions: [{ label: 'GitHub', href: 'https://github.com/Jacobcdsmith/nightmare-pentesting-suite', external: true }],
  },
  {
    name: 'UNIHIKER K10 skill package',
    status: 'Active development · Embedded',
    summary:
      'A skill package for the UNIHIKER K10 covering MicroPython plus the full C/C++ SDK, grounded in the actual hardware schematic.',
    detail:
      'Built so other developers can pick up the K10 and ship without re-deriving the SDK from scratch. Proven out in K10-Δ, a self-modifying autonomous agent that drives the physical board (display, RGB LEDs, sensors, speaker) as its body.',
    tags: ['unihiker', 'esp32-s3', 'micropython', 'c++', 'embedded'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'ESP32-S3 firmware work',
    status: 'Active · Embedded',
    summary:
      'Modular firmware in ESP-IDF / C with documented module boundaries — connectivity, peripheral drivers, and provisioning flows separated cleanly.',
    detail:
      'Designed to be the device-side counterpart to the agent + web layers above: BLE / Wi-Fi / MQTT glue, reproducible flashing, and field-deployment notes.',
    tags: ['esp32', 'esp-idf', 'firmware', 'c', 'embedded'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'jacobcdsmith.github.io',
    repo: 'Jacobcdsmith/jacobcdsmith.github.io',
    status: 'Live',
    summary:
      'This site. Static React + Vite SPA with pre-rendered HTML for SEO/AEO, RSS, and an LLM-friendly llms.txt manifest.',
    detail:
      'GitHub Pages deployment, custom blog pipeline, structured data on every page, light/dark theme, accessible navigation, no external CMS.',
    tags: ['react', 'vite', 'seo', 'static'],
    actions: [{ label: 'Source', href: 'https://github.com/Jacobcdsmith/jacobcdsmith.github.io', external: true }],
  },
  {
    name: 'Operational analytics & pro bono engagements',
    status: 'Client work',
    summary:
      'A growing portfolio of dashboards, forecasts, and decision-support systems built for ops leaders and small teams — plus selected pro bono infrastructure work.',
    detail:
      'Pro bono engagements include a regional hospitality client (ecommerce platform pivot evaluation) and Spark / sparkwv.org (zero-downtime email infrastructure migration from HostGator to Google Workspace). Most paid client work is under NDA — email for references.',
    tags: ['analytics', 'sql', 'python', 'bi', 'pro-bono'],
    actions: [{ label: 'Email for references', href: `mailto:${profile.email}` }],
  },
]

export default projects
