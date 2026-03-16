export type FeatureCategory =
  | "persona"
  | "reasoning"
  | "factual"
  | "stylistic"
  | "emotional"
  | "structural"
  | "unknown";

export type InterventionMethod =
  | "clamp"
  | "add"
  | "scale"
  | "ablate"
  | "patch";

export interface ActivationStats {
  mean: number;
  std: number;
  max: number;
  sparsity: number;
  frequency: number;
}

export interface SAEFeature {
  index: number;
  label: string;
  description: string;
  category: FeatureCategory;
  activationStats: ActivationStats;
  topTokens: Array<{ token: string; activation: number }>;
  topContexts: Array<{ text: string; activation: number }>;
  layer: number;
  correlatedFeatures: number[];
}

export interface InterventionConfig {
  id: string;
  name: string;
  layer: number;
  featureIndex: number;
  coefficient: number;
  method: InterventionMethod;
  prompt: string;
  description: string;
}

export interface BehaviorShift {
  dimension: string;
  baseline: number;
  steered: number;
  delta: number;
}

export interface InterventionResult {
  id: string;
  configId: string;
  baselineTrace: string;
  steeredTrace: string;
  baselineOutput: string;
  steeredOutput: string;
  accuracyDelta: number;
  behaviorShifts: BehaviorShift[];
  personaShifts: Array<{
    personaId: string;
    baselineWeight: number;
    steeredWeight: number;
  }>;
  timestamp: string;
}
