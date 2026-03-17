"use client";

import { useEffect, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TraceViewer } from "@/components/discourse-map/trace-viewer";
import { SegmentAnnotation } from "@/components/discourse-map/segment-annotation";
import { PersonaPanel } from "@/components/discourse-map/persona-panel";
import { BalesIPAChart } from "@/components/discourse-map/bales-ipa-chart";
import { BehaviorTimeline } from "@/components/discourse-map/behavior-timeline";
import { useTraceStore } from "@/stores";
import { mockTraces } from "@/data";
import { api } from "@/lib/api-client";
import type { ReasoningTrace } from "@/types";
import { Network, Send, Loader2 } from "lucide-react";

export default function DiscourseMapPage() {
  const {
    traces,
    setTraces,
    addTrace,
    activeTraceId,
    setActiveTraceId,
    selectedSegmentId,
    setSelectedSegmentId,
    highlightedPersona,
    setHighlightedPersona,
    getActiveTrace,
  } = useTraceStore();

  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  useEffect(() => {
    if (traces.length === 0) {
      setTraces(mockTraces);
      setActiveTraceId(mockTraces[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const response = await api.traces.analyze(inputText);

      // Map bales macro to frontend bales category
      const macroToCategory = (macro: string): string => {
        const map: Record<string, string> = {
          "Positive reactions": "positive-socioemotional",
          "Attempted answers": "task-attempted-answers",
          "Questions": "task-questions",
          "Negative reactions": "negative-socioemotional",
        };
        return map[macro] ?? "task-attempted-answers";
      };

      // Map bales name to frontend bales role
      const nameToRole = (name: string): string => {
        return name.toLowerCase().replace(/\s+/g, "-").replace(/for-/g, "");
      };

      // Convert backend response to frontend ReasoningTrace
      const now = Date.now();
      const newTrace: ReasoningTrace = {
        id: `trace-live-${now}`,
        prompt: inputText.slice(0, 80) + (inputText.length > 80 ? "..." : ""),
        modelId: "live-analysis",
        segments: response.trace.segments.map((seg, i) => {
          const bales = response.bales.classifications[i];
          return {
            id: `seg-live-${now}-${i}`,
            text: seg.text,
            behaviorType: seg.behavior as ReasoningTrace["segments"][0]["behaviorType"],
            balesRole: (bales ? nameToRole(bales.category.name) : "gives-orientation") as ReasoningTrace["segments"][0]["balesRole"],
            balesCategory: (bales ? macroToCategory(bales.category.macro) : "task-attempted-answers") as ReasoningTrace["segments"][0]["balesCategory"],
            personaAttribution: "",
            confidence: bales?.confidence ?? 0.3,
            startToken: 0,
            endToken: seg.text.length,
          };
        }),
        personas: response.personas.personas.map((p, i) => ({
          id: `persona-live-${i}`,
          name: p.name,
          description: `Dominant traits: ${Object.entries(p.scores)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 3)
            .map(([k]) => k)
            .join(", ")}`,
          bigFive: {
            openness: p.scores.openness,
            conscientiousness: p.scores.conscientiousness,
            extraversion: p.scores.extraversion,
            agreeableness: p.scores.agreeableness,
            neuroticism: p.scores.neuroticism,
          },
          expertise: Object.entries(p.scores)
            .filter(([, v]) => (v as number) > 0.3)
            .map(([k]) => k),
          communicationStyle: Object.entries(p.scores)
            .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] ?? "analytical",
          color: ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e"][i % 5],
        })),
        behaviors: [
          ...new Set(
            response.trace.segments
              .map((s) => s.behavior)
              .filter((b) => b !== "neutral")
          ),
        ] as ReasoningTrace["behaviors"],
        totalTokens: inputText.split(/\s+/).length,
        timestamp: new Date().toISOString(),
      };

      addTrace(newTrace);
      setActiveTraceId(newTrace.id);
      setInputText("");
    } catch (err) {
      setAnalyzeError(
        err instanceof Error ? err.message : "Failed to analyze trace"
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText, addTrace, setActiveTraceId]);

  const activeTrace = getActiveTrace();

  if (!activeTrace) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Network className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-medium text-foreground">
            Loading traces...
          </h2>
        </div>
      </div>
    );
  }

  const selectedSegment = activeTrace.segments.find(
    (s) => s.id === selectedSegmentId
  );
  const selectedPersona = selectedSegment
    ? activeTrace.personas.find(
        (p) => p.id === selectedSegment.personaAttribution
      )
    : undefined;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-3">
        <Network className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Discourse Map</h2>
        <div className="ml-4">
          <Select
            value={activeTraceId ?? undefined}
            onValueChange={(v) => {
              setActiveTraceId(v);
              setSelectedSegmentId(null);
              setHighlightedPersona(null);
            }}
          >
            <SelectTrigger className="h-7 w-[300px] text-xs">
              <SelectValue placeholder="Select a trace..." />
            </SelectTrigger>
            <SelectContent>
              {traces.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.prompt.slice(0, 60)}...
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {activeTrace.modelId}
        </span>
      </div>

      {/* Text input for live analysis */}
      <div className="border-b border-border/50 px-6 py-3">
        <div className="flex gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a chain-of-thought trace here to analyze..."
            rows={2}
            className="flex-1 text-xs resize-none"
          />
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            size="sm"
            className="gap-1.5 self-end"
          >
            {isAnalyzing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            Analyze
          </Button>
        </div>
        {analyzeError && (
          <p className="mt-1 text-[10px] text-red-400">{analyzeError}</p>
        )}
      </div>

      {/* Behavior Timeline */}
      <div className="border-b border-border/50 px-6 py-3">
        <BehaviorTimeline
          segments={activeTrace.segments}
          selectedSegmentId={selectedSegmentId}
          onSelectSegment={setSelectedSegmentId}
          totalTokens={activeTrace.totalTokens}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Trace Viewer */}
        <ScrollArea className="flex-1 p-6">
          <TraceViewer
            trace={activeTrace}
            selectedSegmentId={selectedSegmentId}
            highlightedPersona={highlightedPersona}
            onSelectSegment={setSelectedSegmentId}
          />
        </ScrollArea>

        {/* Right: Analysis Panel */}
        <div className="w-[380px] shrink-0 border-l border-border/50 bg-card/30">
          <ScrollArea className="h-full p-4">
            <div className="space-y-6">
              {/* Selected segment detail */}
              {selectedSegment && (
                <SegmentAnnotation
                  segment={selectedSegment}
                  persona={selectedPersona}
                />
              )}

              {/* Personas */}
              <PersonaPanel
                personas={activeTrace.personas}
                segments={activeTrace.segments}
                highlightedPersona={highlightedPersona}
                onHighlightPersona={setHighlightedPersona}
              />

              {/* Bales IPA */}
              <BalesIPAChart segments={activeTrace.segments} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
