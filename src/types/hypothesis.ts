export type HypothesisStatus =
  | "draft"
  | "active"
  | "testing"
  | "supported"
  | "refuted"
  | "archived";

export type HypothesisPriority = "low" | "medium" | "high" | "critical";

export type ValidationMethod =
  | "activation_patching"
  | "causal_tracing"
  | "sae_steering"
  | "ablation"
  | "logit_lens"
  | "probing"
  | "direct_observation";

export interface EvidenceLink {
  id: string;
  type: "supports" | "contradicts" | "neutral";
  sourceId: string;
  description: string;
  strength: number; // 0-1
  timestamp: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  priority: HypothesisPriority;
  status: HypothesisStatus;
  targetComponent: string;
  targetLayer?: number;
  variable: string;
  predictedPersona?: string;
  validationMethod: ValidationMethod;
  evidenceLinks: EvidenceLink[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}
