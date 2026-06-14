"use client";

import React from "react";
import { useModelDisplayName } from "@/hooks/useModelDisplayName";

interface HeaderModelBadgeProps {
  selectedModel?: string;
}

export function HeaderModelBadge({ selectedModel = "gemini/gemma-4-31b-it" }: HeaderModelBadgeProps) {
  const { getShortDisplayName } = useModelDisplayName();

  return (
    <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
      <span className="mr-2">Model:</span>
      <span className="text-foreground bg-secondary px-2 py-0.5 rounded-md text-xs border border-border/50">
        {getShortDisplayName(selectedModel)}
      </span>
    </div>
  );
}
