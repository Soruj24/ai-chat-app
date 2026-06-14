"use client";

import React from "react";
import { FileText } from "lucide-react";
import { SourceCard } from "@/components/ai/SourceCard";
import type { Source } from "@/types";

interface MessageSourcesGridProps {
  sources: Source[];
}

export function MessageSourcesGrid({ sources }: MessageSourcesGridProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-border/40">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>Sources</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sources.map((source, idx) => (
          <SourceCard key={idx} title={source.title} url={source.url} domain={source.domain} index={idx + 1} />
        ))}
      </div>
    </div>
  );
}
