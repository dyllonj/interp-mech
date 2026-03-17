"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { PersonaProfile } from "@/types";

interface PersonaRadarProps {
  persona: PersonaProfile;
  size?: number;
}

export function PersonaRadar({ persona, size = 200 }: PersonaRadarProps) {
  const data = [
    { trait: "O", value: persona.bigFive.openness, fullName: "Openness" },
    {
      trait: "C",
      value: persona.bigFive.conscientiousness,
      fullName: "Conscientiousness",
    },
    {
      trait: "E",
      value: persona.bigFive.extraversion,
      fullName: "Extraversion",
    },
    {
      trait: "A",
      value: persona.bigFive.agreeableness,
      fullName: "Agreeableness",
    },
    {
      trait: "N",
      value: persona.bigFive.neuroticism,
      fullName: "Neuroticism",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid
          stroke="oklch(0.35 0.04 275)"
          strokeDasharray="3 3"
        />
        <PolarAngleAxis
          dataKey="trait"
          tick={{ fill: "oklch(0.65 0.03 280)", fontSize: 11 }}
        />
        <PolarRadiusAxis
          domain={[0, 1]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name={persona.name}
          dataKey="value"
          stroke={persona.color}
          fill={persona.color}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
