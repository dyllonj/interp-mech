"use client";

import { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { mockExperimentRuns } from "@/data/mock-results";
import type { ExperimentRun } from "@/data/mock-results";
import { useExperimentStore } from "@/stores";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Search,
  Download,
  FileJson,
  FileSpreadsheet,
  Activity,
  TrendingUp,
  TrendingDown,
  Loader2,
  CheckCircle,
} from "lucide-react";

type SortField = "runNumber" | "coefficient" | "accuracy" | "feature" | "layer";

export default function ResultsPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("runNumber");
  const [sortAsc, setSortAsc] = useState(true);
  const { results } = useExperimentStore();

  // Combine mock data with any real results from the store
  const allRuns: ExperimentRun[] = useMemo(() => {
    const storeRuns: ExperimentRun[] = results.map((r, i) => ({
      id: r.id,
      runNumber: mockExperimentRuns.length + i + 1,
      config: {
        id: r.configId,
        name: `Live Run ${i + 1}`,
        layer: 15,
        featureIndex: 0,
        coefficient: 0,
        method: "add" as const,
        prompt: "",
        description: "",
      },
      result: r,
    }));
    return [...mockExperimentRuns, ...storeRuns];
  }, [results]);

  const filteredRuns = useMemo(() => {
    let runs = [...allRuns];

    if (search) {
      const q = search.toLowerCase();
      runs = runs.filter(
        (r) =>
          r.config.name.toLowerCase().includes(q) ||
          r.config.featureIndex.toString().includes(q) ||
          r.config.layer.toString().includes(q)
      );
    }

    runs.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "runNumber":
          cmp = a.runNumber - b.runNumber;
          break;
        case "coefficient":
          cmp = a.config.coefficient - b.config.coefficient;
          break;
        case "accuracy":
          cmp = a.result.accuracyDelta - b.result.accuracyDelta;
          break;
        case "feature":
          cmp = a.config.featureIndex - b.config.featureIndex;
          break;
        case "layer":
          cmp = a.config.layer - b.config.layer;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return runs;
  }, [allRuns, search, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Chart data: accuracy vs coefficient for feature 30939
  const doseResponseData = allRuns
    .filter(
      (r) => r.config.featureIndex === 30939 && r.config.layer === 16 && r.config.method === "add"
    )
    .map((r) => ({
      coefficient: r.config.coefficient,
      accuracy: (0.271 + r.result.accuracyDelta) * 100,
      run: r.config.name,
    }))
    .sort((a, b) => a.coefficient - b.coefficient);

  // Summary stats
  const avgDelta =
    filteredRuns.length > 0
      ? filteredRuns.reduce((sum, r) => sum + r.result.accuracyDelta, 0) /
        filteredRuns.length
      : 0;
  const bestRun = filteredRuns.length > 0
    ? filteredRuns.reduce(
        (best, r) =>
          r.result.accuracyDelta > best.result.accuracyDelta ? r : best,
        filteredRuns[0]
      )
    : null;

  // Export handlers
  const handleExportJSON = useCallback(() => {
    const data = JSON.stringify(filteredRuns, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRuns]);

  const handleExportCSV = useCallback(() => {
    const header = "Run,Feature,Layer,Coefficient,Method,Accuracy Delta,Date\n";
    const rows = filteredRuns
      .map(
        (r) =>
          `${r.runNumber},${r.config.featureIndex},${r.config.layer},${r.config.coefficient},${r.config.method},${r.result.accuracyDelta},${r.result.timestamp}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRuns]);

  const handleExportTSV = useCallback(() => {
    const header = "Run\tFeature\tLayer\tCoefficient\tMethod\tAccuracy Delta\tDate\n";
    const rows = filteredRuns
      .map(
        (r) =>
          `${r.runNumber}\t${r.config.featureIndex}\t${r.config.layer}\t${r.config.coefficient}\t${r.config.method}\t${r.result.accuracyDelta}\t${r.result.timestamp}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.tsv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredRuns]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-3">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">
          Results Dashboard
        </h2>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleExportJSON}>
            <FileJson className="h-3 w-3" />
            JSON
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleExportCSV}>
            <FileSpreadsheet className="h-3 w-3" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleExportTSV}>
            <Download className="h-3 w-3" />
            TSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview">
          <div className="border-b border-border/50 px-6 py-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">Experiment History</TabsTrigger>
              <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 h-[calc(100%-48px)]">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <SummaryCard
                    label="Total Experiments"
                    value={allRuns.length.toString()}
                    icon={<Activity className="h-4 w-4 text-primary" />}
                  />
                  <SummaryCard
                    label="Avg Accuracy Delta"
                    value={`${avgDelta > 0 ? "+" : ""}${(avgDelta * 100).toFixed(1)}%`}
                    icon={
                      avgDelta >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )
                    }
                  />
                  <SummaryCard
                    label="Best Run"
                    value={bestRun?.config.name ?? "—"}
                    icon={<CheckCircle className="h-4 w-4 text-emerald-400" />}
                  />
                  <SummaryCard
                    label="Best Delta"
                    value={`+${((bestRun?.result.accuracyDelta ?? 0) * 100).toFixed(1)}%`}
                    icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
                  />
                </div>

                {/* Dose-Response Chart */}
                <Card className="border-border/50 p-4">
                  <h3 className="mb-3 text-xs font-semibold text-muted-foreground">
                    Dose-Response: Feature 30939 Accuracy vs Steering Coefficient
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart
                      data={doseResponseData}
                      margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.28 0.04 275)"
                      />
                      <XAxis
                        dataKey="coefficient"
                        tick={{ fontSize: 11, fill: "oklch(0.65 0.03 280)" }}
                        label={{
                          value: "Steering Coefficient",
                          position: "insideBottom",
                          offset: -5,
                          style: { fontSize: 10, fill: "oklch(0.5 0.03 280)" },
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "oklch(0.65 0.03 280)" }}
                        label={{
                          value: "Accuracy (%)",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: 10, fill: "oklch(0.5 0.03 280)" },
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="oklch(0.7 0.18 280)"
                        strokeWidth={2}
                        dot={{
                          fill: "oklch(0.7 0.18 280)",
                          r: 4,
                          stroke: "oklch(0.13 0.025 275)",
                          strokeWidth: 2,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Scatter: All experiments */}
                <Card className="border-border/50 p-4">
                  <h3 className="mb-3 text-xs font-semibold text-muted-foreground">
                    All Experiments: Feature Index vs Accuracy Delta
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.28 0.04 275)"
                      />
                      <XAxis
                        type="number"
                        dataKey="feature"
                        name="Feature"
                        tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="delta"
                        name="Delta"
                        tick={{ fontSize: 10, fill: "oklch(0.65 0.03 280)" }}
                      />
                      <ZAxis range={[40, 160]} />
                      <Scatter
                        data={allRuns.map((r) => ({
                          feature: r.config.featureIndex,
                          delta: r.result.accuracyDelta * 100,
                          coefficient: Math.abs(r.config.coefficient),
                        }))}
                        fill="oklch(0.68 0.2 310)"
                        fillOpacity={0.7}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0 h-[calc(100%-48px)]">
            <div className="flex items-center gap-3 border-b border-border/50 px-6 py-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by feature, layer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 bg-muted/30 pl-8 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-48px)]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <SortableHead
                      label="Run"
                      field="runNumber"
                      currentField={sortField}
                      asc={sortAsc}
                      onSort={toggleSort}
                    />
                    <SortableHead
                      label="Feature"
                      field="feature"
                      currentField={sortField}
                      asc={sortAsc}
                      onSort={toggleSort}
                    />
                    <SortableHead
                      label="Layer"
                      field="layer"
                      currentField={sortField}
                      asc={sortAsc}
                      onSort={toggleSort}
                    />
                    <SortableHead
                      label="Coefficient"
                      field="coefficient"
                      currentField={sortField}
                      asc={sortAsc}
                      onSort={toggleSort}
                    />
                    <TableHead className="text-[10px] uppercase tracking-wider">
                      Method
                    </TableHead>
                    <SortableHead
                      label="Accuracy Delta"
                      field="accuracy"
                      currentField={sortField}
                      asc={sortAsc}
                      onSort={toggleSort}
                    />
                    <TableHead className="text-[10px] uppercase tracking-wider">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRuns.map((run) => (
                    <TableRow
                      key={run.id}
                      className="cursor-pointer hover:bg-muted/20"
                    >
                      <TableCell className="font-mono text-xs">
                        #{run.runNumber}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-mono text-[10px]",
                            run.config.featureIndex === 30939 &&
                              "border-amber-500/30 text-amber-400"
                          )}
                        >
                          {run.config.featureIndex}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        L{run.config.layer}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-mono text-xs font-medium",
                            run.config.coefficient > 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          )}
                        >
                          {run.config.coefficient > 0 ? "+" : ""}
                          {run.config.coefficient}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px]">
                          {run.config.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-mono text-xs font-semibold",
                            run.result.accuracyDelta > 0
                              ? "text-emerald-400"
                              : run.result.accuracyDelta < 0
                                ? "text-red-400"
                                : "text-muted-foreground"
                          )}
                        >
                          {run.result.accuracyDelta > 0 ? "+" : ""}
                          {(run.result.accuracyDelta * 100).toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">
                        {new Date(run.result.timestamp).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          {/* Live Monitor Tab */}
          <TabsContent value="monitor" className="mt-0 h-[calc(100%-48px)]">
            <div className="flex h-full items-center justify-center p-8">
              <Card className="max-w-md border-border/50 p-6 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary/50" />
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  Autonomous Experiment Loop
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Connect to the backend experiment service to monitor live
                  autonomous experiment runs. The loop will sweep steering
                  coefficients, evaluate accuracy, and log results in real time.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <StatusItem label="Status" value="Idle" />
                  <StatusItem label="Queue" value="0 pending" />
                  <StatusItem label="Completed" value={`${allRuns.length} runs`} />
                </div>
                <Button variant="outline" size="sm" className="mt-4 text-xs" disabled>
                  Start Loop
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/50 p-3">
      <div className="flex items-center justify-between">
        {icon}
        <span className="font-mono text-lg font-bold text-foreground">
          {value}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </Card>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
      <p className="text-xs font-medium text-foreground">{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SortableHead({
  label,
  field,
  currentField,
  asc,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  asc: boolean;
  onSort: (field: SortField) => void;
}) {
  return (
    <TableHead
      className="cursor-pointer text-[10px] uppercase tracking-wider hover:text-foreground"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        {currentField === field && (
          <span className="text-primary">{asc ? "^" : "v"}</span>
        )}
      </span>
    </TableHead>
  );
}
