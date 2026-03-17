"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { concepts } from "@/data";
import type { ConceptDefinition } from "@/types";
import { BookOpen, ExternalLink } from "lucide-react";

interface InfoPanelProps {
  conceptId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoPanel({ conceptId, open, onOpenChange }: InfoPanelProps) {
  const concept = conceptId
    ? concepts.find((c) => c.id === conceptId)
    : null;

  const relatedConcepts = concept
    ? concept.relatedConcepts
        .map((id) => concepts.find((c) => c.id === id))
        .filter(Boolean) as ConceptDefinition[]
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] p-0">
        {concept && (
          <>
            <SheetHeader className="border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <SheetTitle className="text-base">{concept.term}</SheetTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {concept.difficulty}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {concept.category}
                </Badge>
              </div>
            </SheetHeader>

            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-6 p-6">
                {/* Short explanation */}
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    In brief
                  </h4>
                  <p className="text-sm font-medium text-foreground">
                    {concept.shortExplanation}
                  </p>
                </div>

                <Separator />

                {/* Full explanation */}
                <div>
                  <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Full explanation
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {concept.fullExplanation}
                  </p>
                </div>

                {/* Paper reference */}
                {concept.paperReference && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground">
                        Key paper
                      </h4>
                      <div className="rounded-lg border border-border/50 p-3">
                        <p className="text-sm font-medium text-foreground">
                          {concept.paperReference.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {concept.paperReference.authors.join(", ")} (
                          {concept.paperReference.year},{" "}
                          {concept.paperReference.venue})
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Related concepts */}
                {relatedConcepts.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                        Related concepts
                      </h4>
                      <div className="space-y-2">
                        {relatedConcepts.map((rc) => (
                          <div
                            key={rc.id}
                            className="rounded-md bg-muted/30 px-3 py-2"
                          >
                            <p className="text-xs font-medium text-foreground">
                              {rc.term}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {rc.shortExplanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
