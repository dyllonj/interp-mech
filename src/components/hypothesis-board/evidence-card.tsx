"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PaperFinding } from "@/data/paper-evidence";
import { ExternalLink } from "lucide-react";

const categoryColors: Record<string, string> = {
  steering: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  persona: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  behavior: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  architecture: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  training: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

interface EvidenceCardProps {
  finding: PaperFinding;
  compact?: boolean;
}

export function EvidenceCard({ finding, compact = false }: EvidenceCardProps) {
  return (
    <Card
      className={cn(
        "group border-border/50 bg-card/50 transition-all hover:border-primary/30 neural-glow",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-semibold uppercase tracking-wider",
                categoryColors[finding.category]
              )}
            >
              {finding.category}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              Section {finding.section}
            </span>
          </div>
          <h4 className="text-sm font-medium leading-snug text-foreground">
            {finding.title}
          </h4>
          {!compact && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {finding.summary}
            </p>
          )}
          {finding.keyMetrics && !compact && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.entries(finding.keyMetrics).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  <span className="font-medium text-foreground/70">
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span className="ml-1">{String(value)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="h-1.5 w-8 overflow-hidden rounded-full bg-muted"
            title={`Evidence strength: ${Math.round(finding.evidenceStrength * 100)}%`}
          >
            <div
              className="h-full rounded-full bg-primary/70 transition-all"
              style={{ width: `${finding.evidenceStrength * 100}%` }}
            />
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Card>
  );
}
