import { create } from "zustand";
import type { ReasoningTrace, TraceSegment } from "@/types";

interface TraceStore {
  traces: ReasoningTrace[];
  activeTraceId: string | null;
  selectedSegmentId: string | null;
  highlightedPersona: string | null;
  highlightedBehavior: string | null;

  // Actions
  setTraces: (traces: ReasoningTrace[]) => void;
  addTrace: (trace: ReasoningTrace) => void;
  setActiveTraceId: (id: string | null) => void;
  setSelectedSegmentId: (id: string | null) => void;
  setHighlightedPersona: (personaId: string | null) => void;
  setHighlightedBehavior: (behavior: string | null) => void;
  getActiveTrace: () => ReasoningTrace | undefined;
  getActiveSegment: () => TraceSegment | undefined;
}

export const useTraceStore = create<TraceStore>()((set, get) => ({
  traces: [],
  activeTraceId: null,
  selectedSegmentId: null,
  highlightedPersona: null,
  highlightedBehavior: null,

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
}));
