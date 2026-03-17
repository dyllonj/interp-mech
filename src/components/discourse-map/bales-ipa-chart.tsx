"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TraceSegment, BalesRole } from "@/types";

const balesRoleLabels: Record<BalesRole, string> = {
  "shows-solidarity": "Solidarity",
  "shows-tension-release": "Tension Release",
  agrees: "Agrees",
  "gives-suggestion": "Suggestion",
  "gives-opinion": "Opinion",
  "gives-orientation": "Orientation",
  "asks-orientation": "Asks Orient.",
  "asks-opinion": "Asks Opinion",
  "asks-suggestion": "Asks Suggest.",
  disagrees: "Disagrees",
  "shows-tension": "Tension",
  "shows-antagonism": "Antagonism",
};

const balesRoleColors: Record<BalesRole, string> = {
  "shows-solidarity": "#10b981",
  "shows-tension-release": "#34d399",
  agrees: "#6ee7b7",
  "gives-suggestion": "#7c3aed",
  "gives-opinion": "#8b5cf6",
  "gives-orientation": "#a78bfa",
  "asks-orientation": "#06b6d4",
  "asks-opinion": "#22d3ee",
  "asks-suggestion": "#67e8f9",
  disagrees: "#f43f5e",
  "shows-tension": "#fb7185",
  "shows-antagonism": "#fda4af",
};

interface BalesIPAChartProps {
  segments: TraceSegment[];
}

export function BalesIPAChart({ segments }: BalesIPAChartProps) {
  const roleCounts = new Map<BalesRole, number>();
  for (const seg of segments) {
    roleCounts.set(seg.balesRole, (roleCounts.get(seg.balesRole) ?? 0) + 1);
  }

  const allRoles = Object.keys(balesRoleLabels) as BalesRole[];
  const data = allRoles.map((role) => ({
    role,
    label: balesRoleLabels[role],
    count: roleCounts.get(role) ?? 0,
    color: balesRoleColors[role],
  }));

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Bales IPA Distribution
      </h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 16 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }}
            width={75}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((entry) => (
              <Cell key={entry.role} fill={entry.color} fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
