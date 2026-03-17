"use client";

import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Scan,
  FlaskConical,
  LineChart,
  GraduationCap,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLearningStore } from "@/stores";

const steps = [
  {
    icon: Lightbulb,
    label: "Hypothesis Generation",
    description: "Define testable predictions",
    active: true,
  },
  {
    icon: Scan,
    label: "Activation Mapping",
    description: "Identify relevant features",
    active: false,
  },
  {
    icon: FlaskConical,
    label: "Intervention Simulation",
    description: "Run steering experiments",
    active: false,
  },
  {
    icon: LineChart,
    label: "Results Synthesis",
    description: "Analyze outcomes",
    active: false,
  },
];

export function ResearchFramework() {
  const { learningModeEnabled, toggleLearningMode } = useLearningStore();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Research Framework
        </h3>
      </div>

      <div className="flex-1 space-y-1 p-3">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                step.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  step.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50"
                )}
              >
                <step.icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium">{step.label}</p>
                <p className="truncate text-[10px] opacity-70">
                  {step.description}
                </p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-6 h-3 border-l border-border/50" />
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Active Context */}
      <div className="space-y-2 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active Context
        </h3>
        <div className="space-y-1.5">
          <ContextItem label="Model" value="DeepSeek-R1-Distill-Qwen-7B" />
          <ContextItem label="Layer Focus" value="16" />
          <ContextItem label="Feature" value="#30939" />
        </div>
      </div>

      <Separator />

      {/* Learning Mode Toggle */}
      <div className="p-4">
        <button
          onClick={toggleLearningMode}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
            learningModeEnabled
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span className="font-medium">Learning Mode</span>
          <span
            className={cn(
              "ml-auto text-[10px]",
              learningModeEnabled ? "text-primary" : "text-muted-foreground"
            )}
          >
            {learningModeEnabled ? "ON" : "OFF"}
          </span>
        </button>
      </div>
    </div>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground">{value}</span>
    </div>
  );
}
