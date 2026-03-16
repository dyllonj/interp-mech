import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InterventionConfig, InterventionResult } from "@/types";

interface ExperimentStore {
  configs: InterventionConfig[];
  results: InterventionResult[];
  activeConfigId: string | null;
  isRunning: boolean;

  // Actions
  addConfig: (config: InterventionConfig) => void;
  updateConfig: (id: string, updates: Partial<InterventionConfig>) => void;
  deleteConfig: (id: string) => void;
  setActiveConfigId: (id: string | null) => void;
  addResult: (result: InterventionResult) => void;
  setIsRunning: (running: boolean) => void;
  getResultsForConfig: (configId: string) => InterventionResult[];
}

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set, get) => ({
      configs: [],
      results: [],
      activeConfigId: null,
      isRunning: false,

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

      getResultsForConfig: (configId) => {
        return get().results.filter((r) => r.configId === configId);
      },
    }),
    {
      name: "mechinterp-experiments",
    }
  )
);
