"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { InterventionResult, BehaviorShift } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface TraceComparisonProps {
  result: InterventionResult;
}

export function TraceComparison({ result }: TraceComparisonProps) {
  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Accuracy Delta"
          value={`${result.accuracyDelta > 0 ? "+" : ""}${(result.accuracyDelta * 100).toFixed(1)}%`}
          trend={result.accuracyDelta >= 0 ? "up" : "down"}
        />
        <MetricCard
          label="Behavior Shifts"
          value={`${result.behaviorShifts.length}`}
          trend="neutral"
        />
        <MetricCard
          label="Persona Shifts"
          value={`${result.personaShifts.length}`}
          trend="neutral"
        />
      </div>

      {/* Trace Comparison */}
      <Tabs defaultValue="side-by-side">
        <TabsList>
          <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
          <TabsTrigger value="behavior">Behavior Shifts</TabsTrigger>
        </TabsList>

        <TabsContent value="side-by-side" className="mt-3">
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-[9px]">
                  Baseline
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/70">
                {result.baselineOutput}
              </p>
            </Card>
            <Card className="border-primary/20 bg-primary/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary text-[9px]">
                  Steered
                </Badge>
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/70">
                {result.steeredOutput}
              </p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="mt-3">
          <Card className="border-border/50 p-4">
            <h4 className="mb-3 text-xs font-semibold text-muted-foreground">
              Behavior Dimension Shifts
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={result.behaviorShifts}
                margin={{ left: 60, right: 16 }}
                layout="vertical"
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }}
                  domain={[-1, 1]}
                />
                <YAxis
                  type="category"
                  dataKey="dimension"
                  tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }}
                  width={55}
                />
                <ReferenceLine x={0} stroke="oklch(0.35 0.04 275)" />
                <Bar dataKey="delta" radius={[0, 4, 4, 0]} barSize={14}>
                  {result.behaviorShifts.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.delta >= 0
                          ? "oklch(0.6 0.15 280)"
                          : "oklch(0.6 0.15 340)"
                      }
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}) {
  return (
    <Card className="border-border/50 p-3 text-center">
      <div className="flex items-center justify-center gap-1">
        {trend === "up" && (
          <TrendingUp className="h-3 w-3 text-emerald-400" />
        )}
        {trend === "down" && (
          <TrendingDown className="h-3 w-3 text-red-400" />
        )}
        <span
          className={cn(
            "font-mono text-lg font-bold",
            trend === "up" && "text-emerald-400",
            trend === "down" && "text-red-400",
            trend === "neutral" && "text-foreground"
          )}
        >
          {value}
        </span>
      </div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </Card>
  );
}
