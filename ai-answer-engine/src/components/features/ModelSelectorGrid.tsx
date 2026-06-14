"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AVAILABLE_MODELS } from "@/types/modelComparison";

interface ModelSelectorGridProps {
  selectedModels: string[];
  onToggle: (modelId: string) => void;
}

export function ModelSelectorGrid({ selectedModels, onToggle }: ModelSelectorGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {AVAILABLE_MODELS.map((model) => (
        <button key={model.id} onClick={() => onToggle(model.id)}
          className={cn("p-3 border rounded-lg text-left transition-all", selectedModels.includes(model.id) ? "border-primary bg-primary/10 ring-2 ring-primary/20" : "border-border hover:border-primary/50")}>
          <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full border-2 transition-all", selectedModels.includes(model.id) ? "border-primary bg-primary" : "border-muted-foreground")}>
              {selectedModels.includes(model.id) && <div className="h-full w-full rounded-full bg-white scale-50" />}
            </div>
            <div>
              <p className="font-medium text-sm">{model.name}</p>
              <p className="text-xs text-muted-foreground">{model.provider}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
