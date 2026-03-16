import type { SAEFeature } from "@/types";

// Feature 30939 — the star feature from the paper
export const feature30939: SAEFeature = {
  index: 30939,
  label: "Systematic Enumeration / Methodical Search",
  description:
    "Activates strongly during systematic enumeration patterns — listing options, numbering attempts, and exploring combinations methodically. Causal steering at +10 doubles Countdown task accuracy from 27.1% to 54.8%.",
  category: "reasoning",
  activationStats: {
    mean: 0.34,
    std: 0.28,
    max: 4.72,
    sparsity: 0.92,
    frequency: 0.08,
  },
  topTokens: [
    { token: "1)", activation: 4.72 },
    { token: "2)", activation: 4.51 },
    { token: "let me try", activation: 4.38 },
    { token: "combinations", activation: 4.21 },
    { token: "systematically", activation: 4.15 },
    { token: "enumerate", activation: 3.98 },
    { token: "3)", activation: 3.89 },
    { token: "options", activation: 3.74 },
    { token: "approach", activation: 3.62 },
    { token: "method", activation: 3.55 },
  ],
  topContexts: [
    {
      text: "Let me systematically try all combinations: 1) First, using 100...",
      activation: 4.72,
    },
    {
      text: "I'll enumerate the possibilities: option A gives us...",
      activation: 4.38,
    },
    {
      text: "Let me approach this methodically by listing each case:",
      activation: 4.15,
    },
  ],
  layer: 16,
  correlatedFeatures: [31042, 29876, 30115, 28934],
};

// Generate a diverse set of 99 additional features
function generateFeatures(): SAEFeature[] {
  const features: SAEFeature[] = [feature30939];

  const featureTemplates: Array<{
    label: string;
    description: string;
    category: SAEFeature["category"];
    layer: number;
    topTokenSamples: string[];
  }> = [
    // Persona features
    {
      label: "Analytical Voice",
      description: "Activates during precise, methodical reasoning passages with formal language.",
      category: "persona",
      layer: 14,
      topTokenSamples: ["therefore", "precisely", "calculate", "determine", "verify"],
    },
    {
      label: "Creative Divergence",
      description: "Fires during brainstorming-like segments where multiple alternatives are generated.",
      category: "persona",
      layer: 12,
      topTokenSamples: ["alternatively", "what if", "perhaps", "imagine", "suppose"],
    },
    {
      label: "Self-Doubt / Hesitation",
      description: "Activates during self-corrective passages expressing uncertainty.",
      category: "persona",
      layer: 15,
      topTokenSamples: ["wait", "actually", "hmm", "not sure", "reconsider"],
    },
    {
      label: "Confident Assertion",
      description: "Fires during declarative statements with high certainty.",
      category: "persona",
      layer: 13,
      topTokenSamples: ["clearly", "obviously", "must be", "definitely", "certainly"],
    },
    // Reasoning features
    {
      label: "Backtracking / Error Correction",
      description: "Activates when the model reverses a previous reasoning step.",
      category: "reasoning",
      layer: 16,
      topTokenSamples: ["but wait", "that's wrong", "let me redo", "actually no", "mistake"],
    },
    {
      label: "Verification Step",
      description: "Fires during answer-checking and validation passages.",
      category: "reasoning",
      layer: 17,
      topTokenSamples: ["let me check", "verify", "plug back in", "confirm", "double-check"],
    },
    {
      label: "Subgoal Decomposition",
      description: "Activates when breaking a problem into smaller subproblems.",
      category: "reasoning",
      layer: 15,
      topTokenSamples: ["first", "then", "step 1", "break this down", "subproblem"],
    },
    {
      label: "Pattern Recognition",
      description: "Fires when identifying structural similarities or recurring patterns.",
      category: "reasoning",
      layer: 14,
      topTokenSamples: ["similar to", "pattern", "recognise", "like before", "same structure"],
    },
    {
      label: "Arithmetic Computation",
      description: "Activates during explicit numerical calculations.",
      category: "reasoning",
      layer: 18,
      topTokenSamples: ["=", "+", "*", "equals", "gives us"],
    },
    {
      label: "Logical Deduction",
      description: "Fires during if-then reasoning and logical inference chains.",
      category: "reasoning",
      layer: 16,
      topTokenSamples: ["therefore", "implies", "if", "since", "because"],
    },
    // Factual features
    {
      label: "Mathematical Definition Recall",
      description: "Activates when retrieving mathematical definitions or theorems.",
      category: "factual",
      layer: 10,
      topTokenSamples: ["by definition", "theorem", "property", "axiom", "states that"],
    },
    {
      label: "Numerical Magnitude Sense",
      description: "Fires when estimating or comparing numerical magnitudes.",
      category: "factual",
      layer: 8,
      topTokenSamples: ["approximately", "roughly", "about", "close to", "in the range"],
    },
    // Stylistic features
    {
      label: "List Formatting",
      description: "Activates during enumeration with bullet points or numbered lists.",
      category: "stylistic",
      layer: 6,
      topTokenSamples: ["1.", "2.", "-", "first,", "second,"],
    },
    {
      label: "Thinking Aloud Marker",
      description: "Fires at internal monologue markers typical of chain-of-thought.",
      category: "stylistic",
      layer: 4,
      topTokenSamples: ["let me", "I think", "so", "ok", "now"],
    },
    {
      label: "Conclusion Signaling",
      description: "Activates at transition to final answer or summary.",
      category: "stylistic",
      layer: 20,
      topTokenSamples: ["therefore", "the answer is", "in conclusion", "so the solution", "final answer"],
    },
    // Emotional features
    {
      label: "Frustration / Struggle",
      description: "Fires during passages expressing difficulty or frustration with a problem.",
      category: "emotional",
      layer: 9,
      topTokenSamples: ["this is tricky", "struggling", "difficult", "stuck", "can't seem to"],
    },
    {
      label: "Eureka / Insight",
      description: "Activates during breakthrough moments in reasoning.",
      category: "emotional",
      layer: 11,
      topTokenSamples: ["aha", "I see", "that's it", "of course", "now I realize"],
    },
    // Structural features
    {
      label: "Paragraph Boundary",
      description: "Fires at natural breaks between reasoning sections.",
      category: "structural",
      layer: 3,
      topTokenSamples: ["\n\n", "Moving on", "Next", "Now let's", "Turning to"],
    },
    {
      label: "Problem Restatement",
      description: "Activates when restating or paraphrasing the original problem.",
      category: "structural",
      layer: 5,
      topTokenSamples: ["we need to", "the question asks", "given that", "we're looking for", "find"],
    },
    {
      label: "Constraint Tracking",
      description: "Fires when maintaining or checking problem constraints.",
      category: "reasoning",
      layer: 16,
      topTokenSamples: ["remaining", "available", "unused", "already used", "constraint"],
    },
  ];

  // Generate features from templates with variations
  let featureIndex = 28000;
  for (const template of featureTemplates) {
    for (let variant = 0; variant < 5; variant++) {
      featureIndex += Math.floor(Math.random() * 200) + 50;
      const meanAct = 0.1 + Math.random() * 0.5;
      const stdAct = meanAct * (0.3 + Math.random() * 0.7);
      const maxAct = meanAct + stdAct * (2 + Math.random() * 3);
      const sparsity = 0.85 + Math.random() * 0.12;

      features.push({
        index: featureIndex,
        label: variant === 0 ? template.label : `${template.label} (variant ${variant})`,
        description: template.description,
        category: template.category,
        activationStats: {
          mean: parseFloat(meanAct.toFixed(3)),
          std: parseFloat(stdAct.toFixed(3)),
          max: parseFloat(maxAct.toFixed(2)),
          sparsity: parseFloat(sparsity.toFixed(3)),
          frequency: parseFloat((1 - sparsity).toFixed(3)),
        },
        topTokens: template.topTokenSamples.map((token, i) => ({
          token,
          activation: parseFloat((maxAct - i * 0.15).toFixed(2)),
        })),
        topContexts: [
          {
            text: `Example context activating ${template.label.toLowerCase()} pattern...`,
            activation: parseFloat(maxAct.toFixed(2)),
          },
        ],
        layer: template.layer + (variant > 2 ? 1 : 0),
        correlatedFeatures: [
          featureIndex + Math.floor(Math.random() * 1000),
          featureIndex - Math.floor(Math.random() * 1000),
        ],
      });
    }
  }

  return features;
}

export const mockSAEFeatures: SAEFeature[] = generateFeatures();

export const featureCategories = [
  { value: "all", label: "All Categories" },
  { value: "persona", label: "Persona" },
  { value: "reasoning", label: "Reasoning" },
  { value: "factual", label: "Factual" },
  { value: "stylistic", label: "Stylistic" },
  { value: "emotional", label: "Emotional" },
  { value: "structural", label: "Structural" },
  { value: "unknown", label: "Unknown" },
] as const;
