"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { paperFindings } from "@/data/paper-evidence";
import { EvidenceCard } from "./evidence-card";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export function PaperEvidenceFeed() {
  const [search, setSearch] = useState("");

  const filtered = paperFindings.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.summary.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Paper Evidence
        </h3>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {filtered.length} findings
        </span>
      </div>
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 bg-muted/30 pl-8 text-xs"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 pb-4">
          {filtered.map((finding) => (
            <EvidenceCard key={finding.id} finding={finding} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No findings match your search.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
