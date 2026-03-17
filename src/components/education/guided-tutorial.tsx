"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LearningStep } from "./learning-step";
import { useLearningStore } from "@/stores";
import type { Tutorial } from "@/types";
import { cn } from "@/lib/utils";
import { GraduationCap, ChevronLeft, ChevronRight, X, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuidedTutorialProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function GuidedTutorial({ tutorial, onClose }: GuidedTutorialProps) {
  const {
    activeTutorialStep,
    setActiveTutorialStep,
    completeTutorial,
    isTutorialCompleted,
  } = useLearningStore();

  const isCompleted = isTutorialCompleted(tutorial.id);
  const currentStep = tutorial.steps[activeTutorialStep];
  const isLastStep = activeTutorialStep === tutorial.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial(tutorial.id);
      onClose();
    } else {
      setActiveTutorialStep(activeTutorialStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTutorialStep > 0) {
      setActiveTutorialStep(activeTutorialStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <Card className="border-primary/20 bg-card">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
          <GraduationCap className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              {tutorial.title}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Step {activeTutorialStep + 1} of {tutorial.steps.length} |{" "}
              {tutorial.estimatedMinutes} min
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Steps */}
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-2 p-4">
            {tutorial.steps.map((step, i) => (
              <LearningStep
                key={step.id}
                step={step}
                isActive={i === activeTutorialStep}
                isCompleted={i < activeTutorialStep}
                onActivate={() => setActiveTutorialStep(i)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={activeTutorialStep === 0}
            className="gap-1 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <div className="flex gap-1">
            {tutorial.steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === activeTutorialStep
                    ? "bg-primary"
                    : i < activeTutorialStep
                      ? "bg-primary/40"
                      : "bg-muted"
                )}
              />
            ))}
          </div>
          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1 text-xs"
          >
            {isLastStep ? (
              <>
                <Award className="h-3.5 w-3.5" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
