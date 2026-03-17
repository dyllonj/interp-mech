"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHypothesisStore } from "@/stores";
import { PriorityBadge } from "./priority-badge";
import { StatusBadge } from "./status-badge";
import { NewHypothesisDialog } from "./new-hypothesis-dialog";
import type { HypothesisStatus } from "@/types";
import {
  Search,
  ArrowUpDown,
  LinkIcon,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions: { value: HypothesisStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "testing", label: "Testing" },
  { value: "supported", label: "Supported" },
  { value: "refuted", label: "Refuted" },
  { value: "archived", label: "Archived" },
];

const methodLabels: Record<string, string> = {
  activation_patching: "Activation Patching",
  causal_tracing: "Causal Tracing",
  sae_steering: "SAE Steering",
  ablation: "Ablation",
  logit_lens: "Logit Lens",
  probing: "Probing",
  direct_observation: "Direct Observation",
};

export function HypothesisTable() {
  const {
    filterStatus,
    searchQuery,
    selectedId,
    setFilterStatus,
    setSearchQuery,
    setSelectedId,
    deleteHypothesis,
    getFilteredHypotheses,
  } = useHypothesisStore();

  const hypotheses = getFilteredHypotheses();

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search hypotheses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 bg-muted/30 pl-8 text-xs"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) =>
            setFilterStatus(v as HypothesisStatus | "all")
          }
        >
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <NewHypothesisDialog />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {hypotheses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <ArrowUpDown className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              No hypotheses yet
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Create your first hypothesis to begin tracking interpretability
              research questions.
            </p>
            <div className="mt-4">
              <NewHypothesisDialog />
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] text-[10px] uppercase tracking-wider">
                  Priority
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-wider">
                  Hypothesis
                </TableHead>
                <TableHead className="w-[120px] text-[10px] uppercase tracking-wider">
                  Target
                </TableHead>
                <TableHead className="w-[120px] text-[10px] uppercase tracking-wider">
                  Persona
                </TableHead>
                <TableHead className="w-[130px] text-[10px] uppercase tracking-wider">
                  Method
                </TableHead>
                <TableHead className="w-[80px] text-[10px] uppercase tracking-wider">
                  Evidence
                </TableHead>
                <TableHead className="w-[90px] text-[10px] uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {hypotheses.map((h) => (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`group cursor-pointer border-b border-border/30 transition-colors hover:bg-muted/30 ${
                      selectedId === h.id ? "bg-muted/50" : ""
                    }`}
                    onClick={() =>
                      setSelectedId(selectedId === h.id ? null : h.id)
                    }
                  >
                    <TableCell>
                      <PriorityBadge priority={h.priority} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {h.title}
                        </p>
                        {h.variable && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Variable: {h.variable}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {h.targetComponent}
                        {h.targetLayer !== undefined && (
                          <Badge
                            variant="outline"
                            className="ml-1.5 text-[9px]"
                          >
                            L{h.targetLayer}
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {h.predictedPersona || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-normal"
                      >
                        {methodLabels[h.validationMethod] ||
                          h.validationMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <LinkIcon className="h-3 w-3" />
                        {h.evidenceLinks.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={h.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHypothesis(h.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
