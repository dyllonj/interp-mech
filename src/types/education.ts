export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface PaperReference {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  url?: string;
}

export interface ConceptDefinition {
  id: string;
  term: string;
  shortExplanation: string;
  fullExplanation: string;
  difficulty: DifficultyLevel;
  paperReference?: PaperReference;
  relatedConcepts: string[];
  category: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  conceptIds: string[];
  order: number;
  interactive?: boolean;
  codeExample?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  steps: TutorialStep[];
  estimatedMinutes: number;
  prerequisites: string[];
}

export interface LearningProgress {
  conceptId: string;
  mastered: boolean;
  lastReviewed: string;
  reviewCount: number;
}
