"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TutorialStep } from "@/types";
import { concepts } from "@/data";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface LearningStepProps {
  step: TutorialStep;
  isActive: boolean;
  isCompleted: boolean;
  onActivate: () => void;
}

export function LearningStep({
  step,
  isActive,
  isCompleted,
  onActivate,
}: LearningStepProps) {
  const relatedConcepts = step.conceptIds
    .map((id) => concepts.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Card
      className={cn(
        "cursor-pointer border-border/50 p-4 transition-all",
        isActive && "border-primary/40 bg-primary/5",
        isCompleted && !isActive && "opacity-60"
      )}
      onClick={onActivate}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400"
              : isActive
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
          )}
        >
          {isCompleted ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            step.order
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground">{step.title}</h4>
          {isActive && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {step.content}
            </p>
          )}
          {isActive && relatedConcepts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {relatedConcepts.map(
                (c) =>
                  c && (
                    <Badge key={c.id} variant="outline" className="text-[9px]">
                      {c.term}
                    </Badge>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
