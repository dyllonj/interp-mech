"use client";

import { cn } from "@/lib/utils";
import type { TraceSegment, ConversationalBehavior } from "@/types";
import { motion } from "framer-motion";

const behaviorColors: Record<ConversationalBehavior, string> = {
  "question-answering": "bg-blue-500",
  "perspective-shift": "bg-violet-500",
  conflict: "bg-red-500",
  reconciliation: "bg-emerald-500",
  neutral: "bg-neutral-500",
};

const behaviorLabels: Record<ConversationalBehavior, string> = {
  "question-answering": "Q&A",
  "perspective-shift": "Shift",
  conflict: "Conflict",
  reconciliation: "Reconcile",
  neutral: "Neutral",
};

interface BehaviorTimelineProps {
  segments: TraceSegment[];
  selectedSegmentId: string | null;
  onSelectSegment: (id: string) => void;
  totalTokens: number;
}

export function BehaviorTimeline({
  segments,
  selectedSegmentId,
  onSelectSegment,
  totalTokens,
}: BehaviorTimelineProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Behavior Timeline
        </h4>
        <div className="flex gap-3">
          {(
            Object.entries(behaviorLabels) as [ConversationalBehavior, string][]
          ).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className={cn("h-2 w-2 rounded-full", behaviorColors[key])}
              />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-8 gap-px overflow-hidden rounded-lg">
        {segments.map((seg) => {
          const widthPct =
            ((seg.endToken - seg.startToken) / totalTokens) * 100;
          return (
            <motion.button
              key={seg.id}
              className={cn(
                "relative transition-all",
                behaviorColors[seg.behaviorType],
                selectedSegmentId === seg.id
                  ? "opacity-100 ring-2 ring-white/30"
                  : "opacity-60 hover:opacity-80"
              )}
              style={{ width: `${Math.max(widthPct, 1)}%` }}
              onClick={() => onSelectSegment(seg.id)}
              whileHover={{ scaleY: 1.15 }}
              title={`${behaviorLabels[seg.behaviorType]} (${seg.personaAttribution})`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Token 0</span>
        <span>Token {totalTokens}</span>
      </div>
    </div>
  );
}
