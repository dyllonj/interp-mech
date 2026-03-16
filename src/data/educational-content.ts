import type { ConceptDefinition, Tutorial, TutorialStep } from "@/types";

export const concepts: ConceptDefinition[] = [
  // ── Beginner: Transformer Basics ──
  {
    id: "concept-transformer",
    term: "Transformer",
    shortExplanation: "The neural network architecture behind modern language models.",
    fullExplanation:
      "A Transformer is a neural network architecture introduced in 2017 that processes sequences using self-attention mechanisms rather than recurrence. It consists of stacked layers, each containing multi-head attention and feed-forward (MLP) sub-layers. Transformers are the foundation of models like GPT, Claude, and DeepSeek.",
    difficulty: "beginner",
    paperReference: {
      title: "Attention Is All You Need",
      authors: ["Vaswani et al."],
      year: 2017,
      venue: "NeurIPS",
    },
    relatedConcepts: ["concept-layers", "concept-attention", "concept-residual-stream"],
    category: "Foundations",
  },
  {
    id: "concept-layers",
    term: "Layers",
    shortExplanation: "The repeated processing blocks stacked to form a deep transformer.",
    fullExplanation:
      "A transformer is composed of sequential layers (e.g., 32 in a 7B model). Each layer contains an attention sub-layer and an MLP sub-layer. Information flows through all layers via the residual stream. Different layers learn to perform different computations — early layers often handle syntax, middle layers handle semantics, and late layers handle output formatting.",
    difficulty: "beginner",
    relatedConcepts: ["concept-transformer", "concept-residual-stream", "concept-mlp"],
    category: "Foundations",
  },
  {
    id: "concept-residual-stream",
    term: "Residual Stream",
    shortExplanation: "The information highway running through all layers of a transformer.",
    fullExplanation:
      "The residual stream is the central communication channel in a transformer. Each layer reads from it and writes back to it additively. This architecture means information from early layers is directly accessible to later layers without passing through intermediate computations. The residual stream at any given layer contains the sum of all prior contributions.",
    difficulty: "beginner",
    relatedConcepts: ["concept-layers", "concept-transformer"],
    category: "Foundations",
  },
  {
    id: "concept-attention",
    term: "Attention Heads",
    shortExplanation: "Components that decide which tokens should influence each other.",
    fullExplanation:
      "Attention heads are the core mechanism for mixing information between token positions. Each head computes query, key, and value vectors, uses query-key dot products to determine attention weights, and produces a weighted sum of values. Multiple heads operate in parallel, each potentially learning a different attention pattern (e.g., 'attend to the previous noun' or 'attend to matching brackets').",
    difficulty: "beginner",
    relatedConcepts: ["concept-transformer", "concept-layers"],
    category: "Foundations",
  },
  {
    id: "concept-cot",
    term: "Chain-of-Thought (CoT)",
    shortExplanation: "When a model 'thinks out loud' step by step before answering.",
    fullExplanation:
      "Chain-of-thought reasoning is a behavior where language models generate intermediate reasoning steps before producing a final answer. This can emerge naturally in large models or be induced through prompting. CoT is central to this research because the paper analyzes the internal structure of these reasoning traces, finding that they exhibit conversational dynamics with multiple 'personas.'",
    difficulty: "beginner",
    relatedConcepts: ["concept-reasoning-trace", "concept-behaviors"],
    category: "Foundations",
  },
  {
    id: "concept-tokens",
    term: "Tokens",
    shortExplanation: "The basic units of text that a language model processes.",
    fullExplanation:
      "Tokens are subword units produced by a tokenizer — they might be whole words, word fragments, or individual characters. A model processes text as a sequence of token embeddings. Understanding tokenization is important for interpretability because features and activations operate at the token level.",
    difficulty: "beginner",
    relatedConcepts: ["concept-transformer"],
    category: "Foundations",
  },
  {
    id: "concept-mlp",
    term: "MLP (Feed-Forward) Layers",
    shortExplanation: "The layers that transform each token's representation independently.",
    fullExplanation:
      "MLP (Multi-Layer Perceptron) sub-layers in a transformer process each token position independently, applying nonlinear transformations. They are believed to store factual knowledge and perform computations on individual token representations. SAEs are often trained on MLP outputs to decompose their high-dimensional representations into interpretable features.",
    difficulty: "beginner",
    relatedConcepts: ["concept-layers", "concept-sae", "concept-features"],
    category: "Foundations",
  },

  // ── Core Interpretability Concepts ──
  {
    id: "concept-features",
    term: "Features",
    shortExplanation: "Individual, interpretable directions in a model's activation space.",
    fullExplanation:
      "In mechanistic interpretability, a 'feature' is a direction in activation space that corresponds to a specific, interpretable concept. For example, one feature might activate on Python code, another on French text, another on expressions of uncertainty. Features are the fundamental units we aim to discover and understand.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-superposition", "concept-sae", "concept-monosemanticity"],
    category: "Core Interpretability",
  },
  {
    id: "concept-superposition",
    term: "Superposition",
    shortExplanation: "How neural networks encode more features than they have dimensions.",
    fullExplanation:
      "Superposition is the phenomenon where neural networks represent many more features than they have dimensions, by encoding features in almost-orthogonal directions. This is possible because most features are sparse (rarely active). Superposition makes individual neurons polysemantic (responding to multiple unrelated things), which is why we need SAEs to disentangle the representations.",
    difficulty: "intermediate",
    paperReference: {
      title: "Toy Models of Superposition",
      authors: ["Elhage et al."],
      year: 2022,
      venue: "Anthropic Research",
    },
    relatedConcepts: ["concept-features", "concept-sae", "concept-monosemanticity"],
    category: "Core Interpretability",
  },
  {
    id: "concept-sae",
    term: "Sparse Autoencoder (SAE)",
    shortExplanation: "A tool that decomposes neural activations into interpretable features.",
    fullExplanation:
      "A Sparse Autoencoder is a neural network trained to reconstruct model activations through a bottleneck layer with a sparsity constraint. The learned dictionary vectors correspond to interpretable features. SAEs are the primary tool used in this research to identify features like Feature 30939 (systematic enumeration) and to decompose the model's internal representations into human-understandable components.",
    difficulty: "intermediate",
    paperReference: {
      title: "Towards Monosemanticity",
      authors: ["Bricken et al."],
      year: 2023,
      venue: "Anthropic Research",
    },
    relatedConcepts: ["concept-features", "concept-superposition", "concept-feature-30939"],
    category: "Core Interpretability",
  },
  {
    id: "concept-monosemanticity",
    term: "Monosemanticity",
    shortExplanation: "When a feature responds to exactly one interpretable concept.",
    fullExplanation:
      "Monosemanticity is the property of a feature (or neuron) responding to a single, coherent concept rather than multiple unrelated ones. SAEs aim to discover monosemantic features from polysemantic neurons. A perfectly monosemantic feature for 'Python code' would only activate on Python code and nothing else.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-features", "concept-sae", "concept-superposition"],
    category: "Core Interpretability",
  },
  {
    id: "concept-activation-patching",
    term: "Activation Patching",
    shortExplanation: "A technique to test which components causally matter for a behavior.",
    fullExplanation:
      "Activation patching replaces the activation at one component (e.g., a specific layer or attention head) with the activation from a different input, then measures how this changes the output. If patching component X changes the output significantly, X is causally important for that behavior. This is a key technique for localizing where in the network specific computations happen.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-causal-tracing", "concept-steering"],
    category: "Core Interpretability",
  },
  {
    id: "concept-causal-tracing",
    term: "Causal Tracing",
    shortExplanation: "Mapping which model components are causally responsible for outputs.",
    fullExplanation:
      "Causal tracing (also called causal mediation analysis) systematically applies activation patching across many components to build a map of causal importance. It reveals the computational pathway the model uses to produce a specific output, showing which layers, heads, and MLP neurons matter most.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-activation-patching", "concept-steering"],
    category: "Core Interpretability",
  },
  {
    id: "concept-logit-lens",
    term: "Logit Lens",
    shortExplanation: "Reading the model's 'predictions' at intermediate layers.",
    fullExplanation:
      "The logit lens technique applies the model's final unembedding matrix to intermediate residual stream states, converting them into probability distributions over the vocabulary. This lets you see what the model would predict at each layer, revealing how its internal representation evolves from input to output.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-residual-stream", "concept-layers"],
    category: "Core Interpretability",
  },

  // ── Paper-Specific Concepts ──
  {
    id: "concept-steering",
    term: "Activation Steering",
    shortExplanation: "Artificially boosting or suppressing SAE features to change model behavior.",
    fullExplanation:
      "Activation steering (also called feature steering) involves adding or subtracting a feature's direction vector from the model's activations at a specific layer during inference. By 'turning up' or 'turning down' a feature, you can observe its causal effect on behavior. In this paper, steering Feature 30939 at +10 doubles Countdown accuracy.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-sae", "concept-feature-30939", "concept-intervention"],
    category: "Paper-Specific",
  },
  {
    id: "concept-feature-30939",
    term: "Feature 30939",
    shortExplanation: "The SAE feature for 'systematic enumeration' that doubles reasoning accuracy.",
    fullExplanation:
      "Feature 30939 is a specific SAE feature identified in DeepSeek-R1-Distill-Qwen-7B at layer 16 that corresponds to systematic enumeration and methodical search patterns. Its top-activating tokens include numbered lists and phrases like 'let me try.' Steering this feature at +10 doubles Countdown task accuracy from 27.1% to 54.8%, making it one of the most causally important individual features discovered for mathematical reasoning.",
    difficulty: "intermediate",
    paperReference: {
      title: "Reasoning Models Exhibit Conversational Behaviors and Diverse Personalities",
      authors: ["Research Team"],
      year: 2025,
      venue: "arXiv",
    },
    relatedConcepts: ["concept-sae", "concept-steering", "concept-intervention"],
    category: "Paper-Specific",
  },
  {
    id: "concept-bales-ipa",
    term: "Bales' Interaction Process Analysis (IPA)",
    shortExplanation: "A sociology framework for categorizing group interactions, applied to CoT.",
    fullExplanation:
      "Robert Bales' IPA classifies group interactions into 12 categories across 4 domains: positive socioemotional (shows solidarity, tension release, agreement), task-oriented answers (suggestions, opinions, orientation), task-oriented questions (asks orientation, opinion, suggestion), and negative socioemotional (disagreement, tension, antagonism). The paper applies this framework to CoT traces, showing that model reasoning exhibits the same structured interaction patterns as human group discussions.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-behaviors", "concept-personas"],
    category: "Paper-Specific",
  },
  {
    id: "concept-behaviors",
    term: "Conversational Behaviors",
    shortExplanation: "The four behavior types found in CoT: Q&A, perspective-shift, conflict, reconciliation.",
    fullExplanation:
      "The paper identifies four recurring conversational behavior types in chain-of-thought traces: (1) Question-answering — direct problem-solving, (2) Perspective-shift — re-examining from a new angle, (3) Conflict — self-contradiction and backtracking, (4) Reconciliation — synthesizing partial results. These behaviors mirror multi-party dialogue patterns and emerge naturally from training.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-cot", "concept-personas", "concept-bales-ipa"],
    category: "Paper-Specific",
  },
  {
    id: "concept-personas",
    term: "Reasoning Personas",
    shortExplanation: "Distinct 'voices' with different personalities that appear within a single model's reasoning.",
    fullExplanation:
      "The paper discovers that different segments of a model's chain-of-thought can be attributed to distinct 'personas' — functional roles with measurably different Big Five personality profiles. For example, an 'Analyst' persona (high conscientiousness, low extraversion) handles systematic computation, while an 'Explorer' persona (high openness, high extraversion) generates alternative approaches. These personas are not explicitly programmed but emerge through training.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-behaviors", "concept-big-five", "concept-bales-ipa"],
    category: "Paper-Specific",
  },
  {
    id: "concept-big-five",
    term: "Big Five Personality Model",
    shortExplanation: "Five personality dimensions used to characterize reasoning personas.",
    fullExplanation:
      "The Big Five (OCEAN) model measures personality along five dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. The paper uses these to characterize reasoning personas found in CoT traces, finding that different personas exhibit distinct, consistent profiles. For example, personas high in Conscientiousness tend to include verification steps.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-personas"],
    category: "Paper-Specific",
  },
  {
    id: "concept-intervention",
    term: "Intervention Experiment",
    shortExplanation: "A controlled test where you modify the model to measure causal effects.",
    fullExplanation:
      "An intervention experiment involves modifying some aspect of the model (e.g., steering a feature, ablating a component) and measuring the effect on behavior compared to an unmodified baseline. This establishes causal rather than merely correlational relationships between internal components and observable behavior.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-steering", "concept-activation-patching"],
    category: "Paper-Specific",
  },
  {
    id: "concept-reasoning-trace",
    term: "Reasoning Trace",
    shortExplanation: "The full chain-of-thought output segmented and annotated for analysis.",
    fullExplanation:
      "A reasoning trace is the complete chain-of-thought output from a model, broken into segments and annotated with behavior types, persona attributions, and Bales IPA categories. Traces are the primary data object analyzed in this research — they reveal the internal conversational dynamics of model reasoning.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-cot", "concept-behaviors", "concept-personas"],
    category: "Paper-Specific",
  },

  // ── Advanced Concepts ──
  {
    id: "concept-transformerlens",
    term: "TransformerLens",
    shortExplanation: "A Python library for mechanistic interpretability research on transformers.",
    fullExplanation:
      "TransformerLens (by Neel Nanda) is a library that provides clean, hackable implementations of transformer models designed for interpretability research. It makes it easy to access and modify intermediate activations, run activation patching experiments, and apply techniques like the logit lens. It's the standard tool for hands-on mech interp work.",
    difficulty: "advanced",
    relatedConcepts: ["concept-activation-patching", "concept-logit-lens", "concept-sae"],
    category: "Tools & Methods",
  },
  {
    id: "concept-ppo",
    term: "PPO (Proximal Policy Optimization)",
    shortExplanation: "A reinforcement learning algorithm used to fine-tune language models from human feedback.",
    fullExplanation:
      "PPO is the RL algorithm commonly used in RLHF (Reinforcement Learning from Human Feedback) to fine-tune language models. The paper finds that PPO training amplifies persona differentiation — post-PPO models show ~40% greater divergence between persona profiles compared to pre-training, suggesting that RL sharpens functional role specialization within the model's reasoning.",
    difficulty: "advanced",
    relatedConcepts: ["concept-rlhf"],
    category: "Tools & Methods",
  },
  {
    id: "concept-rlhf",
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    shortExplanation: "Training models to align with human preferences using reinforcement learning.",
    fullExplanation:
      "RLHF is a training paradigm where a reward model trained on human preference data guides policy optimization (typically via PPO). In the context of this research, RLHF/PPO training is found to amplify the diversity and differentiation of reasoning personas, suggesting that alignment training doesn't just improve output quality but also increases the internal functional complexity of reasoning.",
    difficulty: "advanced",
    relatedConcepts: ["concept-ppo"],
    category: "Tools & Methods",
  },
  {
    id: "concept-ablation",
    term: "Ablation",
    shortExplanation: "Removing or zeroing out a model component to test its necessity.",
    fullExplanation:
      "Ablation studies involve removing (zeroing out) specific components — neurons, attention heads, features, or entire layers — and measuring the impact on performance. If ablating component X degrades performance on task Y, then X is necessary for Y. This is a cruder but simpler alternative to activation patching.",
    difficulty: "advanced",
    relatedConcepts: ["concept-activation-patching", "concept-causal-tracing"],
    category: "Tools & Methods",
  },
  {
    id: "concept-probing",
    term: "Probing Classifiers",
    shortExplanation: "Training small classifiers on activations to test what information is represented.",
    fullExplanation:
      "Probing involves training a simple classifier (e.g., linear or small MLP) on intermediate activations to predict some property (e.g., 'is this token part of a question?'). High probe accuracy suggests the information is linearly represented in the activation space. Probing is correlational, not causal — it shows what information is present, not whether the model uses it.",
    difficulty: "advanced",
    relatedConcepts: ["concept-features", "concept-residual-stream"],
    category: "Tools & Methods",
  },

  // Additional concepts
  {
    id: "concept-dictionary-learning",
    term: "Dictionary Learning",
    shortExplanation: "Finding a set of basis vectors that sparsely represent data.",
    fullExplanation:
      "Dictionary learning is the mathematical framework underlying SAEs. The goal is to find a dictionary of vectors (features) such that any activation can be represented as a sparse combination of these vectors. SAEs perform dictionary learning via gradient descent with a sparsity penalty, discovering the 'true' features encoded in superposition.",
    difficulty: "advanced",
    relatedConcepts: ["concept-sae", "concept-superposition", "concept-features"],
    category: "Tools & Methods",
  },
  {
    id: "concept-polysemanticity",
    term: "Polysemanticity",
    shortExplanation: "When a single neuron responds to multiple unrelated concepts.",
    fullExplanation:
      "Polysemanticity is the phenomenon where individual neurons activate for multiple, seemingly unrelated inputs. For example, a single neuron might fire for both 'academic citations' and 'DNA sequences.' This occurs because of superposition — the network encodes more features than neurons. SAEs aim to recover the underlying monosemantic features from polysemantic neurons.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-superposition", "concept-monosemanticity", "concept-features"],
    category: "Core Interpretability",
  },
  {
    id: "concept-circuit",
    term: "Circuit",
    shortExplanation: "A subgraph of model components that implements a specific computation.",
    fullExplanation:
      "A circuit is a subset of model components (attention heads, MLP neurons, features) that work together to implement a specific algorithm or behavior. Circuit discovery involves identifying which components matter for a given task and understanding how they interact. Circuits are the 'programs' that transformers learn to run.",
    difficulty: "advanced",
    relatedConcepts: ["concept-activation-patching", "concept-causal-tracing", "concept-features"],
    category: "Core Interpretability",
  },
  {
    id: "concept-sparsity",
    term: "Sparsity",
    shortExplanation: "The property that most features are inactive most of the time.",
    fullExplanation:
      "Sparsity means that for any given input, only a small fraction of features are active. This is both an empirical observation about neural networks and a key assumption of SAE training. High sparsity (e.g., 92% for Feature 30939) means the feature activates on only 8% of inputs, making it a selective, specific detector.",
    difficulty: "intermediate",
    relatedConcepts: ["concept-sae", "concept-superposition"],
    category: "Core Interpretability",
  },
  {
    id: "concept-embedding",
    term: "Embedding",
    shortExplanation: "Converting tokens into high-dimensional numerical vectors.",
    fullExplanation:
      "The embedding layer converts discrete tokens into continuous vectors in a high-dimensional space (e.g., 4096 dimensions for a 7B model). These vectors are the initial representations that get refined by each transformer layer. The embedding space has geometric structure — similar tokens tend to have similar embeddings.",
    difficulty: "beginner",
    relatedConcepts: ["concept-tokens", "concept-residual-stream"],
    category: "Foundations",
  },
];

export const tutorials: Tutorial[] = [
  {
    id: "tutorial-foundations",
    title: "Understanding Transformers for Interpretability",
    description:
      "Build intuition for how transformers process information, focusing on the concepts most relevant to mechanistic interpretability.",
    difficulty: "beginner",
    steps: [
      {
        id: "step-1-1",
        title: "What is a Transformer?",
        content:
          "A transformer processes text by breaking it into tokens, converting them to embeddings, and passing them through a series of layers. Each layer refines the representation. Think of it as an assembly line where each station adds more understanding.",
        conceptIds: ["concept-transformer", "concept-tokens", "concept-embedding"],
        order: 1,
      },
      {
        id: "step-1-2",
        title: "The Residual Stream",
        content:
          "Information flows through the transformer via the residual stream — a vector at each token position that accumulates contributions from every layer. Each layer reads from and writes back to this stream.",
        conceptIds: ["concept-residual-stream", "concept-layers"],
        order: 2,
      },
      {
        id: "step-1-3",
        title: "Attention and MLPs",
        content:
          "Each layer has two components: attention heads (which move information between positions) and MLP layers (which transform information at each position). Attention decides 'what to look at,' MLPs decide 'what to do with it.'",
        conceptIds: ["concept-attention", "concept-mlp"],
        order: 3,
      },
      {
        id: "step-1-4",
        title: "Chain-of-Thought Reasoning",
        content:
          "Modern reasoning models 'think out loud' — they generate intermediate steps before answering. This chain-of-thought (CoT) is what we'll be analyzing for conversational structure and persona dynamics.",
        conceptIds: ["concept-cot"],
        order: 4,
      },
    ],
    estimatedMinutes: 15,
    prerequisites: [],
  },
  {
    id: "tutorial-features",
    title: "Features, Superposition, and SAEs",
    description:
      "Understand the key concepts behind how we decompose neural networks into interpretable components.",
    difficulty: "intermediate",
    steps: [
      {
        id: "step-2-1",
        title: "What are Features?",
        content:
          "A 'feature' is an interpretable direction in activation space. Instead of looking at individual neurons (which are polysemantic), we look for directions that consistently correspond to specific concepts.",
        conceptIds: ["concept-features", "concept-polysemanticity"],
        order: 1,
      },
      {
        id: "step-2-2",
        title: "The Problem of Superposition",
        content:
          "Networks encode more features than they have dimensions by using almost-orthogonal directions. This means we can't just look at individual neurons — we need tools like SAEs to disentangle the overlapping representations.",
        conceptIds: ["concept-superposition"],
        order: 2,
      },
      {
        id: "step-2-3",
        title: "Sparse Autoencoders",
        content:
          "SAEs learn to decompose activations into a sparse set of interpretable features via dictionary learning. They're trained to reconstruct activations while keeping most feature activations at zero.",
        conceptIds: ["concept-sae", "concept-dictionary-learning", "concept-sparsity"],
        order: 3,
      },
      {
        id: "step-2-4",
        title: "From Features to Understanding",
        content:
          "Once we have features, we can test them causally. Activation steering lets us 'turn up' a feature and see what happens — like Feature 30939, which doubles reasoning accuracy when amplified.",
        conceptIds: ["concept-steering", "concept-feature-30939"],
        order: 4,
      },
    ],
    estimatedMinutes: 20,
    prerequisites: ["tutorial-foundations"],
  },
  {
    id: "tutorial-conversational",
    title: "Conversational Dynamics in Reasoning",
    description:
      "Explore how chain-of-thought traces exhibit multi-party conversation patterns with distinct personas.",
    difficulty: "intermediate",
    steps: [
      {
        id: "step-3-1",
        title: "CoT as Conversation",
        content:
          "When a model reasons step-by-step, the trace isn't just a monologue — it exhibits patterns of question-answering, perspective shifts, internal conflicts, and reconciliation, much like a group discussion.",
        conceptIds: ["concept-behaviors", "concept-reasoning-trace"],
        order: 1,
      },
      {
        id: "step-3-2",
        title: "The Four Behavior Types",
        content:
          "The paper identifies four recurring behaviors: Question-Answering (direct problem-solving), Perspective-Shift (trying a new angle), Conflict (catching errors), and Reconciliation (synthesizing results).",
        conceptIds: ["concept-behaviors"],
        order: 2,
      },
      {
        id: "step-3-3",
        title: "Personas with Personality",
        content:
          "Different reasoning segments can be attributed to distinct 'personas' with measurable Big Five personality profiles. An analytical persona handles computation; an explorer generates alternatives; a critic catches errors.",
        conceptIds: ["concept-personas", "concept-big-five"],
        order: 3,
      },
      {
        id: "step-3-4",
        title: "Bales IPA Framework",
        content:
          "Bales' Interaction Process Analysis, originally designed for studying human group dynamics, maps cleanly onto CoT traces. This suggests that the model's internal reasoning shares structural properties with human collaborative problem-solving.",
        conceptIds: ["concept-bales-ipa"],
        order: 4,
      },
    ],
    estimatedMinutes: 20,
    prerequisites: ["tutorial-foundations"],
  },
  {
    id: "tutorial-experiments",
    title: "Designing Intervention Experiments",
    description:
      "Learn how to design and interpret causal intervention experiments using activation steering.",
    difficulty: "advanced",
    steps: [
      {
        id: "step-4-1",
        title: "Why Interventions?",
        content:
          "Correlational analysis tells you what features are present — causal interventions tell you which ones matter. Activation steering is the primary intervention technique in this research.",
        conceptIds: ["concept-intervention", "concept-steering"],
        order: 1,
      },
      {
        id: "step-4-2",
        title: "Designing an Experiment",
        content:
          "A good intervention experiment has: a specific hypothesis, a clear metric, a baseline measurement, a controlled modification (feature steering), and a post-intervention measurement. The Feature 30939 experiment is a model example.",
        conceptIds: ["concept-feature-30939", "concept-intervention"],
        order: 2,
      },
      {
        id: "step-4-3",
        title: "Interpreting Results",
        content:
          "When steering Feature 30939 at +10, accuracy doubles. But we also examine how the CoT changes: more systematic enumeration, longer traces, more 'Analyst' persona segments. The behavioral shifts validate the feature's functional role.",
        conceptIds: ["concept-steering", "concept-behaviors"],
        order: 3,
      },
      {
        id: "step-4-4",
        title: "Advanced Techniques",
        content:
          "Beyond single-feature steering, researchers use activation patching, ablation studies, and probing classifiers to build comprehensive causal maps of model behavior. Each technique has complementary strengths.",
        conceptIds: ["concept-activation-patching", "concept-ablation", "concept-probing"],
        order: 4,
      },
    ],
    estimatedMinutes: 25,
    prerequisites: ["tutorial-features", "tutorial-conversational"],
  },
];
