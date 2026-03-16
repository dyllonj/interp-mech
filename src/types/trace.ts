export type ConversationalBehavior =
  | "question-answering"
  | "perspective-shift"
  | "conflict"
  | "reconciliation"
  | "neutral";

export type BalesCategory =
  | "positive-socioemotional"
  | "task-attempted-answers"
  | "task-questions"
  | "negative-socioemotional";

export type BalesRole =
  | "shows-solidarity"
  | "shows-tension-release"
  | "agrees"
  | "gives-suggestion"
  | "gives-opinion"
  | "gives-orientation"
  | "asks-orientation"
  | "asks-opinion"
  | "asks-suggestion"
  | "disagrees"
  | "shows-tension"
  | "shows-antagonism";

export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PersonaProfile {
  id: string;
  name: string;
  description: string;
  bigFive: BigFiveScores;
  expertise: string[];
  communicationStyle: string;
  color: string;
}

export interface TraceSegment {
  id: string;
  text: string;
  behaviorType: ConversationalBehavior;
  balesRole: BalesRole;
  balesCategory: BalesCategory;
  personaAttribution: string;
  confidence: number; // 0-1
  layerActivations?: number[];
  startToken: number;
  endToken: number;
}

export interface ReasoningTrace {
  id: string;
  prompt: string;
  modelId: string;
  segments: TraceSegment[];
  personas: PersonaProfile[];
  behaviors: ConversationalBehavior[];
  totalTokens: number;
  timestamp: string;
}
