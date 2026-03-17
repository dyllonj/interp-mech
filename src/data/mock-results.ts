import type { InterventionResult, InterventionConfig } from "@/types";

export interface ExperimentRun {
  id: string;
  config: InterventionConfig;
  result: InterventionResult;
  runNumber: number;
}

const baseConfigs: Omit<InterventionConfig, "id" | "name" | "description">[] = [
  { layer: 16, featureIndex: 30939, coefficient: 5, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: 10, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: 15, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: -5, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: -10, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: 10, method: "clamp", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 14, featureIndex: 30939, coefficient: 10, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 18, featureIndex: 30939, coefficient: 10, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 28150, coefficient: 10, method: "add", prompt: "Solve x^2 - 5x + 6 = 0." },
  { layer: 16, featureIndex: 28406, coefficient: 8, method: "add", prompt: "Using 25, 50, 75, 100, 3, 6, make 952." },
  { layer: 16, featureIndex: 30939, coefficient: 10, method: "add", prompt: "Find all primes less than 50." },
  { layer: 16, featureIndex: 30939, coefficient: 10, method: "add", prompt: "What is 127 * 38?" },
];

function generateAccuracy(coefficient: number, featureIndex: number, layer: number): number {
  const baseline = 0.271;
  if (featureIndex !== 30939) return baseline + (Math.random() - 0.5) * 0.1;
  if (layer !== 16) return baseline + coefficient * 0.008 + (Math.random() - 0.3) * 0.05;

  if (coefficient > 0) {
    // Sigmoid-like dose-response
    const maxBoost = 0.28;
    const response = maxBoost * (1 / (1 + Math.exp(-0.5 * (coefficient - 5))));
    return baseline + response + (Math.random() - 0.5) * 0.03;
  } else {
    return Math.max(0.02, baseline + coefficient * 0.025 + (Math.random() - 0.5) * 0.02);
  }
}

export const mockExperimentRuns: ExperimentRun[] = baseConfigs.map(
  (cfg, i) => {
    const accuracy = generateAccuracy(cfg.coefficient, cfg.featureIndex, cfg.layer);
    const timestamp = new Date(
      2025, 0, 15 + Math.floor(i / 3), 10 + i, 0, 0
    ).toISOString();

    return {
      id: `run-${i + 1}`,
      runNumber: i + 1,
      config: {
        ...cfg,
        id: `cfg-${i + 1}`,
        name: `F${cfg.featureIndex} L${cfg.layer} @${cfg.coefficient > 0 ? "+" : ""}${cfg.coefficient}`,
        description: `${cfg.method} steering of feature ${cfg.featureIndex} at layer ${cfg.layer} with coefficient ${cfg.coefficient}`,
      },
      result: {
        id: `result-${i + 1}`,
        configId: `cfg-${i + 1}`,
        baselineTrace: "trace-countdown-1",
        steeredTrace: "trace-countdown-steered",
        baselineOutput: "Baseline reasoning output...",
        steeredOutput: "Steered reasoning output...",
        accuracyDelta: accuracy - 0.271,
        behaviorShifts: [
          { dimension: "Enumeration", baseline: 0.3, steered: 0.3 + cfg.coefficient * 0.04, delta: cfg.coefficient * 0.04 },
          { dimension: "Backtracking", baseline: 0.4, steered: 0.4 - cfg.coefficient * 0.01, delta: -cfg.coefficient * 0.01 },
          { dimension: "Verification", baseline: 0.2, steered: 0.2 + cfg.coefficient * 0.02, delta: cfg.coefficient * 0.02 },
        ],
        personaShifts: [
          { personaId: "persona-analyst", baselineWeight: 0.35, steeredWeight: 0.35 + cfg.coefficient * 0.02 },
          { personaId: "persona-explorer", baselineWeight: 0.3, steeredWeight: 0.3 - cfg.coefficient * 0.01 },
        ],
        timestamp,
      },
    };
  }
);
