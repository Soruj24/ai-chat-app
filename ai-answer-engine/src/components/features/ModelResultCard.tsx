"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AVAILABLE_MODELS } from "@/types/modelComparison";
import type { ModelComparisonResult } from "@/types/modelComparison";

interface ModelResultCardProps {
  result: ModelComparisonResult;
  copiedModel: string | null;
  onCopy: (modelId: string, response: string) => void;
}

function getModelInfo(modelId: string) {
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
  return { name: model?.name || modelId, provider: model?.provider || "Unknown" };
}

export function ModelResultCard({ result, copiedModel, onCopy }: ModelResultCardProps) {
  const { name, provider } = getModelInfo(result.model);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg overflow-hidden"
    >
      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{provider}</span>
        </div>
        <div className="flex items-center gap-2">
          {result.isStreaming && <Loader2 className="h-4 w-4 animate-spin" />}
          {result.response && !result.isStreaming && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onCopy(result.model, result.response)}
            >
              {copiedModel === result.model ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        {result.error ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{result.response || "Generating..."}</p>
            {result.isStreaming && (
              <span className="inline-block h-4 w-2 bg-primary animate-pulse ml-1" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
