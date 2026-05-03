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
    status: 'summary',
    summary:
      'An in-progress relational ontology framework — a companion piece to the EMERGENT-MCF-EI consciousness modeling thread. Treats entities as stable patterns within a substrate of relations rather than as primitives with relations attached. Currently in revision; not yet ready for public release.',
    tags: ['ontology', 'systems-theory', 'foundations', 'in-revision'],
  },
  {
    slug: 'hysteretic-computing-ip',
    title: 'Hysteretic Computing',
    status: 'summary',
    summary:
      'A licensable hardware IP track separate from the speedup IP, aimed at hardware manufacturers. Pre-filing — technical specifics, claim language, and parameter ranges are withheld here and available on request once filing is complete.',
    tags: ['ip', 'hardware', 'pre-filing'],
  },
  {
    slug: 'multicomputational-phase-transitions',
    title: 'Multicomputational Phase Transitions in Quantum-Classical Hybrid Systems',
    status: 'summary',
    summary:
      'Theoretical framing of abrupt behavioral changes that emerge when quantum and classical computational resources are integrated, and the regimes where classical simulability gives way to quantum dominance. Pre-filing — full text, derivations, and proposed device architectures are withheld here and available on request post-filing.',
    tags: ['quantum-classical', 'pre-filing'],
  },
  {
    slug: 'operationalized-multicomputation',
    title: 'Operationalized Section 8: Multicomputation Branching',
    status: 'summary',
    summary:
      'Hardening supplement to the multicomputational phase-transitions work: reframes "multicomputation" away from speculative metaphysics and into a rigorous, measurable operational definition. Pre-filing — full operational protocol available on request post-filing.',
    tags: ['quantum-foundations', 'pre-filing'],
  },
]

export default research
