import type { EvidenceLink } from "@/types";

export interface PaperFinding {
  id: string;
  title: string;
  summary: string;
  category: "steering" | "persona" | "behavior" | "architecture" | "training";
  keyMetrics?: Record<string, string | number>;
  section: string;
  evidenceStrength: number;
}

export const paperFindings: PaperFinding[] = [
  {
    id: "finding-001",
    title: "Feature 30939 doubles Countdown accuracy under steering",
    summary:
      "Steering SAE Feature 30939 at coefficient +10 in DeepSeek-R1-Distill-Qwen-7B increases Countdown task accuracy from 27.1% to 54.8%, demonstrating that individual SAE features can causally influence multi-step reasoning.",
    category: "steering",
    keyMetrics: {
      baseline_accuracy: "27.1%",
      steered_accuracy: "54.8%",
      coefficient: "+10",
      feature_index: 30939,
    },
    section: "4.2",
    evidenceStrength: 0.95,
  },
  {
    id: "finding-002",
    title: "Four distinct conversational behaviors in CoT traces",
    summary:
      "Chain-of-thought traces exhibit four recurring conversational behavior types: question-answering, perspective-shift, conflict, and reconciliation, analogous to multi-party dialogue patterns.",
    category: "behavior",
    keyMetrics: { behavior_count: 4 },
    section: "3.1",
    evidenceStrength: 0.88,
  },
  {
    id: "finding-003",
    title: "Big Five personality diversity across reasoning personas",
    summary:
      "Different reasoning personas within a single model's CoT exhibit measurably distinct Big Five personality profiles, suggesting genuine functional specialization rather than superficial stylistic variation.",
    category: "persona",
    section: "3.3",
    evidenceStrength: 0.82,
  },
  {
    id: "finding-004",
    title: "PPO training amplifies persona differentiation",
    summary:
      "Post-training with PPO/RLHF increases the divergence between persona profiles compared to pre-training baselines, indicating that reinforcement learning sharpens functional role specialization.",
    category: "training",
    keyMetrics: { divergence_increase: "~40%" },
    section: "5.1",
    evidenceStrength: 0.78,
  },
  {
    id: "finding-005",
    title: "Bales IPA framework captures CoT interaction dynamics",
    summary:
      "Applying Bales' Interaction Process Analysis (12 categories, 4 domains) to CoT segments reveals structured socioemotional and task-oriented patterns consistent with functional group decision-making.",
    category: "behavior",
    section: "3.2",
    evidenceStrength: 0.85,
  },
  {
    id: "finding-006",
    title: "Negative steering suppresses systematic reasoning",
    summary:
      "Steering Feature 30939 at coefficient -10 reduces Countdown accuracy to near-zero and produces disorganized, non-systematic CoT traces.",
    category: "steering",
    keyMetrics: {
      coefficient: "-10",
      steered_accuracy: "~2%",
    },
    section: "4.2",
    evidenceStrength: 0.92,
  },
  {
    id: "finding-007",
    title: "Feature 30939 is associated with systematic enumeration",
    summary:
      "Top-activating tokens for Feature 30939 correspond to systematic enumeration patterns (listing, numbering, exploring combinations), suggesting it encodes a 'methodical search' behavior.",
    category: "architecture",
    keyMetrics: { top_token_examples: "1), 2), let me try, combinations" },
    section: "4.1",
    evidenceStrength: 0.9,
  },
  {
    id: "finding-008",
    title: "Layer 16 concentrations for reasoning features",
    summary:
      "SAE features most predictive of reasoning quality cluster in layers 14-18 of the 32-layer model, with layer 16 showing the highest density of causally important features.",
    category: "architecture",
    keyMetrics: { peak_layer: 16, layer_range: "14-18" },
    section: "4.1",
    evidenceStrength: 0.75,
  },
  {
    id: "finding-009",
    title: "Perspective-shift segments predict answer quality",
    summary:
      "Traces with more perspective-shift segments (re-examining from a different angle) correlate with higher final answer accuracy across both Countdown and MATH benchmarks.",
    category: "behavior",
    keyMetrics: { correlation_r: 0.62 },
    section: "3.4",
    evidenceStrength: 0.8,
  },
  {
    id: "finding-010",
    title: "Conflict segments serve error-correction function",
    summary:
      "Segments classified as 'conflict' behavior (self-contradiction, backtracking) frequently precede correction of reasoning errors, suggesting a built-in error-detection mechanism.",
    category: "behavior",
    section: "3.4",
    evidenceStrength: 0.77,
  },
  {
    id: "finding-011",
    title: "Reconciliation segments consolidate partial solutions",
    summary:
      "Reconciliation behavior types aggregate partial results from earlier segments into unified conclusions, functioning as a synthesis mechanism within the CoT.",
    category: "behavior",
    section: "3.4",
    evidenceStrength: 0.74,
  },
  {
    id: "finding-012",
    title: "Persona emergence is layer-dependent",
    summary:
      "Different personas activate most strongly at different layers: analytical personas peak in mid layers (12-18), while stylistic/emotional personas activate earlier (layers 4-10).",
    category: "persona",
    keyMetrics: { analytical_peak: "12-18", stylistic_peak: "4-10" },
    section: "5.2",
    evidenceStrength: 0.72,
  },
  {
    id: "finding-013",
    title: "Steering coefficient shows dose-response relationship",
    summary:
      "Accuracy improvement follows a sigmoid-like dose-response curve with steering coefficient, saturating around +15 and showing diminishing returns beyond +10.",
    category: "steering",
    keyMetrics: { optimal_coefficient: "+10", saturation_point: "+15" },
    section: "4.3",
    evidenceStrength: 0.88,
  },
  {
    id: "finding-014",
    title: "Multi-feature steering outperforms single-feature",
    summary:
      "Combining Feature 30939 with complementary features (e.g., verification, backtracking) at moderate coefficients yields higher accuracy than aggressive single-feature steering.",
    category: "steering",
    section: "4.4",
    evidenceStrength: 0.7,
  },
  {
    id: "finding-015",
    title: "SAE reconstruction preserves reasoning capability",
    summary:
      "Replacing MLP outputs with SAE reconstructions at key layers maintains >95% of baseline reasoning accuracy, validating that the learned features capture functionally relevant information.",
    category: "architecture",
    keyMetrics: { accuracy_retention: ">95%" },
    section: "4.1",
    evidenceStrength: 0.85,
  },
  {
    id: "finding-016",
    title: "Persona consistency across problem types",
    summary:
      "The same persona profiles appear across different task types (arithmetic, algebra, word problems), indicating they represent general reasoning strategies rather than task-specific heuristics.",
    category: "persona",
    section: "3.5",
    evidenceStrength: 0.79,
  },
  {
    id: "finding-017",
    title: "Extraversion correlates with exploration breadth",
    summary:
      "Personas scoring high on Big Five Extraversion explore more solution branches before converging, while introverted personas pursue depth-first strategies.",
    category: "persona",
    keyMetrics: { correlation_r: 0.58 },
    section: "3.3",
    evidenceStrength: 0.68,
  },
  {
    id: "finding-018",
    title: "Conscientiousness predicts verification behavior",
    summary:
      "Personas with high Conscientiousness scores are more likely to include verification steps (re-checking arithmetic, validating constraints) in their reasoning segments.",
    category: "persona",
    section: "3.3",
    evidenceStrength: 0.71,
  },
  {
    id: "finding-019",
    title: "Attention head specialization for persona switching",
    summary:
      "Specific attention heads in layers 14-16 show increased activation during transitions between persona-attributed segments, suggesting a mechanism for persona switching.",
    category: "architecture",
    keyMetrics: { key_layers: "14-16" },
    section: "5.3",
    evidenceStrength: 0.65,
  },
  {
    id: "finding-020",
    title: "Residual stream geometry reflects persona clustering",
    summary:
      "PCA of residual stream activations at layer 16 reveals clusters that correspond to identified persona profiles, providing geometric evidence for persona representation.",
    category: "architecture",
    section: "5.2",
    evidenceStrength: 0.73,
  },
];

export const paperEvidenceLinks: EvidenceLink[] = paperFindings.map((f) => ({
  id: `evidence-${f.id}`,
  type: "supports" as const,
  sourceId: f.id,
  description: f.title,
  strength: f.evidenceStrength,
  timestamp: "2025-01-18T00:00:00Z",
}));
