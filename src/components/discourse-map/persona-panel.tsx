"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonaRadar } from "@/components/visualizations/persona-radar";
import type { PersonaProfile, TraceSegment } from "@/types";
import { cn } from "@/lib/utils";

interface PersonaPanelProps {
  personas: PersonaProfile[];
  segments: TraceSegment[];
  highlightedPersona: string | null;
  onHighlightPersona: (id: string | null) => void;
}

export function PersonaPanel({
  personas,
  segments,
  highlightedPersona,
  onHighlightPersona,
}: PersonaPanelProps) {
  // Calculate segment counts per persona
  const personaCounts = new Map<string, number>();
  for (const seg of segments) {
    personaCounts.set(
      seg.personaAttribution,
      (personaCounts.get(seg.personaAttribution) ?? 0) + 1
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Detected Personas
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {personas.map((persona) => {
          const count = personaCounts.get(persona.id) ?? 0;
          const isHighlighted = highlightedPersona === persona.id;

          return (
            <Card
              key={persona.id}
              className={cn(
                "cursor-pointer border-border/50 p-3 transition-all hover:border-border neural-glow",
                isHighlighted && "border-primary/50 bg-primary/5"
              )}
              onClick={() =>
                onHighlightPersona(isHighlighted ? null : persona.id)
              }
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: persona.color }}
                />
                <span className="text-xs font-semibold text-foreground">
                  {persona.name}
                </span>
                <Badge variant="outline" className="ml-auto text-[9px]">
                  {count} seg{count !== 1 ? "s" : ""}
                </Badge>
              </div>
              <PersonaRadar persona={persona} size={140} />
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                {persona.communicationStyle}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
