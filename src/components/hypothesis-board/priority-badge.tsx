"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HypothesisPriority } from "@/types";

const priorityConfig: Record<
  HypothesisPriority,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  high: {
    label: "High",
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  medium: {
    label: "Medium",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  low: {
    label: "Low",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
};

interface PriorityBadgeProps {
  priority: HypothesisPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-semibold uppercase tracking-wider", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
