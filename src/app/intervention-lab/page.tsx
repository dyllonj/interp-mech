"use client";

import { useState, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SAEFeatureExplorer } from "@/components/intervention-lab/sae-feature-explorer";
import { FeatureDetailPanel } from "@/components/intervention-lab/feature-detail-panel";
import { ActivationSteeringForm } from "@/components/intervention-lab/activation-steering-form";
import { TraceComparison } from "@/components/intervention-lab/trace-comparison";
import { feature30939 } from "@/data";
import type { SAEFeature, InterventionResult, InterventionMethod } from "@/types";
import { api, subscribeExperimentProgress } from "@/lib/api-client";
import type { ModelStatus } from "@/lib/api-client";
import { FlaskConical, Wifi, WifiOff, Loader2 } from "lucide-react";

export default function InterventionLabPage() {
  const [selectedFeature, setSelectedFeature] = useState<SAEFeature | null>(
    feature30939
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<InterventionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  // Check model status on mount
  useEffect(() => {
    api.models.status().then(setModelStatus).catch(() => {});
    const interval = setInterval(() => {
      api.models.status().then(setModelStatus).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunExperiment = useCallback(
    async (config: {
      layer: number;
      featureIndex: number;
      coefficient: number;
      method: InterventionMethod;
      prompt: string;
    }) => {
      setIsRunning(true);
      setError(null);
      setProgress("Sending request...");

      // Subscribe to progress events
      const unsub = subscribeExperimentProgress(
        (data) => {
          setProgress(
            `Prompt ${data.prompt}/${data.total}: ${data.stage}`
          );
        },
        () => {
          setProgress(null);
        }
      );

      try {
        const response = await api.interventions.run({
          layer: config.layer,
          featureIndex: config.featureIndex,
          coefficient: config.coefficient,
          method: config.method,
          prompt: config.prompt,
          maxNewTokens: 512,
        });

        // Map backend response to frontend InterventionResult
        const interventionResult: InterventionResult = {
          id: `result-${Date.now()}`,
          configId: `config-${Date.now()}`,
          baselineTrace: "",
          steeredTrace: "",
          baselineOutput: response.baseline_text,
          steeredOutput: response.steered_text,
          accuracyDelta: 0,
          behaviorShifts: [
            {
              dimension: "Length",
              baseline: Number(response.metrics.baseline_length) || 0,
              steered: Number(response.metrics.steered_length) || 0,
              delta: Number(response.metrics.length_delta) || 0,
            },
          ],
          personaShifts: [],
          timestamp: new Date().toISOString(),
        };

        setResult(interventionResult);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        unsub();
        setIsRunning(false);
        setProgress(null);
      }
    },
    []
  );

  const isBackendConnected = modelStatus !== null;
  const isModelLoaded = modelStatus?.state === "ready";

  return (
    <div className="flex h-full">
      {/* Left: Feature Explorer */}
      <div className="w-[300px] shrink-0 border-r border-border/50 bg-card/30">
        <SAEFeatureExplorer
          selectedFeature={selectedFeature}
          onSelectFeature={setSelectedFeature}
        />
      </div>

      {/* Center: Configuration & Results */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/50 px-6 py-3">
            <FlaskConical className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Intervention Lab
            </h2>

            {/* Model status indicator */}
            <div className="ml-auto flex items-center gap-2">
              {isBackendConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-emerald-400" />
                  <Badge
                    variant="outline"
                    className={
                      isModelLoaded
                        ? "border-emerald-500/30 text-emerald-400 text-[9px]"
                        : "border-amber-500/30 text-amber-400 text-[9px]"
                    }
                  >
                    {modelStatus.state === "ready"
                      ? `${modelStatus.model_name?.split("/").pop()} (${modelStatus.device})`
                      : modelStatus.state === "loading"
                        ? "Loading model..."
                        : "Model not loaded"}
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Backend offline
                  </span>
                </>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* Feature Detail */}
              {selectedFeature && (
                <FeatureDetailPanel feature={selectedFeature} />
              )}

              {/* Steering Form */}
              <ActivationSteeringForm
                selectedFeature={selectedFeature}
                onSubmit={handleRunExperiment}
                isRunning={isRunning}
              />

              {/* Progress */}
              {progress && (
                <div className="flex items-center gap-2 rounded-md bg-primary/5 border border-primary/20 px-4 py-3">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span className="text-xs text-primary">{progress}</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Results */}
              {result && <TraceComparison result={result} />}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
