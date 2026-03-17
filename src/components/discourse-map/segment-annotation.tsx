"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TraceSegment, PersonaProfile } from "@/types";
import { cn } from "@/lib/utils";
import { MessageSquare, Users, BarChart2, Target } from "lucide-react";

const behaviorColorClasses: Record<string, string> = {
  "question-answering": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "perspective-shift": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  conflict: "bg-red-500/15 text-red-400 border-red-500/25",
  reconciliation: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  neutral: "bg-neutral-500/15 text-neutral-400 border-neutral-500/25",
};

interface SegmentAnnotationProps {
  segment: TraceSegment;
  persona?: PersonaProfile;
}

export function SegmentAnnotation({
  segment,
  persona,
}: SegmentAnnotationProps) {
  return (
    <Card className="border-border/50 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Segment Detail
      </h4>

      <div className="space-y-3">
        {/* Behavior Type */}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Behavior:</span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]",
              behaviorColorClasses[segment.behaviorType]
            )}
          >
            {segment.behaviorType}
          </Badge>
        </div>

        {/* Bales Role */}
        <div className="flex items-center gap-2">
          <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Bales Role:</span>
          <Badge variant="outline" className="text-[10px]">
            {segment.balesRole}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            ({segment.balesCategory})
          </span>
        </div>

        {/* Persona */}
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Persona:</span>
          {persona && (
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: persona.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {persona.name}
              </span>
            </div>
          )}
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${segment.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">
              {Math.round(segment.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Token range */}
        <div className="rounded-md bg-muted/30 px-2.5 py-1.5">
          <span className="text-[10px] text-muted-foreground">
            Tokens {segment.startToken} - {segment.endToken}
          </span>
        </div>

        {/* Text excerpt */}
        <div className="rounded-md border border-border/30 bg-muted/20 p-3">
          <p className="text-xs leading-relaxed text-foreground/80">
            {segment.text}
          </p>
        </div>
      </div>
    </Card>
  );
}
