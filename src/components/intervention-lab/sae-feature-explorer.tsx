"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockSAEFeatures, featureCategories } from "@/data";
import { api } from "@/lib/api-client";
import type { FeatureSummary } from "@/lib/api-client";
import type { SAEFeature } from "@/types";
import { Search, Star, Zap, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryBadgeColors: Record<string, string> = {
  persona: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  reasoning: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  factual: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  stylistic: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  emotional: "bg-red-500/15 text-red-400 border-red-500/25",
  structural: "bg-neutral-500/15 text-neutral-400 border-neutral-500/25",
  unknown: "bg-neutral-500/15 text-neutral-400 border-neutral-500/25",
  sentiment: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  syntax: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  hedging: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  negation: "bg-red-500/15 text-red-400 border-red-500/25",
  question: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  emphasis: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  transition: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

interface SAEFeatureExplorerProps {
  selectedFeature: SAEFeature | null;
  onSelectFeature: (feature: SAEFeature) => void;
}

export function SAEFeatureExplorer({
  selectedFeature,
  onSelectFeature,
}: SAEFeatureExplorerProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [apiFeatures, setApiFeatures] = useState<FeatureSummary[] | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeatures, setTotalFeatures] = useState(0);

  // Try to fetch features from API
  const fetchFeatures = useCallback(async () => {
    try {
      const result = await api.sae.features({
        search: search || undefined,
        category: categoryFilter === "all" ? undefined : categoryFilter,
        page,
        limit: 50,
      });
      setApiFeatures(result.features);
      setTotalPages(result.total_pages);
      setTotalFeatures(result.total);
      setIsApiConnected(true);
    } catch {
      setIsApiConnected(false);
      setApiFeatures(null);
    }
  }, [search, categoryFilter, page]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // Use API features if available, otherwise fall back to mock
  const displayFeatures = apiFeatures
    ? apiFeatures.map((f) => ({
        ...f,
        // Map API feature to display format
        topTokens: [] as Array<{ token: string; activation: number }>,
      }))
    : mockSAEFeatures.filter((f) => {
        if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            f.label.toLowerCase().includes(q) ||
            f.index.toString().includes(q) ||
            f.description.toLowerCase().includes(q)
          );
        }
        return true;
      });

  const handleSelectFeature = async (feature: { index: number; label: string; category: string }) => {
    // Try to fetch full feature detail from API
    try {
      const detail = await api.sae.feature(feature.index);
      const saeFeature: SAEFeature = {
        index: detail.index,
        label: detail.label,
        description: detail.description,
        category: detail.category as SAEFeature["category"],
        activationStats: {
          mean: detail.mean_activation,
          std: 0,
          max: detail.max_activation,
          sparsity: 0,
          frequency: 0,
        },
        topTokens: detail.top_tokens.map((t) => ({
          token: t.token,
          activation: t.activation,
        })),
        topContexts: [],
        layer: 15,
        correlatedFeatures: [],
      };
      onSelectFeature(saeFeature);
    } catch {
      // Fall back to mock feature if API fails
      const mockFeature = mockSAEFeatures.find((f) => f.index === feature.index);
      if (mockFeature) {
        onSelectFeature(mockFeature);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">SAE Features</h3>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          {isApiConnected ? (
            <>
              <Wifi className="h-2.5 w-2.5 text-emerald-400" />
              {totalFeatures}
            </>
          ) : (
            <>
              <WifiOff className="h-2.5 w-2.5" />
              {displayFeatures.length}
            </>
          )}
          {" features"}
        </span>
      </div>
      <div className="space-y-2 px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by index, label..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-8 bg-muted/30 pl-8 text-xs"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            if (v) {
              setCategoryFilter(v);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {featureCategories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {displayFeatures.map((feature) => {
            const isFeatured = feature.index === 30939;
            const isSelected = selectedFeature?.index === feature.index;

            return (
              <button
                key={feature.index}
                onClick={() => handleSelectFeature(feature)}
                className={cn(
                  "w-full rounded-lg border border-transparent px-3 py-2.5 text-left transition-all hover:bg-muted/30",
                  isSelected && "border-primary/30 bg-primary/5",
                  isFeatured && !isSelected && "border-amber-500/20 bg-amber-500/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    #{feature.index}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[8px]",
                      categoryBadgeColors[feature.category] ?? categoryBadgeColors.unknown
                    )}
                  >
                    {feature.category}
                  </Badge>
                  {isFeatured && (
                    <Badge className="gap-1 bg-amber-500/20 text-[8px] text-amber-400 border-amber-500/30">
                      <Star className="h-2.5 w-2.5" />
                      Paper
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-foreground">
                  {feature.label}
                </p>
                {"topTokens" in feature && feature.topTokens.length > 0 && (
                  <div className="mt-1.5 flex gap-1">
                    {feature.topTokens.slice(0, 5).map((t) => (
                      <span
                        key={t.token}
                        className="rounded bg-muted/50 px-1 py-0.5 font-mono text-[9px] text-muted-foreground"
                      >
                        {t.token}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {/* Pagination for API features */}
        {isApiConnected && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pb-4">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="rounded px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted/30 disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-[10px] text-muted-foreground">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="rounded px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted/30 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
