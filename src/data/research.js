export const research = [
  {
    slug: 'causal-compression-graphs',
    title: 'Causal Compression Graphs (CCG)',
    status: 'public',
    summary:
      'A unified information-theoretic framework that explains how large language models transition from memorization to reasoning. Argues that reasoning emerges precisely when models discover sparse causal graph structures inside their hidden representations, that reinforcement learning functions as a causal intervention on those structures, and that emergence can be quantified and predicted via graph-theoretic metrics rather than raw parameter count. Introduces metrics for detecting reasoning capability emergence during training, and predicts which architectures (e.g. MoE with gating) fundamentally enable causal-structure discovery.',
    file: '/research/causal-compression-graphs.md',
    fileLabel: 'Read the paper (Markdown)',
    tags: ['theory', 'llms', 'information-theory', 'causal-inference', 'emergence'],
  },
  {
    slug: 'emergent-relational-ontology',
    title: 'Emergent Relational Ontology (ERO)',
    status: 'public',
    summary:
      'A relational ontology framework: rather than treating entities as primitives with relations attached, it derives entities as stable patterns within a substrate of relations. Companion document to the consciousness modeling thread (EMERGENT-MCF-EI), with no filing risk. Useful as a foundation for systems that need to reason about identity, change, and emergence without baking object permanence into the metaphysics.',
    file: '/research/emergent-relational-ontology.md',
    fileLabel: 'Read the ontology (Markdown)',
    tags: ['ontology', 'systems-theory', 'philosophy', 'foundations'],
  },
  {
    slug: 'hysteretic-computing-ip',
    title: 'Hysteretic Computing',
    status: 'summary',
    summary:
      'A licensable hardware IP track distinct from the speedup IP: uses first-order phase transitions and bistable metastability to do computation in regimes that conventional second-order designs cannot reach. Pre-filing — the technical specifics, claim language, and parameter ranges are withheld here and available on request once filing is complete.',
    tags: ['ip', 'hardware', 'phase-transitions', 'pre-filing'],
  },
  {
    slug: 'multicomputational-phase-transitions',
    title: 'Multicomputational Phase Transitions in Quantum-Classical Hybrid Systems',
    status: 'summary',
    summary:
      'Theoretical framing of abrupt behavioral changes that emerge when quantum and classical computational resources are integrated, including measurement-induced entanglement transitions, noise-modified Kibble-Zurek scaling, and the regimes where classical simulability gives way to quantum dominance. Pre-filing — full text, derivations, and proposed device architectures are withheld here and available on request post-filing.',
    tags: ['quantum-classical', 'phase-transitions', 'pre-filing'],
  },
  {
    slug: 'operationalized-multicomputation',
    title: 'Operationalized Section 8: Multicomputation Branching',
    status: 'summary',
    summary:
      'Hardening supplement to the multicomputational phase-transitions work: reframes "multicomputation" away from Wolfram-style ontological hand-waving and into a rigorous operational definition grounded in the Feynman path integral and weak-value formalism — measurable ensembles of quantum trajectories under non-selective measurement. Pre-filing — full operational protocol available on request post-filing.',
    tags: ['quantum-foundations', 'path-integral', 'pre-filing'],
  },
]

export default research
