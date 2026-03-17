"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuidedTutorial } from "@/components/education/guided-tutorial";
import { InfoPanel } from "@/components/education/info-panel";
import { useLearningStore } from "@/stores";
import { concepts, tutorials } from "@/data";
import type { DifficultyLevel } from "@/types";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const difficultyColors: Record<DifficultyLevel, string> = {
  beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  intermediate: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  advanced: "bg-violet-500/15 text-violet-400 border-violet-500/25",
};

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const {
    difficultyFilter,
    setDifficultyFilter,
    activeTutorialId,
    setActiveTutorial,
    isTutorialCompleted,
    isConceptViewed,
    viewedConcepts,
  } = useLearningStore();

  const filteredConcepts = concepts.filter((c) => {
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter)
      return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.term.toLowerCase().includes(q) ||
        c.shortExplanation.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group concepts by category
  const categories = new Map<string, typeof filteredConcepts>();
  for (const c of filteredConcepts) {
    const group = categories.get(c.category) ?? [];
    group.push(c);
    categories.set(c.category, group);
  }

  const activeTutorial = tutorials.find((t) => t.id === activeTutorialId);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-3">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Learn</h2>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {viewedConcepts.length}/{concepts.length} concepts viewed
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="concepts">
            <div className="flex items-center gap-3 border-b border-border/50 px-6 py-2">
              <TabsList>
                <TabsTrigger value="concepts">Concepts</TabsTrigger>
                <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="concepts" className="mt-0 h-[calc(100%-48px)]">
              <div className="flex items-center gap-3 border-b border-border/50 px-6 py-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search concepts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 bg-muted/30 pl-8 text-xs"
                  />
                </div>
                <div className="flex gap-1">
                  {(
                    ["all", "beginner", "intermediate", "advanced"] as const
                  ).map((level) => (
                    <Button
                      key={level}
                      variant={difficultyFilter === level ? "default" : "ghost"}
                      size="sm"
                      className="h-7 text-[10px]"
                      onClick={() => setDifficultyFilter(level)}
                    >
                      {level === "all"
                        ? "All"
                        : level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-48px)] px-6 py-4">
                <div className="space-y-6">
                  {Array.from(categories.entries()).map(
                    ([category, conceptList]) => (
                      <div key={category}>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {category}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {conceptList.map((concept) => {
                            const viewed = isConceptViewed(concept.id);
                            return (
                              <Card
                                key={concept.id}
                                className={cn(
                                  "cursor-pointer border-border/50 p-3 transition-all hover:border-primary/30 neural-glow",
                                  viewed && "border-primary/10"
                                )}
                                onClick={() => {
                                  setSelectedConceptId(concept.id);
                                  setInfoPanelOpen(true);
                                }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-medium text-foreground">
                                        {concept.term}
                                      </h4>
                                      {viewed && (
                                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                                      )}
                                    </div>
                                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                                      {concept.shortExplanation}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "ml-2 shrink-0 text-[8px]",
                                      difficultyColors[concept.difficulty]
                                    )}
                                  >
                                    {concept.difficulty}
                                  </Badge>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="tutorials"
              className="mt-0 h-[calc(100%-48px)]"
            >
              <ScrollArea className="h-full px-6 py-4">
                <div className="mx-auto max-w-2xl space-y-4">
                  {tutorials.map((tutorial) => {
                    const completed = isTutorialCompleted(tutorial.id);
                    const isActive = activeTutorialId === tutorial.id;

                    return (
                      <div key={tutorial.id}>
                        {!isActive ? (
                          <Card
                            className={cn(
                              "cursor-pointer border-border/50 p-4 transition-all hover:border-primary/30 neural-glow",
                              completed && "opacity-70"
                            )}
                            onClick={() => setActiveTutorial(tutorial.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold text-foreground">
                                    {tutorial.title}
                                  </h3>
                                  {completed && (
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                  )}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {tutorial.description}
                                </p>
                                <div className="mt-2 flex items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[9px]",
                                      difficultyColors[tutorial.difficulty]
                                    )}
                                  >
                                    {tutorial.difficulty}
                                  </Badge>
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {tutorial.estimatedMinutes} min
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {tutorial.steps.length} steps
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </Card>
                        ) : (
                          <AnimatePresence>
                            <GuidedTutorial
                              tutorial={tutorial}
                              onClose={() => setActiveTutorial(null)}
                            />
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanel
        conceptId={selectedConceptId}
        open={infoPanelOpen}
        onOpenChange={setInfoPanelOpen}
      />
    </div>
  );
}
