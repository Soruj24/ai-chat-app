"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
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

interface ResearchProcessProps {
  steps: ResearchStep[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

export { type ResearchStep }; // Re-export for compatibility if needed, though direct import is better

export function ResearchProcess({
  steps,
  isExpanded: controlledExpanded,
  onToggleExpand,
  className,
}: ResearchProcessProps) {
  const [internalExpanded, setInternalExpanded] = useState(true);
  const isExpanded = controlledExpanded ?? internalExpanded;
  const toggleExpand =
    onToggleExpand ?? (() => setInternalExpanded(!internalExpanded));

  const isResearching = steps.some((s) => s.status === "in_progress");

  // Auto-expand if still researching, collapse when done (only if not controlled)
  useEffect(() => {
    if (controlledExpanded === undefined) {
      if (isResearching) {
        setInternalExpanded(true);
      } else {
        // Delay collapse to let user see "Completed" state for a moment
        const timer = setTimeout(() => setInternalExpanded(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isResearching]);

  const currentStepIndex = steps.findIndex((s) => s.status === "in_progress");
  const activeStep =
    currentStepIndex !== -1 ? steps[currentStepIndex] : steps[steps.length - 1];

  // If there are no steps yet, or very first step, show something default
  const displayStep = activeStep || {
    title: "Starting research...",
    status: "pending" as const,
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto my-6", className)}>
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
        {/* Header */}
        <div
          onClick={toggleExpand}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-500">
              {steps.every((s) => s.status === "completed") &&
              steps.length > 0 ? (
                <Check className="h-5 w-5" />
              ) : (
                <Brain className="h-5 w-5 animate-pulse" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {steps.every((s) => s.status === "completed") &&
                steps.length > 0
                  ? "Research Completed"
                  : "Researching..."}
              </span>
              <span className="text-xs text-muted-foreground">
                {displayStep.title}
              </span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Expanded Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-4 pb-4 pt-0 space-y-6">
                <div className="relative pl-4 border-l-2 border-border/50 space-y-6 ml-2 my-2">
                  {steps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isInProgress = step.status === "in_progress";
                    const isPending = step.status === "pending";

                    let DefaultIcon = Search;
                    const lowerTitle = step.title.toLowerCase();
                    
                    if (lowerTitle.includes("calculat")) {
                      DefaultIcon = Calculator;
                    } else if (lowerTitle.includes("youtube") || lowerTitle.includes("video")) {
                      DefaultIcon = Video;
                    } else if (lowerTitle.includes("academic") || lowerTitle.includes("research")) {
                      DefaultIcon = GraduationCap;
                    } else if (lowerTitle.includes("weather")) {
                      DefaultIcon = CloudSun;
                    } else if (lowerTitle.includes("reddit")) {
                      DefaultIcon = MessageSquare;
                    } else if (lowerTitle.includes("wikipedia")) {
                      DefaultIcon = Globe;
                    } else if (lowerTitle.includes("image") || lowerTitle.includes("draw") || lowerTitle.includes("generate")) {
                      DefaultIcon = ImageIcon;
                    } else if (index === 1) {
                      DefaultIcon = BookOpen;
                    } else if (index > 1) {
                      DefaultIcon = PenTool;
                    }

                    return (
                      <div key={step.id} className="relative group">
                        {/* Timeline Dot */}
                        <div
                          className={cn(
                            "absolute -left-[25px] top-0 h-4 w-4 rounded-full border-2 bg-background flex items-center justify-center transition-all duration-300",
                            isCompleted
                              ? "border-indigo-500 bg-indigo-500"
                              : isInProgress
                                ? "border-indigo-500 scale-110"
                                : "border-muted-foreground/30",
                          )}
                        >
                          {isCompleted && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                          {isInProgress && (
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={cn(
                            "flex flex-col gap-1",
                            isPending && "opacity-50",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {/* Icon Handling: step.icon is ReactNode, DefaultIcon is Component */}
                            {step.icon ? (
                              <div
                                className={cn(
                                  "h-4 w-4 flex items-center justify-center",
                                  isCompleted || isInProgress
                                    ? "text-indigo-500"
                                    : "text-muted-foreground",
                                )}
                              >
                                {step.icon}
                              </div>
                            ) : (
                              <DefaultIcon
                                className={cn(
                                  "h-4 w-4",
                                  isCompleted || isInProgress
                                    ? "text-indigo-500"
                                    : "text-muted-foreground",
                                )}
                              />
                            )}

                            <span
                              className={cn(
                                "text-sm font-medium",
                                isCompleted || isInProgress
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {step.title}
                            </span>
                            {isInProgress && (
                              <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                            )}
                          </div>

                          {/* Details / Thoughts */}
                          {(isInProgress || isCompleted) &&
                            step.details &&
                            step.details.length > 0 && (
                              <div className="mt-2 space-y-2 ml-6">
                                {step.details.map((detail, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-2 text-xs text-muted-foreground"
                                  >
                                    <span className="mt-1 h-1 w-1 rounded-full bg-indigo-500/50 flex-shrink-0" />
                                    <span>{detail}</span>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
