"use client";

import React from "react";
import { MODEL_OPTIONS } from "@/types/aiInput";
import { useModelDisplayName } from "@/hooks/useModelDisplayName";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorName,
  ModelSelectorLogo,
  ModelSelectorSeparator,
} from "@/components/ai-elements/model-selector";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelectorDialog({
  open,
  onOpenChange,
  selectedModel,
  onModelChange,
}: Props) {
  const { getDisplayName } = useModelDisplayName();

  const ollamaModels = MODEL_OPTIONS.filter((m) => m.provider === "ollama");
  const groqModels = MODEL_OPTIONS.filter((m) => m.provider === "groq");
  const googleModels = MODEL_OPTIONS.filter((m) => m.provider === "google");

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    onOpenChange(false);
  };

  return (
    <ModelSelector open={open} onOpenChange={onOpenChange}>
      <ModelSelectorTrigger />
      <ModelSelectorContent title="Select Model">
        <ModelSelectorInput placeholder="Search models..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>

          {ollamaModels.length > 0 && (
            <ModelSelectorGroup heading="Ollama (Local)">
              {ollamaModels.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleSelect(model.id)}
                >
                  <ModelSelectorLogo provider="llama" />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          )}

          <ModelSelectorSeparator />

          {groqModels.length > 0 && (
            <ModelSelectorGroup heading="Groq">
              {groqModels.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleSelect(model.id)}
                >
                  <ModelSelectorLogo provider="groq" />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          )}

          <ModelSelectorSeparator />

          {googleModels.length > 0 && (
            <ModelSelectorGroup heading="Google">
              {googleModels.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleSelect(model.id)}
                >
                  <ModelSelectorLogo provider="google" />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          )}
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}
