import { create } from "zustand";
import type { ReasoningTrace, TraceSegment } from "@/types";

interface TraceStore {
  traces: ReasoningTrace[];
  activeTraceId: string | null;
  selectedSegmentId: string | null;
  highlightedPersona: string | null;
  highlightedBehavior: string | null;
  isAnalyzing: boolean;
  analyzeError: string | null;

  // Actions
  setTraces: (traces: ReasoningTrace[]) => void;
  addTrace: (trace: ReasoningTrace) => void;
  setActiveTraceId: (id: string | null) => void;
  setSelectedSegmentId: (id: string | null) => void;
  setHighlightedPersona: (personaId: string | null) => void;
  setHighlightedBehavior: (behavior: string | null) => void;
  getActiveTrace: () => ReasoningTrace | undefined;
  getActiveSegment: () => TraceSegment | undefined;

  // Async action
  analyzeText: (text: string) => Promise<ReasoningTrace | null>;
}

export const useTraceStore = create<TraceStore>()((set, get) => ({
  traces: [],
  activeTraceId: null,
  selectedSegmentId: null,
  highlightedPersona: null,
  highlightedBehavior: null,
  isAnalyzing: false,
  analyzeError: null,

  setTraces: (traces) => set({ traces }),

  addTrace: (trace) =>
    set((state) => ({
      traces: [...state.traces, trace],
    })),

  setActiveTraceId: (id) =>
    set({ activeTraceId: id, selectedSegmentId: null }),

  setSelectedSegmentId: (id) => set({ selectedSegmentId: id }),

  setHighlightedPersona: (personaId) =>
    set({ highlightedPersona: personaId }),

  setHighlightedBehavior: (behavior) =>
    set({ highlightedBehavior: behavior }),

  getActiveTrace: () => {
    const { traces, activeTraceId } = get();
    return traces.find((t) => t.id === activeTraceId);
  },

  getActiveSegment: () => {
    const trace = get().getActiveTrace();
    const { selectedSegmentId } = get();
    if (!trace || !selectedSegmentId) return undefined;
    return trace.segments.find((s) => s.id === selectedSegmentId);
  },

  analyzeText: async (text: string) => {
    set({ isAnalyzing: true, analyzeError: null });

    try {
      const { api } = await import("@/lib/api-client");
      const response = await api.traces.analyze(text);

      const macroToCategory = (macro: string): string => {
        const map: Record<string, string> = {
          "Positive reactions": "positive-socioemotional",
          "Attempted answers": "task-attempted-answers",
          "Questions": "task-questions",
          "Negative reactions": "negative-socioemotional",
        };
        return map[macro] ?? "task-attempted-answers";
      };
      const nameToRole = (name: string): string =>
        name.toLowerCase().replace(/\s+/g, "-").replace(/for-/g, "");

      const now = Date.now();
      const newTrace: ReasoningTrace = {
        id: `trace-live-${now}`,
        prompt: text.slice(0, 80) + (text.length > 80 ? "..." : ""),
        modelId: "live-analysis",
        segments: response.trace.segments.map((seg, i) => {
          const bales = response.bales.classifications[i];
          return {
            id: `seg-live-${now}-${i}`,
            text: seg.text,
            behaviorType: seg.behavior as TraceSegment["behaviorType"],
            balesRole: (bales ? nameToRole(bales.category.name) : "gives-orientation") as TraceSegment["balesRole"],
            balesCategory: (bales ? macroToCategory(bales.category.macro) : "task-attempted-answers") as TraceSegment["balesCategory"],
            personaAttribution: "",
            confidence: bales?.confidence ?? 0.3,
            startToken: 0,
            endToken: seg.text.length,
          };
        }),
        personas: response.personas.personas.map((p, i) => ({
          id: `persona-live-${i}`,
          name: p.name,
          description: `Dominant traits: ${Object.entries(p.scores)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 3)
            .map(([k]) => k)
            .join(", ")}`,
          bigFive: {
            openness: p.scores.openness,
            conscientiousness: p.scores.conscientiousness,
            extraversion: p.scores.extraversion,
            agreeableness: p.scores.agreeableness,
            neuroticism: p.scores.neuroticism,
          },
          expertise: Object.entries(p.scores)
            .filter(([, v]) => (v as number) > 0.3)
            .map(([k]) => k),
          communicationStyle: Object.entries(p.scores)
            .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] ?? "analytical",
          color: ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e"][i % 5],
        })),
        behaviors: [
          ...new Set(
            response.trace.segments
              .map((s) => s.behavior)
              .filter((b) => b !== "neutral")
          ),
        ] as ReasoningTrace["behaviors"],
        totalTokens: text.split(/\s+/).length,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        traces: [...state.traces, newTrace],
        activeTraceId: newTrace.id,
        isAnalyzing: false,
      }));

      return newTrace;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze trace";
      set({ analyzeError: message, isAnalyzing: false });
      return null;
    }
  },
}));
