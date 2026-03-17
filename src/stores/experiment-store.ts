import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InterventionConfig, InterventionResult, InterventionMethod } from "@/types";

interface ExperimentStore {
  configs: InterventionConfig[];
  results: InterventionResult[];
  activeConfigId: string | null;
  isRunning: boolean;
  error: string | null;

  // Actions
  addConfig: (config: InterventionConfig) => void;
  updateConfig: (id: string, updates: Partial<InterventionConfig>) => void;
  deleteConfig: (id: string) => void;
  setActiveConfigId: (id: string | null) => void;
  addResult: (result: InterventionResult) => void;
  setIsRunning: (running: boolean) => void;
  setError: (error: string | null) => void;
  getResultsForConfig: (configId: string) => InterventionResult[];

  // Async action
  runExperiment: (config: {
    layer: number;
    featureIndex: number;
    coefficient: number;
    method: InterventionMethod;
    prompt: string;
  }) => Promise<InterventionResult | null>;
}

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set, get) => ({
      configs: [],
      results: [],
      activeConfigId: null,
      isRunning: false,
      error: null,

      addConfig: (config) =>
        set((state) => ({
          configs: [...state.configs, config],
        })),

      updateConfig: (id, updates) =>
        set((state) => ({
          configs: state.configs.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteConfig: (id) =>
        set((state) => ({
          configs: state.configs.filter((c) => c.id !== id),
          activeConfigId: state.activeConfigId === id ? null : state.activeConfigId,
        })),

      setActiveConfigId: (id) => set({ activeConfigId: id }),

      addResult: (result) =>
        set((state) => ({
          results: [...state.results, result],
        })),

      setIsRunning: (running) => set({ isRunning: running }),

      setError: (error) => set({ error }),

      getResultsForConfig: (configId) => {
        return get().results.filter((r) => r.configId === configId);
      },

      runExperiment: async (config) => {
        set({ isRunning: true, error: null });

        try {
          // Dynamic import to avoid SSR issues
          const { api, mapMethod } = await import("@/lib/api-client");

          const response = await api.interventions.run({
            layer: config.layer,
            featureIndex: config.featureIndex,
            coefficient: config.coefficient,
            method: config.method,
            prompt: config.prompt,
          });

          const result: InterventionResult = {
            id: `result-${Date.now()}`,
            configId: `config-${Date.now()}`,
            baselineTrace: "",
            steeredTrace: "",
            baselineOutput: response.baseline_text,
            steeredOutput: response.steered_text,
            accuracyDelta: 0,
            behaviorShifts: [
              {
                dimension: "Length",
                baseline: Number(response.metrics.baseline_length) || 0,
                steered: Number(response.metrics.steered_length) || 0,
                delta: Number(response.metrics.length_delta) || 0,
              },
            ],
            personaShifts: [],
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            results: [...state.results, result],
            isRunning: false,
          }));

          return result;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          set({ error: message, isRunning: false });
          return null;
        }
      },
    }),
    {
      name: "mechinterp-experiments",
    }
  )
);
