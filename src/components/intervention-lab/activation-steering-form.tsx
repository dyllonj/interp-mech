"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SAEFeature, InterventionMethod } from "@/types";
import { Play, Loader2 } from "lucide-react";

const methods: { value: InterventionMethod; label: string }[] = [
  { value: "add", label: "Activation Addition" },
  { value: "clamp", label: "Feature Clamping" },
  { value: "scale", label: "Feature Scaling" },
  { value: "ablate", label: "Ablation" },
  { value: "patch", label: "Activation Patching" },
];

interface ActivationSteeringFormProps {
  selectedFeature: SAEFeature | null;
  onSubmit: (config: {
    layer: number;
    featureIndex: number;
    coefficient: number;
    method: InterventionMethod;
    prompt: string;
  }) => void;
  isRunning: boolean;
}

export function ActivationSteeringForm({
  selectedFeature,
  onSubmit,
  isRunning,
}: ActivationSteeringFormProps) {
  const [layer, setLayer] = useState(selectedFeature?.layer ?? 16);
  const [coefficient, setCoefficient] = useState(10);
  const [method, setMethod] = useState<InterventionMethod>("add");
  const [prompt, setPrompt] = useState(
    "Using the numbers 25, 50, 75, 100, 3, 6, find a way to make 952."
  );

  const handleSubmit = () => {
    if (!selectedFeature) return;
    onSubmit({
      layer,
      featureIndex: selectedFeature.index,
      coefficient,
      method,
      prompt,
    });
  };

  return (
    <Card className="border-border/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Steering Configuration
      </h3>
      <div className="space-y-4">
        {/* Feature info */}
        <div className="rounded-md bg-muted/30 px-3 py-2">
          <span className="text-[10px] text-muted-foreground">
            Selected Feature:
          </span>
          <p className="text-xs font-medium text-foreground">
            {selectedFeature
              ? `#${selectedFeature.index} — ${selectedFeature.label}`
              : "None selected"}
          </p>
        </div>

        {/* Layer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Layer</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {layer}
            </span>
          </div>
          <Slider
            value={[layer]}
            onValueChange={(v) => setLayer(Array.isArray(v) ? v[0] : v)}
            min={0}
            max={31}
            step={1}
          />
        </div>

        {/* Coefficient */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Coefficient</Label>
            <span className="font-mono text-xs text-muted-foreground">
              {coefficient > 0 ? `+${coefficient}` : coefficient}
            </span>
          </div>
          <Slider
            value={[coefficient]}
            onValueChange={(v) => setCoefficient(Array.isArray(v) ? v[0] : v)}
            min={-15}
            max={15}
            step={0.5}
          />
        </div>

        {/* Method */}
        <div className="space-y-1.5">
          <Label className="text-xs">Method</Label>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as InterventionMethod)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prompt */}
        <div className="space-y-1.5">
          <Label className="text-xs">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedFeature || isRunning}
          className="w-full gap-2"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running Experiment...
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Run Intervention
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
