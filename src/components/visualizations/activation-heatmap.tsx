"use client";

import { cn } from "@/lib/utils";

interface ActivationHeatmapProps {
  values: number[];
  labels?: string[];
  maxValue?: number;
  className?: string;
}

export function ActivationHeatmap({
  values,
  labels,
  maxValue,
  className,
}: ActivationHeatmapProps) {
  const max = maxValue ?? Math.max(...values);

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex gap-0.5">
        {values.map((val, i) => {
          const intensity = max > 0 ? val / max : 0;
          return (
            <div
              key={i}
              className="group relative h-8 flex-1 rounded-sm transition-all hover:ring-1 hover:ring-primary/50"
              style={{
                backgroundColor: `oklch(${0.3 + intensity * 0.4} ${
                  intensity * 0.18
                } 280 / ${0.3 + intensity * 0.7})`,
              }}
              title={labels?.[i] ? `${labels[i]}: ${val.toFixed(3)}` : val.toFixed(3)}
            />
          );
        })}
      </div>
      {labels && (
        <div className="flex gap-0.5">
          {labels.map((label, i) => (
            <span
              key={i}
              className="flex-1 truncate text-center text-[8px] text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
