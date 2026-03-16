"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HypothesisStatus } from "@/types";

const statusConfig: Record<
  HypothesisStatus,
  { label: string; className: string; dot: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-neutral-500/15 text-neutral-400 border-neutral-500/25",
    dot: "bg-neutral-400",
  },
  active: {
    label: "Active",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    dot: "bg-blue-400",
  },
  testing: {
    label: "Testing",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    dot: "bg-purple-400 animate-pulse",
  },
  supported: {
    label: "Supported",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  refuted: {
    label: "Refuted",
    className: "bg-red-500/15 text-red-400 border-red-500/25",
    dot: "bg-red-400",
  },
  archived: {
    label: "Archived",
    className: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
    dot: "bg-neutral-500",
  },
};

interface StatusBadgeProps {
  status: HypothesisStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 text-[10px] font-semibold uppercase tracking-wider",
        config.className,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </Badge>
  );
}
