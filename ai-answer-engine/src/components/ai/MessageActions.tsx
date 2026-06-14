"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Share2, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  copied: boolean;
  isStreaming?: boolean;
  onCopy: () => void;
  onRegenerate?: () => void;
  onShare?: () => void;
}

export function MessageActions({
  copied,
  isStreaming,
  onCopy,
  onRegenerate,
  onShare,
}: MessageActionsProps) {
  if (isStreaming) return null;

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-muted-foreground hover:text-foreground gap-1.5 rounded-full px-3"
        onClick={onCopy}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
      </Button>

      {onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
          onClick={onRegenerate}
          title="Regenerate"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      )}

      {onShare && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
          onClick={onShare}
          title="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      )}

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
