/**
 * API client for MechInterp Lab backend.
 * Typed fetch wrapper with camelCase/snake_case conversion.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new ApiError(res.status, res.statusText, errorBody);
  }
  return res.json();
}

function GET<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  return request<T>("GET", path, undefined, params);
}

function POST<T>(path: string, body?: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

// --- Response types (matching backend snake_case) ---

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ModelStatus {
  state: "idle" | "loading" | "ready" | "error";
  model_name: string | null;
  memory_usage_mb: number;
  device: string;
  available_models: string[];
}

export interface FeatureSummary {
  index: number;
  label: string;
  category: string;
  max_activation: number;
  mean_activation: number;
}

export interface FeaturePage {
  features: FeatureSummary[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface FeatureDetail {
  index: number;
  label: string;
  category: string;
  description: string;
  max_activation: number;
  mean_activation: number;
  top_tokens: Array<{ token: string; activation: number }>;
  activation_histogram: number[];
}

export interface SteeringConfig {
  layer: number;
  feature_index: number;
  coefficient: number;
  method: string;
  prompt: string;
  max_new_tokens: number;
}

export interface InterventionResponse {
  baseline_text: string;
  steered_text: string;
  config: SteeringConfig;
  metrics: Record<string, unknown>;
}

export interface TraceSegment {
  text: string;
  behavior: string;
}

export interface TraceAnalysis {
  segments: TraceSegment[];
  raw_text: string;
}

export interface PersonaScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Persona {
  name: string;
  scores: PersonaScores;
  segment_indices: number[];
}

export interface PersonaAnalysis {
  personas: Persona[];
  segment_scores: PersonaScores[];
}

export interface BalesCategoryInfo {
  id: number;
  name: string;
  macro: string;
}

export interface BalesClassification {
  category: BalesCategoryInfo;
  confidence: number;
}

export interface BalesAggregation {
  positive_reactions: number;
  attempted_answers: number;
  questions: number;
  negative_reactions: number;
  total: number;
  classifications: BalesClassification[];
}

export interface AnalyzeResponse {
  trace: TraceAnalysis;
  personas: PersonaAnalysis;
  bales: BalesAggregation;
}

// --- Method mapping (frontend enum → backend string) ---

const METHOD_MAP: Record<string, string> = {
  add: "activation_addition",
  clamp: "feature_clamping",
  ablate: "ablation",
  scale: "activation_addition", // scale maps to addition with different coefficient
  patch: "activation_addition", // patch not yet distinct on backend
};

export function mapMethod(frontendMethod: string): string {
  return METHOD_MAP[frontendMethod] ?? frontendMethod;
}

// --- API client ---

export const api = {
  health: () => GET<HealthResponse>("/api/health"),

  models: {
    status: () => GET<ModelStatus>("/api/models/status"),
    load: (modelName: string) =>
      POST<ModelStatus>("/api/models/load", { model_name: modelName }),
  },

  sae: {
    features: (params?: {
      search?: string;
      category?: string;
      page?: number;
      limit?: number;
    }) =>
      GET<FeaturePage>("/api/sae/features", params as Record<string, string | number | undefined>),
    feature: (index: number) => GET<FeatureDetail>(`/api/sae/features/${index}`),
  },

  interventions: {
    run: (config: {
      layer: number;
      featureIndex: number;
      coefficient: number;
      method: string;
      prompt: string;
      maxNewTokens?: number;
    }) =>
      POST<InterventionResponse>("/api/interventions/run", {
        layer: config.layer,
        feature_index: config.featureIndex,
        coefficient: config.coefficient,
        method: mapMethod(config.method),
        prompt: config.prompt,
        max_new_tokens: config.maxNewTokens ?? 512,
      }),
  },

  traces: {
    analyze: (text: string) =>
      POST<AnalyzeResponse>("/api/traces/analyze", { text }),
  },
};

// --- SSE helpers ---

export function subscribeModelStatus(
  onEvent: (data: { state: string; model_name: string | null; memory_usage_mb: number; device: string }) => void,
  onDone?: () => void
): () => void {
  const es = new EventSource(`${API_BASE}/api/events/model-status`);

  es.addEventListener("model_status", (e) => {
    onEvent(JSON.parse(e.data));
  });

  es.addEventListener("done", () => {
    es.close();
    onDone?.();
  });

  es.onerror = () => {
    es.close();
  };

  return () => es.close();
}

export function subscribeExperimentProgress(
  onProgress: (data: { prompt: number; total: number; stage: string }) => void,
  onComplete?: (data: { result_id: string }) => void
): () => void {
  const es = new EventSource(`${API_BASE}/api/events/experiment-progress`);

  es.addEventListener("experiment_progress", (e) => {
    onProgress(JSON.parse(e.data));
  });

  es.addEventListener("experiment_complete", (e) => {
    es.close();
    onComplete?.(JSON.parse(e.data));
  });

  es.onerror = () => {
    es.close();
  };

  return () => es.close();
}

export default api;
