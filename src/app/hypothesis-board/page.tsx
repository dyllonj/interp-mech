"use client";

import { useEffect } from "react";
import { HypothesisTable } from "@/components/hypothesis-board/hypothesis-table";
import { PaperEvidenceFeed } from "@/components/hypothesis-board/paper-evidence-feed";
import { ResearchFramework } from "@/components/hypothesis-board/research-framework";
import { useHypothesisStore } from "@/stores";
import type { Hypothesis } from "@/types";

const seedHypotheses: Hypothesis[] = [
  {
    id: "hyp-seed-1",
    title: "Feature 30939 encodes systematic enumeration behavior",
    description:
      "SAE Feature 30939 at layer 16 causally controls systematic enumeration patterns in CoT. Steering at +10 should increase methodical list-making and numbered exploration.",
    priority: "critical",
    status: "supported",
    targetComponent: "MLP Layer 16",
    targetLayer: 16,
    variable: "Enumeration frequency",
    predictedPersona: "The Analyst",
    validationMethod: "sae_steering",
    evidenceLinks: [
      {
        id: "ev-1",
        type: "supports",
        sourceId: "finding-001",
        description: "Steering at +10 doubles accuracy 27.1% -> 54.8%",
        strength: 0.95,
        timestamp: "2025-01-18T00:00:00Z",
      },
      {
        id: "ev-7",
        type: "supports",
        sourceId: "finding-007",
        description:
          "Top tokens correspond to systematic enumeration patterns",
        strength: 0.9,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes: "Key finding from Section 4.2 of the paper.",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-18T10:00:00Z",
    tags: ["sae", "feature-30939", "reasoning", "steering"],
  },
  {
    id: "hyp-seed-2",
    title: "Perspective-shift segments causally improve answer quality",
    description:
      "Traces with more perspective-shift behavior (re-examining from different angles) produce higher accuracy. This may be mediated by specific attention heads in layers 14-16.",
    priority: "high",
    status: "active",
    targetComponent: "Attention Heads L14-L16",
    targetLayer: 15,
    variable: "Perspective-shift frequency",
    predictedPersona: "The Explorer",
    validationMethod: "activation_patching",
    evidenceLinks: [
      {
        id: "ev-9",
        type: "supports",
        sourceId: "finding-009",
        description: "Correlation r=0.62 between perspective-shifts and accuracy",
        strength: 0.8,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes:
      "Need causal evidence — correlation alone is insufficient. Consider patching attention heads during perspective-shift segments.",
    createdAt: "2025-01-18T11:00:00Z",
    updatedAt: "2025-01-18T11:00:00Z",
    tags: ["attention", "behavior", "perspective-shift"],
  },
  {
    id: "hyp-seed-3",
    title: "PPO amplifies persona differentiation via reward shaping",
    description:
      "PPO/RLHF training increases Big Five divergence between personas by ~40%. The reward signal may selectively reinforce persona specialization because diverse reasoning strategies improve task accuracy.",
    priority: "high",
    status: "testing",
    targetComponent: "Full model (pre vs post PPO)",
    variable: "Big Five divergence score",
    predictedPersona: undefined,
    validationMethod: "direct_observation",
    evidenceLinks: [
      {
        id: "ev-4",
        type: "supports",
        sourceId: "finding-004",
        description: "PPO increases persona divergence by ~40%",
        strength: 0.78,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes: "Compare pre-PPO and post-PPO model checkpoints if available.",
    createdAt: "2025-01-18T12:00:00Z",
    updatedAt: "2025-01-18T12:00:00Z",
    tags: ["ppo", "rlhf", "persona", "training"],
  },
  {
    id: "hyp-seed-4",
    title: "Conflict segments serve as error-correction circuits",
    description:
      "Self-contradiction (conflict behavior) segments precede error corrections. Specific MLP features in layers 15-17 may encode error-detection signals that trigger backtracking.",
    priority: "medium",
    status: "active",
    targetComponent: "MLP Layers 15-17",
    targetLayer: 16,
    variable: "Error correction rate",
    predictedPersona: "The Critic",
    validationMethod: "causal_tracing",
    evidenceLinks: [
      {
        id: "ev-10",
        type: "supports",
        sourceId: "finding-010",
        description: "Conflict segments frequently precede error corrections",
        strength: 0.77,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes: "",
    createdAt: "2025-01-18T13:00:00Z",
    updatedAt: "2025-01-18T13:00:00Z",
    tags: ["conflict", "error-correction", "causal"],
  },
  {
    id: "hyp-seed-5",
    title: "Negative steering of Feature 30939 disrupts all reasoning",
    description:
      "Steering Feature 30939 at -10 doesn't just reduce enumeration — it collapses all systematic reasoning, suggesting this feature is upstream of multiple reasoning strategies.",
    priority: "medium",
    status: "supported",
    targetComponent: "MLP Layer 16",
    targetLayer: 16,
    variable: "Overall reasoning coherence",
    predictedPersona: undefined,
    validationMethod: "sae_steering",
    evidenceLinks: [
      {
        id: "ev-6",
        type: "supports",
        sourceId: "finding-006",
        description: "Negative steering reduces accuracy to near-zero",
        strength: 0.92,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes: "Suggests Feature 30939 is not just 'enumeration' but a broader reasoning enabler.",
    createdAt: "2025-01-18T14:00:00Z",
    updatedAt: "2025-01-18T14:00:00Z",
    tags: ["sae", "feature-30939", "steering", "negative"],
  },
  {
    id: "hyp-seed-6",
    title: "Reconciliation behavior consolidates partial solutions",
    description:
      "Reconciliation segments aggregate partial results from earlier reasoning, acting as a synthesis mechanism. This may be implemented by late-layer attention heads that attend broadly to previous reasoning segments.",
    priority: "low",
    status: "draft",
    targetComponent: "Attention Heads L18-L24",
    targetLayer: 20,
    variable: "Synthesis completeness",
    predictedPersona: "The Synthesizer",
    validationMethod: "activation_patching",
    evidenceLinks: [
      {
        id: "ev-11",
        type: "supports",
        sourceId: "finding-011",
        description: "Reconciliation segments aggregate partial results",
        strength: 0.74,
        timestamp: "2025-01-18T00:00:00Z",
      },
    ],
    notes: "",
    createdAt: "2025-01-18T15:00:00Z",
    updatedAt: "2025-01-18T15:00:00Z",
    tags: ["reconciliation", "synthesis", "attention"],
  },
];

export default function HypothesisBoardPage() {
  const hypotheses = useHypothesisStore((s) => s.hypotheses);
  const addHypothesis = useHypothesisStore((s) => s.addHypothesis);

  // Seed with initial hypotheses if the store is empty
  useEffect(() => {
    if (hypotheses.length === 0) {
      seedHypotheses.forEach(addHypothesis);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full">
      {/* Left: Research Framework */}
      <div className="w-[220px] shrink-0 border-r border-border/50 bg-card/30">
        <ResearchFramework />
      </div>

      {/* Center: Hypothesis Table */}
      <div className="flex-1 overflow-hidden">
        <HypothesisTable />
      </div>

      {/* Right: Paper Evidence */}
      <div className="w-[320px] shrink-0 border-l border-border/50 bg-card/30">
        <PaperEvidenceFeed />
      </div>
    </div>
  );
}
