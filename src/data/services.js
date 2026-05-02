export const services = [
  {
    slug: 'industrial-operations-tooling',
    title: 'Industrial / Operations Tooling',
    summary:
      'Full-stack web apps for physical-world workflows: QR-driven inspections, Power Automate pipelines, protected routes, Excel formula systems, and the stakeholder coordination to keep them shipping.',
    forWho:
      'Operations leaders, EHS managers, and industrial teams who need real software for real workflows — not another spreadsheet someone forgets to fill out.',
    deliverables: [
      'React/Vite/TypeScript web app deployed to Vercel with protected routes and role-aware UI',
      'QR-driven mobile-first capture flows wired to Power Automate / Microsoft 365 backends',
      'Excel formula systems (KPIs, safety scoring, conditional logic) that operators actually use',
      'Stakeholder-facing documentation and a clear handoff so the team owns the result',
    ],
    process: [
      'Discovery call (free) — clarify the operational decision the system must support',
      'Scoped pilot: ship a working slice in 2–4 weeks, then iterate against real field use',
      'Optional retainer for further features, training, and incident response',
    ],
    proofUrl: 'https://readyfuels.com',
    proofLabel: 'Proof case: Readyfuels (WVRTP facility inspection system)',
  },
  {
    slug: 'agent-and-ai-systems',
    title: 'Agent & AI Systems',
    summary:
      'Build, deploy, and dissect agent stacks: subagent orchestration (codegen / red-team / resource-gathering), persistent identity layers, multi-provider routing, and MCP servers and gateways.',
    forWho:
      'Teams shipping LLM-powered features who need agent infrastructure designed by someone who has both built and red-teamed them.',
    deliverables: [
      'Agent architecture review and orchestration design (codegen, red-team, resource subagents)',
      'Persistent identity layers (e.g. SOUL.md-style) and multi-provider routing via OpenRouter',
      'MCP server and gateway implementation across stdio, SSE, and WebSocket transports',
      'Adversarial test harness with severity-ranked findings and reproducible attacks',
    ],
    process: [
      'NDA + scoping call',
      '2–4 week engagement depending on surface area',
      'Findings + architecture report and live walkthrough with your team',
    ],
    proofUrl: 'https://nousresearch.com',
    proofLabel: 'Delivery example: Hermes plugin (Nous Research)',
  },
  {
    slug: 'local-first-ai',
    title: 'Local-First AI Systems',
    summary:
      'Custom LLM tooling that runs on your hardware or your VPC: zero telemetry, full sovereignty, MCP-ready. Backed by JCLAW, MCPStarfleetCommand, and a local WebSocket MCP gateway built to sever cloud dependencies by design.',
    forWho:
      'Teams with sensitive data, air-gapped requirements, or strong privacy posture who still want modern agent capabilities.',
    deliverables: [
      'Architecture review and model selection (llama.cpp, Ollama, vLLM, LM Studio)',
      'JCLAW-style runtime integration with persistent sessions, branching, and evals',
      'Local MCP server + WebSocket gateway so internal tools route without leaving your network',
      'Documentation, runbooks, and team training',
    ],
    process: [
      'Discovery + hardware / network assessment',
      'Phased build: foundation → tools → agent workflows',
      'Handoff with runbooks and monitoring',
    ],
  },
  {
    slug: 'embedded-and-edge-integration',
    title: 'Embedded & Edge Integration',
    summary:
      'ESP32-S3 firmware in C/ESP-IDF, UNIHIKER K10/M10 SDK work, and edge devices that talk back to web and AI layers. Industrial-context AI rather than pure firmware: hardware that does something useful in a real environment.',
    forWho:
      'Teams putting custom hardware into the field who need someone comfortable across firmware, web backends, and the agent layer that sits on top.',
    deliverables: [
      'Modular ESP-IDF / C firmware with documented module boundaries',
      'UNIHIKER K10 skill packages (MicroPython + full C/C++ SDK coverage grounded in the actual hardware schematic)',
      'Connectivity glue (BLE / Wi-Fi / HTTPS / MQTT) between device, web app, and agent backend',
      'Field-deployment notes and a reproducible flashing / provisioning pipeline',
    ],
    process: [
      'Hardware + use-case scoping call',
      'Iterative firmware + integration build against real hardware',
      'Handoff with schematics, source, and deployment runbook',
    ],
  },
]

export default services
