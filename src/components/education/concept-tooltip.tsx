"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { concepts } from "@/data";
import { useLearningStore } from "@/stores";
import { cn } from "@/lib/utils";
import { BookOpen, ExternalLink } from "lucide-react";

interface ConceptTooltipProps {
  conceptId: string;
  children: React.ReactNode;
  className?: string;
}

export function ConceptTooltip({
  conceptId,
  children,
  className,
}: ConceptTooltipProps) {
  const { learningModeEnabled, markConceptViewed, isConceptViewed } =
    useLearningStore();
  const [open, setOpen] = useState(false);

  const concept = concepts.find((c) => c.id === conceptId);
  if (!concept || !learningModeEnabled) {
    return <>{children}</>;
  }

  const viewed = isConceptViewed(conceptId);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !viewed) {
      markConceptViewed(conceptId);
    }
  };

  const relatedConcepts = concept.relatedConcepts
    .map((id) => concepts.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger
        render={
          <span
            className={cn(
              "cursor-help border-b border-dashed border-primary/40 text-primary/80 transition-colors hover:border-primary hover:text-primary",
              viewed && "border-primary/20 text-primary/60",
              className
            )}
          />
        }
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top">
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {concept.term}
              </h4>
              <Badge variant="outline" className="mt-1 text-[9px]">
                {concept.difficulty}
              </Badge>
            </div>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {concept.fullExplanation}
          </p>

          {concept.paperReference && (
            <div className="rounded-md bg-muted/30 px-2.5 py-1.5">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground/70">
                  {concept.paperReference.title}
                </span>{" "}
                ({concept.paperReference.authors.join(", ")},{" "}
                {concept.paperReference.year})
              </p>
            </div>
          )}

          {relatedConcepts.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] text-muted-foreground">
                Related:
              </p>
              <div className="flex flex-wrap gap-1">
                {relatedConcepts.map(
                  (rc) =>
                    rc && (
                      <Badge
                        key={rc.id}
                        variant="outline"
                        className="text-[9px]"
                      >
                        {rc.term}
                      </Badge>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
