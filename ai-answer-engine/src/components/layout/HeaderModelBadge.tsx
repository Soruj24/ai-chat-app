"use client";

import React from "react";
import { useModelDisplayName } from "@/hooks/useModelDisplayName";
import { Button } from "@/components/ui/button";

interface HeaderModelBadgeProps {
  selectedModel?: string;
  onClick?: () => void;
}

export function HeaderModelBadge({ selectedModel = "gemini/gemma-4-31b-it", onClick }: HeaderModelBadgeProps) {
  const { getShortDisplayName } = useModelDisplayName();

  if (!onClick) {
    return (
      <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
        <span className="mr-2">Model:</span>
        <span className="text-foreground bg-secondary px-2 py-0.5 rounded-md text-xs border border-border/50">
          {getShortDisplayName(selectedModel)}
        </span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground h-auto py-1.5 px-2"
      onClick={onClick}
    >
      <span className="mr-1">Model:</span>
      <span className="text-foreground bg-secondary px-2 py-0.5 rounded-md text-xs border border-border/50">
        {getShortDisplayName(selectedModel)}
      </span>
      <kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-60">
        ⌘K
      </kbd>
    </Button>
  );
}
