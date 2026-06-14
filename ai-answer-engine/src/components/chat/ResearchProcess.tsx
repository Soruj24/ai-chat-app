"use client";

import React from "react";
import {
  Check,
  Loader2,
  Search,
  BookOpen,
  PenTool,
  Calculator,
  Video,
  GraduationCap,
  CloudSun,
  MessageSquare,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResearchStep } from "@/types";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
  ChainOfThoughtContent,
} from "@/components/ai-elements/chain-of-thought";

interface ResearchProcessProps {
  steps: ResearchStep[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

export { type ResearchStep };

function getStepIcon(step: ResearchStep, index: number) {
  if (step.icon) return undefined;
  const lowerTitle = step.title.toLowerCase();
  if (lowerTitle.includes("calculat")) return Calculator;
  if (lowerTitle.includes("youtube") || lowerTitle.includes("video")) return Video;
  if (lowerTitle.includes("academic") || lowerTitle.includes("research")) return GraduationCap;
  if (lowerTitle.includes("weather")) return CloudSun;
  if (lowerTitle.includes("reddit")) return MessageSquare;
  if (lowerTitle.includes("wikipedia")) return Globe;
  if (lowerTitle.includes("image") || lowerTitle.includes("draw") || lowerTitle.includes("generate")) return ImageIcon;
  if (index === 1) return BookOpen;
  if (index > 1) return PenTool;
  return Search;
}

function getStepStatus(step: ResearchStep): "complete" | "active" | "pending" {
  if (step.status === "completed") return "complete";
  if (step.status === "in_progress") return "active";
  return "pending";
}

export function ResearchProcess({
  steps,
  className,
}: ResearchProcessProps) {
  const isResearching = steps.some((s) => s.status === "in_progress");
  const isComplete = steps.every((s) => s.status === "completed") && steps.length > 0;

  return (
    <ChainOfThought className={cn("w-full", className)}>
      <ChainOfThoughtHeader>
        {isComplete ? "Research Completed" : "Researching..."}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {steps.map((step, index) => {
          const Icon = getStepIcon(step, index);
          return (
            <ChainOfThoughtStep
              key={step.id}
              icon={Icon}
              label={
                <span className="flex items-center gap-2">
                  {step.title}
                  {step.status === "in_progress" && (
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  )}
                </span>
              }
              description={
                step.details && step.details.length > 0
                  ? step.details.join(" • ")
                  : undefined
              }
              status={getStepStatus(step)}
            />
          );
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}
