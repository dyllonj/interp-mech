"use client";

import { cn } from "@/lib/utils";
import type { ReasoningTrace, PersonaProfile } from "@/types";
import { motion } from "framer-motion";

const behaviorTextColors: Record<string, string> = {
  "question-answering": "border-l-blue-500 bg-blue-500/5",
  "perspective-shift": "border-l-violet-500 bg-violet-500/5",
  conflict: "border-l-red-500 bg-red-500/5",
  reconciliation: "border-l-emerald-500 bg-emerald-500/5",
  neutral: "border-l-neutral-500 bg-neutral-500/5",
};

interface TraceViewerProps {
  trace: ReasoningTrace;
  selectedSegmentId: string | null;
  highlightedPersona: string | null;
  onSelectSegment: (id: string) => void;
}

export function TraceViewer({
  trace,
  selectedSegmentId,
  highlightedPersona,
  onSelectSegment,
}: TraceViewerProps) {
  const personaMap = new Map<string, PersonaProfile>();
  for (const p of trace.personas) {
    personaMap.set(p.id, p);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Reasoning Trace
        </h4>
        <span className="text-[10px] text-muted-foreground">
          {trace.segments.length} segments | {trace.totalTokens} tokens
        </span>
      </div>
      <div className="rounded-lg border border-border/30 bg-card/30 p-1">
        <div className="mb-2 rounded-md bg-muted/30 px-3 py-2">
          <span className="text-[10px] font-medium text-muted-foreground">
            PROMPT:
          </span>
          <p className="mt-0.5 text-xs text-foreground">{trace.prompt}</p>
        </div>
        <div className="space-y-1">
          {trace.segments.map((seg) => {
            const persona = personaMap.get(seg.personaAttribution);
            const isSelected = selectedSegmentId === seg.id;
            const isDimmed =
              highlightedPersona !== null &&
              seg.personaAttribution !== highlightedPersona;

            return (
              <motion.div
                key={seg.id}
                className={cn(
                  "cursor-pointer rounded-md border-l-2 px-3 py-2 transition-all",
                  behaviorTextColors[seg.behaviorType],
                  isSelected && "ring-1 ring-primary/40",
                  isDimmed && "opacity-30"
                )}
                onClick={() => onSelectSegment(seg.id)}
                whileHover={{ x: 2 }}
              >
                <div className="mb-1 flex items-center gap-2">
                  {persona && (
                    <div className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: persona.color }}
                      />
                      <span className="text-[10px] font-medium opacity-70">
                        {persona.name}
                      </span>
                    </div>
                  )}
                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    {seg.behaviorType}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {seg.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
