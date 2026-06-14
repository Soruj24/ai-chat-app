"use client";

import { useCallback } from "react";
import { MODEL_OPTIONS } from "@/types/aiInput";

export function useModelDisplayName() {
  const getDisplayName = useCallback((modelId: string): string => {
    const found = MODEL_OPTIONS.find((m) => m.id === modelId);
    if (found) return found.name;
    if (modelId.startsWith("gemini/gemma-")) {
      return "Gemma 4 " + modelId.split("/")[1].replace("gemma-4-", "").replace("-it", "").replace("-a4b", " MoE");
    }
    if (modelId.startsWith("gemini/")) {
      return "Gemini " + modelId.split("/")[1].replace("gemini-", "");
    }
    if (modelId.startsWith("groq/")) {
      return "Groq " + modelId.split("/")[1].split("-").slice(0, 2).join(" ");
    }
    return modelId.split("/").pop()?.split("-")[0] || modelId;
  }, []);

  const getShortDisplayName = useCallback((modelId: string): string => {
    const found = MODEL_OPTIONS.find((m) => m.id === modelId);
    if (found) return found.name.split(" ").slice(0, 2).join(" ");
    return getDisplayName(modelId).split(" ").slice(0, 2).join(" ");
  }, [getDisplayName]);

  const getModelColor = useCallback((modelId: string): string => {
    const found = MODEL_OPTIONS.find((m) => m.id === modelId);
    if (found) return found.color;
    if (modelId.startsWith("gemini/")) return "bg-green-500";
    if (modelId.startsWith("groq/")) return "bg-orange-500";
    return "bg-blue-500";
  }, []);

  return { getDisplayName, getShortDisplayName, getModelColor };
}
