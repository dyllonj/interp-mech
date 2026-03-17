"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SAEFeature } from "@/types";

interface FeatureDetailPanelProps {
  feature: SAEFeature;
}

export function FeatureDetailPanel({ feature }: FeatureDetailPanelProps) {
  const statsData = [
    { name: "Mean", value: feature.activationStats.mean },
    { name: "Std", value: feature.activationStats.std },
    { name: "Max", value: feature.activationStats.max },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          #{feature.index}: {feature.label}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Mean Act." value={feature.activationStats.mean.toFixed(3)} />
        <StatCard label="Std Dev" value={feature.activationStats.std.toFixed(3)} />
        <StatCard label="Max Act." value={feature.activationStats.max.toFixed(2)} />
        <StatCard
          label="Sparsity"
          value={`${(feature.activationStats.sparsity * 100).toFixed(1)}%`}
        />
      </div>

      {/* Activation Distribution */}
      <Card className="border-border/50 p-3">
        <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
          Top Token Activations
        </h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={feature.topTokens}
            margin={{ left: 4, right: 4, bottom: 4 }}
          >
            <XAxis
              dataKey="token"
              tick={{ fontSize: 9, fill: "oklch(0.65 0.03 280)" }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "oklch(0.65 0.03 280)" }}
              width={30}
            />
            <Bar dataKey="activation" radius={[4, 4, 0, 0]} barSize={16}>
              {feature.topTokens.map((_, i) => (
                <Cell
                  key={i}
                  fill={`oklch(${0.5 + (1 - i / feature.topTokens.length) * 0.25} 0.18 280)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Related Features */}
      {feature.correlatedFeatures.length > 0 && (
        <div>
          <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground">
            Correlated Features
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {feature.correlatedFeatures.map((idx) => (
              <Badge key={idx} variant="outline" className="font-mono text-[10px]">
                #{idx}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Layer info */}
      <div className="rounded-md bg-muted/30 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Layer</span>
          <span className="font-mono text-xs font-medium text-foreground">
            {feature.layer}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Frequency</span>
          <span className="font-mono text-xs font-medium text-foreground">
            {(feature.activationStats.frequency * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
      <p className="font-mono text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}
