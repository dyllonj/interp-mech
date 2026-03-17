"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHypothesisStore } from "@/stores";
import type { HypothesisPriority, ValidationMethod } from "@/types";
import { Plus, Sparkles } from "lucide-react";

const validationMethods: { value: ValidationMethod; label: string }[] = [
  { value: "activation_patching", label: "Activation Patching" },
  { value: "causal_tracing", label: "Causal Tracing" },
  { value: "sae_steering", label: "SAE Steering" },
  { value: "ablation", label: "Ablation" },
  { value: "logit_lens", label: "Logit Lens" },
  { value: "probing", label: "Probing" },
  { value: "direct_observation", label: "Direct Observation" },
];

const priorities: { value: HypothesisPriority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function NewHypothesisDialog() {
  const [open, setOpen] = useState(false);
  const addHypothesis = useHypothesisStore((s) => s.addHypothesis);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetComponent, setTargetComponent] = useState("");
  const [targetLayer, setTargetLayer] = useState("");
  const [variable, setVariable] = useState("");
  const [predictedPersona, setPredictedPersona] = useState("");
  const [priority, setPriority] = useState<HypothesisPriority>("medium");
  const [validationMethod, setValidationMethod] =
    useState<ValidationMethod>("sae_steering");
  const [tags, setTags] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetComponent("");
    setTargetLayer("");
    setVariable("");
    setPredictedPersona("");
    setPriority("medium");
    setValidationMethod("sae_steering");
    setTags("");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();
    addHypothesis({
      id: `hyp-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "draft",
      targetComponent: targetComponent.trim(),
      targetLayer: targetLayer ? parseInt(targetLayer, 10) : undefined,
      variable: variable.trim(),
      predictedPersona: predictedPersona.trim() || undefined,
      validationMethod,
      evidenceLinks: [],
      notes: "",
      createdAt: now,
      updatedAt: now,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" className="gap-1.5" />}
      >
        <Plus className="h-3.5 w-3.5" />
        New Hypothesis
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            New Hypothesis
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Feature 30939 encodes systematic enumeration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your hypothesis and expected outcome..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="targetComponent">Target Component</Label>
              <Input
                id="targetComponent"
                placeholder="e.g., MLP Layer 16"
                value={targetComponent}
                onChange={(e) => setTargetComponent(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="targetLayer">Layer</Label>
              <Input
                id="targetLayer"
                type="number"
                placeholder="e.g., 16"
                min={0}
                max={31}
                value={targetLayer}
                onChange={(e) => setTargetLayer(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="variable">Variable</Label>
              <Input
                id="variable"
                placeholder="e.g., Enumeration frequency"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="predictedPersona">Predicted Persona</Label>
              <Input
                id="predictedPersona"
                placeholder="e.g., The Analyst"
                value={predictedPersona}
                onChange={(e) => setPredictedPersona(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as HypothesisPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Validation Method</Label>
              <Select
                value={validationMethod}
                onValueChange={(v) =>
                  setValidationMethod(v as ValidationMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {validationMethods.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., sae, reasoning, feature-30939"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Create Hypothesis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
