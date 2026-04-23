import { Helmet } from 'react-helmet-async'

export default function Projects() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jacobcdsmith.github.io'
  return (
    <section id="projects" >
      <Helmet>
        <title>Projects | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Portfolio of 10 featured projects: EMERGENT-MCF-EI consciousness framework, GitHub Language Analysis Platform, JCLAW local-first LLM runtime, MCP servers, and more." />
        <meta property="og:title" content="Projects — Jacob C. Smith" />
        <meta property="og:url" content={`${baseUrl}/projects`} />
        <link rel="canonical" href={`${baseUrl}/projects`} />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> ls projects/</h2>
      </div>
      <div className="panel-content">
        <div className="projects-grid">

          {/* Project 1: EMERGENT-MCF-EI */}
          <article className="project-card featured">
            <div className="project-header">
              <h3>EMERGENT‑MCF‑EI: Multiversal Consciousness Framework</h3>
              <span className="project-status status-active">Active Research</span>
            </div>
            <p className="project-description">A reproducible sandbox where researchers, hackers, and metaphysical thrill‑seekers can evolve adaptive, self‑organising fields that flirt with the boundary between physics and mind. Core innovation: bidirectional representation C(t) ↔ F⁻¹{'{Φ(x)}'} establishing consciousness as a dynamic spectral filter operating across Fourier-flavoured mathematics.</p>
            <div className="project-highlights">
              <h4>Technical Architecture:</h4>
              <ul>
                <li><strong>Lattice Simulation Engine:</strong> Python-first implementation with GPU acceleration (~20× speedup on 128² grids, scalable to 256²)</li>
                <li><strong>Recursive 3D Dynamics:</strong> Nodes encode past, present, and forecasted states with causal feedback loops</li>
                <li><strong>Live Dashboard:</strong> Streamlit-powered real-time visualization with field injection capabilities</li>
                <li><strong>Consciousness Scalar:</strong> Exhibits hysteresis, echo patterns, and phase-locked cycles mimicking cognitive recursion</li>
              </ul>
              <h4>Research Contributions:</h4>
              <ul>
                <li>Modified Einstein field equations incorporating consciousness energy-momentum tensor</li>
                <li>Testable predictions: gamma (40Hz) binding, alpha gating, beta coherence ratios</li>
                <li>Clinical applications: anesthesia monitoring, meditation state quantification</li>
                <li>Hebbian feedback and reinforcement-style tuning for node-level awareness</li>
              </ul>
            </div>
            <div className="project-tech">
              {['Python','PyTorch','JAX','CUDA','Streamlit','Fourier Analysis'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href="https://github.com/Jacobcdsmith/CONSIM" target="_blank" rel="noopener noreferrer" className="project-link">Repository →</a>
              <span className="project-meta">Paper Status: Targeting Neurons and Cognition (arXiv q-bio.NC)</span>
            </div>
          </article>

          {/* Project 2: GitHub Language Analysis Platform */}
          <article className="project-card featured">
            <div className="project-header">
              <h3>GitHub Language Analysis Platform</h3>
              <span className="project-status status-deployed">Production Deployed</span>
            </div>
            <p className="project-description">Full-stack analytics application analyzing 1,200+ repositories across 12 programming languages. A comprehensive Jupyter notebook suite paired with an interactive React frontend processes 200K+ data points to predict repository success with 78% accuracy using ensemble ML techniques.</p>
            <div className="project-highlights">
              <h4>Analysis Pipeline (6 Jupyter Notebooks):</h4>
              <ul>
                <li><strong>Data Exploration:</strong> Quality assessment, distribution analysis, health indicators across 1,200+ repos</li>
                <li><strong>Language Comparison:</strong> ANOVA significance testing, radar charts, performance heatmap matrices</li>
                <li><strong>Correlation Analysis:</strong> Stars vs Forks modeling, popularity-activity quadrants, contributor impact</li>
                <li><strong>Advanced Visualizations:</strong> Executive dashboards, interactive Plotly bubble charts, 3D scatter plots, animated timelines</li>
                <li><strong>ML Predictions:</strong> Repository success modeling with exportable comparison tables</li>
              </ul>
              <h4>Business Impact:</h4>
              <ul>
                <li>Reduced stack selection decision time from weeks to days</li>
                <li>Identified optimal language combinations for team productivity</li>
                <li>Provided data-driven framework for technical hiring decisions</li>
              </ul>
            </div>
            <div className="project-tech">
              {['Python','Pandas','Plotly','React','TypeScript','Vite','Tailwind CSS','Vercel'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href="https://git-hub-language-capstone.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link">Live Demo →</a>
              <span className="project-meta">NewForce Cohort 11 Capstone Project</span>
            </div>
          </article>

          {/* Project 3: JCLAW Framework */}
          <article className="project-card featured">
            <div className="project-header">
              <h3>JCLAW Framework: Local-First LLM Runtime</h3>
              <span className="project-status status-active">Active Development</span>
            </div>
            <p className="project-description">A local-first LLM runtime that treats the model API as a programmable execution environment—not a chatbox. Persistent sessions, multi-provider support, conversation branching, response diffing, agentic workflow loops, eval/benchmarking, prompt injection sandboxing, and MCP dual-mode operation (server + client).</p>
            <div className="project-highlights">
              <h4>Technical Architecture:</h4>
              <ul>
                <li><strong>Gate Server:</strong> Express + WebSocket JSON-RPC protocol router (~30 methods) with React + Vite LCARS-aesthetic dashboard</li>
                <li><strong>Storage Layer:</strong> SQLite (WAL + FTS5)—sessions, messages, prompts, evals, sandbox config; all local, zero telemetry</li>
                <li><strong>Runtime Modules:</strong> chat, eval, fine-tune, embeddings, diffing, pipeline output piping (files, clipboard, webhooks, shell scripts)</li>
                <li><strong>Agent Runtime:</strong> Multi-step autonomous task orchestration with tool-calling loops</li>
              </ul>
              <h4>Capabilities:</h4>
              <ul>
                <li>Fork any session at any message; explore alternative reasoning paths non-destructively</li>
                <li>Word/line-level response diffs; parallel model comparison across providers</li>
                <li>Prompt injection detection, red-team harness, system prompt sandboxing</li>
                <li>MCP dual-mode: expose JCLAW as tool provider; consume external MCP servers in-session</li>
                <li>Providers: Anthropic, OpenAI, Groq, Google Gemini, Ollama, LM Studio</li>
              </ul>
            </div>
            <div className="project-tech">
              {['TypeScript','Node.js','SQLite','React','Vite','MCP Protocol','WebSocket','Express'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href="https://github.com/Jacobcdsmith/jclaw-framework" target="_blank" rel="noopener noreferrer" className="project-link">Repository →</a>
            </div>
          </article>

          {/* Project 4: MCPStarfleetCommand */}
          <article className="project-card">
            <div className="project-header">
              <h3>MCPStarfleetCommand: Enhanced MCP Server + Dashboard</h3>
              <span className="project-status status-active">Active Development</span>
            </div>
            <p className="project-description">A comprehensive Model Context Protocol server with a custom-built dashboard UI providing developer tools, system operations, and data processing capabilities. Dual-interface design: MCP stdio transport for Claude Code integration alongside an HTTP dashboard for interactive use.</p>
            <div className="project-highlights">
              <h4>Interface Layers:</h4>
              <ul>
                <li><strong>MCP Server:</strong> Protocol-compliant stdio transport for direct Claude Code integration</li>
                <li><strong>HTTP Dashboard:</strong> Express.js + vanilla frontend with interactive terminal, live system stats, and one-click tool execution</li>
                <li><strong>Shared Engine:</strong> Unified tool execution layer serving both interfaces simultaneously</li>
              </ul>
              <h4>Tool Categories:</h4>
              <ul>
                <li><strong>Developer Tools:</strong> Git operations (status, log, diff, branches), file system management, code search</li>
                <li><strong>System Operations:</strong> Command execution (sync/async), process management, system monitoring</li>
                <li><strong>Data Processing:</strong> JSON parsing/formatting, file content manipulation, search capabilities</li>
              </ul>
            </div>
            <div className="project-tech">
              {['TypeScript','Node.js','MCP Protocol','Express','Git'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href="https://github.com/Jacobcdsmith/MCPStarfleetCommand" target="_blank" rel="noopener noreferrer" className="project-link">Repository →</a>
            </div>
          </article>

          {/* Project 5: Local AI Stack */}
          <article className="project-card">
            <div className="project-header">
              <h3>Local AI Stack: Offline Intelligence Infrastructure</h3>
              <span className="project-status status-active">Active Development</span>
            </div>
            <p className="project-description">A complete offline AI infrastructure featuring a CLI-driven interface with multiple MCP (Model Context Protocol) server integrations. Zero telemetry, full local control—designed for air-gapped environments and privacy-conscious deployments.</p>
            <div className="project-highlights">
              <h4>System Architecture:</h4>
              <ul>
                <li><strong>MCP Registry:</strong> YAML-configured server management with hot-reload capabilities</li>
                <li><strong>CLI Interface:</strong> ASCII art branding, real-time tool listing, server status monitoring</li>
                <li><strong>API Layer:</strong> RESTful endpoints for chat completions and tool execution</li>
                <li><strong>UI Dashboard:</strong> Web interface for visual interaction and system monitoring</li>
              </ul>
              <h4>Capabilities:</h4>
              <ul>
                <li>3+ MCP servers available at initialization</li>
                <li>Cross-platform quick-start scripts (PowerShell/Bash)</li>
                <li>Automated environment setup with dependency management</li>
                <li>Comprehensive logging infrastructure</li>
              </ul>
            </div>
            <div className="project-tech">
              {['Python','MCP Protocol','REST API','YAML','PowerShell','Bash'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <span className="project-meta">Private Infrastructure / Local Deployment</span>
            </div>
          </article>

          {/* Project 6: USB Pentesting Toolkit */}
          <article className="project-card">
            <div className="project-header">
              <h3>USB Pentesting Toolkit: Bootable Security Research Environment</h3>
              <span className="project-status status-active">Active Development</span>
            </div>
            <p className="project-description">Custom Linux distribution optimized for authorized security research featuring an AI-powered CLI that boots directly into a local LLM assistant. Zero telemetry, complete offline operation—designed for ethical penetration testing and hardware exploitation research.</p>
            <div className="project-highlights">
              <h4>Architecture Layers:</h4>
              <ul>
                <li><strong>AI Interface:</strong> Local LLM (llama.cpp), natural language CLI, MCP tool integrations</li>
                <li><strong>Persistence Layer:</strong> Encrypted storage, configuration retention across boots</li>
                <li><strong>Core Security Tools:</strong> nmap, masscan, Wireshark, tcpdump, Metasploit, BurpSuite, John, Hashcat</li>
                <li><strong>Hardware Exploitation:</strong> USB Rubber Ducky payloads, HID emulation (Teensy), RFID/NFC tools</li>
              </ul>
              <h4>Project Structure:</h4>
              <ul>
                <li>Custom bootloader configs (GRUB/syslinux)</li>
                <li>Pre-configured payloads library</li>
                <li>Firmware management for hardware devices</li>
                <li>Comprehensive documentation and legal disclaimers</li>
              </ul>
            </div>
            <div className="project-tech">
              {['Linux','llama.cpp','BadUSB','HID Emulation','Network Analysis','GRUB'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <span className="project-meta">Authorized Security Research Only</span>
            </div>
          </article>

          {/* Project 7: Biology Sandbox Simulator */}
          <article className="project-card">
            <div className="project-header">
              <h3>Biology Sandbox Simulator: Evolutionary Modeling Platform</h3>
              <span className="project-status status-active">Active Development</span>
            </div>
            <p className="project-description">A physics-based simulation environment modeling the evolution of biological organisms within dynamic environments. An interactive platform for exploring growth, reproduction, mutation, and emergent biological processes through computational modeling.</p>
            <div className="project-highlights">
              <h4>Core Systems:</h4>
              <ul>
                <li><strong>Environment Management:</strong> Dynamic habitat simulation with configurable parameters</li>
                <li><strong>Organism Behavior:</strong> Species modeling with age, health, and biological process simulation</li>
                <li><strong>Physics Engine:</strong> Interaction calculations between organisms and environments</li>
                <li><strong>Utility Functions:</strong> Randomization, evolutionary calculations, mutation algorithms</li>
              </ul>
              <h4>Architecture:</h4>
              <ul>
                <li>TypeScript-first modular design</li>
                <li>Separate concerns: environments, organisms, physics, utilities</li>
                <li>Extensible simulation framework</li>
              </ul>
            </div>
            <div className="project-tech">
              {['TypeScript','Node.js','Physics Simulation','Evolutionary Algorithms'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <a href="https://github.com/Jacobcdsmith/biology-sandbox-simulator" target="_blank" rel="noopener noreferrer" className="project-link">Repository →</a>
            </div>
          </article>

          {/* Project 8: WeGo Transit Optimization */}
          <article className="project-card">
            <div className="project-header">
              <h3>WeGo Public Transit Optimization</h3>
              <span className="project-status status-completed">Completed</span>
            </div>
            <p className="project-description">Comprehensive analysis of 338,861 bus trips using Python and SQL to identify operational inefficiencies in Nashville's public transit system. Developed a $155K improvement roadmap with projected 3-5% reduction in late arrivals on targeted routes.</p>
            <div className="project-highlights">
              <h4>Analytical Methodology:</h4>
              <ul>
                <li><strong>Geospatial Analysis:</strong> Route efficiency mapping and bottleneck identification</li>
                <li><strong>Temporal Pattern Recognition:</strong> Peak hour scheduling optimization through time-series analysis</li>
                <li><strong>Statistical Validation:</strong> Hypothesis testing for intervention effectiveness</li>
                <li><strong>Executive Dashboard:</strong> KPI tracking with real-time performance metrics</li>
              </ul>
              <h4>Deliverables:</h4>
              <ul>
                <li>Presentation to transit authority leadership</li>
                <li>Actionable improvement roadmap with ROI projections</li>
                <li>Interactive Tableau visualizations</li>
              </ul>
            </div>
            <div className="project-tech">
              {['Python','SQL','Tableau','Geospatial','Statistical Analysis'].map(t => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="project-links">
              <span className="project-meta">NewForce Analytics Project</span>
            </div>
          </article>

          {/* Project 9: Peace as Voltage */}
          <article className="project-card">
            <div className="project-header">
              <h3>Peace as Voltage: Conflict Resolution Framework</h3>
              <span className="project-status status-published">Published</span>
            </div>
            <p className="project-description">A theoretical framework arguing that harmony isn't the absence of conflict, but the successful management of high-tension energy. Develops the "high-tension wiring" metaphor: true stability requires robust infrastructure for channeling conflicting forces rather than eliminating them.</p>
            <div className="project-highlights">
              <h4>Framework Applications:</h4>
              <ul>
                <li><strong>Organizational Dynamics:</strong> Team conflict as productive energy when properly channeled</li>
                <li><strong>International Relations:</strong> Geopolitical stability through tension management, not suppression</li>
                <li><strong>Personal Relationships:</strong> Healthy conflict as relationship strengthening mechanism</li>
                <li><strong>Systems Design:</strong> Engineering solutions that embrace opposing constraints</li>
              </ul>
              <h4>Core Thesis:</h4>
              <ul>
                <li>Conflict avoidance creates systemic fragility</li>
                <li>High-voltage systems require better insulation, not less current</li>
                <li>Stability emerges from dynamic equilibrium, not static peace</li>
              </ul>
            </div>
            <div className="project-links">
              <span className="project-meta">Long-form Essay / Theoretical Framework</span>
            </div>
          </article>

          {/* Project 10: Protocols for Myth-Driven Life */}
          <article className="project-card">
            <div className="project-header">
              <h3>Protocols for a Myth-Driven Life</h3>
              <span className="project-status status-active">Living Document</span>
            </div>
            <p className="project-description">A gamified logic system treating human existence as debuggable code. Structures personal development through algorithmic thinking, mythological archetypes, and systems optimization—a philosophical operating system for navigating chaos with intentionality.</p>
            <div className="project-highlights">
              <h4>Core Modules:</h4>
              <ul>
                <li><strong>Decision Trees:</strong> Algorithmic frameworks for navigating uncertainty and chaos</li>
                <li><strong>Recursive Self-Improvement:</strong> Feedback loops for continuous personal optimization</li>
                <li><strong>Resource Allocation:</strong> Energy management as computational resource scheduling</li>
                <li><strong>Narrative Coherence:</strong> Life story as program integrity—debugging inconsistencies</li>
              </ul>
              <h4>Philosophical Foundation:</h4>
              <ul>
                <li>Mythological archetypes as design patterns for human behavior</li>
                <li>Existence as runtime environment with configurable parameters</li>
                <li>Personal growth as iterative development cycles</li>
              </ul>
            </div>
            <div className="project-links">
              <span className="project-meta">Interactive Guide / Philosophical Operating System</span>
            </div>
          </article>

        </div>
      </div>
    </section>
  )
}
