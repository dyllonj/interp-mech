import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LearningProgress, DifficultyLevel } from "@/types";

interface LearningStore {
  progress: LearningProgress[];
  viewedConcepts: string[];
  completedTutorials: string[];
  activeTutorialId: string | null;
  activeTutorialStep: number;
  learningModeEnabled: boolean;
  difficultyFilter: DifficultyLevel | "all";

  // Actions
  markConceptViewed: (conceptId: string) => void;
  markConceptMastered: (conceptId: string) => void;
  setActiveTutorial: (id: string | null) => void;
  setActiveTutorialStep: (step: number) => void;
  completeTutorial: (id: string) => void;
  toggleLearningMode: () => void;
  setDifficultyFilter: (level: DifficultyLevel | "all") => void;
  isConceptViewed: (conceptId: string) => boolean;
  isConceptMastered: (conceptId: string) => boolean;
  isTutorialCompleted: (id: string) => boolean;
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      progress: [],
      viewedConcepts: [],
      completedTutorials: [],
      activeTutorialId: null,
      activeTutorialStep: 0,
      learningModeEnabled: true,
      difficultyFilter: "all",

      markConceptViewed: (conceptId) =>
        set((state) => {
          if (state.viewedConcepts.includes(conceptId)) return state;
          const existing = state.progress.find((p) => p.conceptId === conceptId);
          const newProgress = existing
            ? state.progress.map((p) =>
                p.conceptId === conceptId
                  ? {
                      ...p,
                      lastReviewed: new Date().toISOString(),
                      reviewCount: p.reviewCount + 1,
                    }
                  : p
              )
            : [
                ...state.progress,
                {
                  conceptId,
                  mastered: false,
                  lastReviewed: new Date().toISOString(),
                  reviewCount: 1,
                },
              ];
          return {
            viewedConcepts: [...state.viewedConcepts, conceptId],
            progress: newProgress,
          };
        }),

      markConceptMastered: (conceptId) =>
        set((state) => ({
          progress: state.progress.map((p) =>
            p.conceptId === conceptId ? { ...p, mastered: true } : p
          ),
        })),

      setActiveTutorial: (id) =>
        set({ activeTutorialId: id, activeTutorialStep: 0 }),

      setActiveTutorialStep: (step) => set({ activeTutorialStep: step }),

      completeTutorial: (id) =>
        set((state) => ({
          completedTutorials: state.completedTutorials.includes(id)
            ? state.completedTutorials
            : [...state.completedTutorials, id],
          activeTutorialId: null,
          activeTutorialStep: 0,
        })),

      toggleLearningMode: () =>
        set((state) => ({ learningModeEnabled: !state.learningModeEnabled })),

      setDifficultyFilter: (level) => set({ difficultyFilter: level }),

      isConceptViewed: (conceptId) => get().viewedConcepts.includes(conceptId),

      isConceptMastered: (conceptId) =>
        get().progress.find((p) => p.conceptId === conceptId)?.mastered ?? false,

      isTutorialCompleted: (id) => get().completedTutorials.includes(id),
    }),
    {
      name: "mechinterp-learning",
    }
  )
);
