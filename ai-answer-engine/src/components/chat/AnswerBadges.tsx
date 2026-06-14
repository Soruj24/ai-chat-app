"use client";

import React from "react";
import { Brain } from "lucide-react";
import type { Source } from "@/types";
import type { ResearchStep } from "./ResearchProcess";

interface AnswerBadgesProps {
  sources?: Source[];
  researchSteps?: ResearchStep[];
  isStreaming?: boolean;
}

export function AnswerBadges({ sources, researchSteps, isStreaming }: AnswerBadgesProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-medium bg-secondary/60 text-foreground px-2 py-0.5 rounded-full border border-border/50">
        Answer
      </span>
      {sources && sources.length > 0 && (
        <span className="text-[10px] font-medium bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20">
          Web‑verified
        </span>
      )}
      {sources && sources.length > 0 && (
        <span className="text-[10px] font-medium bg-muted/40 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
          {sources.length} Sources
        </span>
      )}
      {researchSteps && researchSteps.length > 0 && (
        <span className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
          <Brain className="h-3 w-3" />
          Deep Research
        </span>
      )}
      {isStreaming && <span className="text-xs text-muted-foreground">...</span>}
    </div>
  );
}
