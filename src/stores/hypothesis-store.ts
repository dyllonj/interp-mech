import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Hypothesis, HypothesisStatus, EvidenceLink } from "@/types";

interface HypothesisStore {
  hypotheses: Hypothesis[];
  selectedId: string | null;
  filterStatus: HypothesisStatus | "all";
  searchQuery: string;

  // Actions
  addHypothesis: (hypothesis: Hypothesis) => void;
  updateHypothesis: (id: string, updates: Partial<Hypothesis>) => void;
  deleteHypothesis: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  setFilterStatus: (status: HypothesisStatus | "all") => void;
  setSearchQuery: (query: string) => void;
  addEvidenceLink: (hypothesisId: string, link: EvidenceLink) => void;
  removeEvidenceLink: (hypothesisId: string, linkId: string) => void;
  getFilteredHypotheses: () => Hypothesis[];
}

export const useHypothesisStore = create<HypothesisStore>()(
  persist(
    (set, get) => ({
      hypotheses: [],
      selectedId: null,
      filterStatus: "all",
      searchQuery: "",

      addHypothesis: (hypothesis) =>
        set((state) => ({
          hypotheses: [...state.hypotheses, hypothesis],
        })),

      updateHypothesis: (id, updates) =>
        set((state) => ({
          hypotheses: state.hypotheses.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
          ),
        })),

      deleteHypothesis: (id) =>
        set((state) => ({
          hypotheses: state.hypotheses.filter((h) => h.id !== id),
          selectedId: state.selectedId === id ? null : state.selectedId,
        })),

      setSelectedId: (id) => set({ selectedId: id }),

      setFilterStatus: (status) => set({ filterStatus: status }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addEvidenceLink: (hypothesisId, link) =>
        set((state) => ({
          hypotheses: state.hypotheses.map((h) =>
            h.id === hypothesisId
              ? { ...h, evidenceLinks: [...h.evidenceLinks, link] }
              : h
          ),
        })),

      removeEvidenceLink: (hypothesisId, linkId) =>
        set((state) => ({
          hypotheses: state.hypotheses.map((h) =>
            h.id === hypothesisId
              ? {
                  ...h,
                  evidenceLinks: h.evidenceLinks.filter((l) => l.id !== linkId),
                }
              : h
          ),
        })),

      getFilteredHypotheses: () => {
        const { hypotheses, filterStatus, searchQuery } = get();
        return hypotheses.filter((h) => {
          if (filterStatus !== "all" && h.status !== filterStatus) return false;
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
              h.title.toLowerCase().includes(q) ||
              h.description.toLowerCase().includes(q) ||
              h.tags.some((t) => t.toLowerCase().includes(q))
            );
          }
          return true;
        });
      },
    }),
    {
      name: "mechinterp-hypotheses",
    }
  )
);
