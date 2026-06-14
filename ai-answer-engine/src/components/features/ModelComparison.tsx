"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Bot, ArrowRight, X, Copy, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModelComparisonResult {
  model: string;
  response: string;
  isStreaming: boolean;
  error?: string;
}

const AVAILABLE_MODELS = [
  { id: "gemini/gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google" },
  { id: "gemini/gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
  { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq" },
  { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq" },
  { id: "llama3.2", name: "Llama 3.2", provider: "Ollama" },
];

export function ModelComparisonDialog({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["gemini/gemini-2.0-flash", "groq/llama-3.3-70b-versatile"]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModelComparisonResult[]>([]);
  const [copiedModel, setCopiedModel] = useState<string | null>(null);

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((m) => m !== modelId)
        : [...prev, modelId]
    );
  };

  const runComparison = async () => {
    if (!query.trim() || selectedModels.length === 0) return;

    setIsRunning(true);
    setResults(selectedModels.map((m) => ({ model: m, response: "", isStreaming: true })));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fetchModelResponse = async (modelId: string) => {
      try {
        const response = await fetch(`${apiUrl}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            model: modelId,
            sessionId: `compare-${Date.now()}-${modelId}`,
            isResearchMode: false,
            tone: "Neutral",
            focusMode: "web",
          }),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "answer") {
                  fullResponse += data.content;
                  setResults((prev) =>
                    prev.map((r) =>
                      r.model === modelId
                        ? { ...r, response: fullResponse }
                        : r
                    )
                  );
                } else if (data.type === "done") {
                  setResults((prev) =>
                    prev.map((r) =>
                      r.model === modelId
                        ? { ...r, isStreaming: false }
                        : r
                    )
                  );
                } else if (data.type === "error") {
                  setResults((prev) =>
                    prev.map((r) =>
                      r.model === modelId
                        ? { ...r, isStreaming: false, error: data.message }
                        : r
                    )
                  );
                }
              } catch (e) {
                // Ignore parse errors for streaming
              }
            }
          }
        }
      } catch (error) {
        setResults((prev) =>
          prev.map((r) =>
            r.model === modelId
              ? { ...r, isStreaming: false, error: (error as Error).message }
              : r
          )
        );
      }
    };

    await Promise.all(selectedModels.map(fetchModelResponse));
    setIsRunning(false);
  };

  const copyResponse = (modelId: string, response: string) => {
    navigator.clipboard.writeText(response);
    setCopiedModel(modelId);
    setTimeout(() => setCopiedModel(null), 2000);
  };

  const getModelName = (modelId: string) => {
    return AVAILABLE_MODELS.find((m) => m.id === modelId)?.name || modelId;
  };

  const getModelProvider = (modelId: string) => {
    return AVAILABLE_MODELS.find((m) => m.id === modelId)?.provider || "Unknown";
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Model Comparison
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label>Your Question</Label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to ask multiple models?"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Select Models (select 2-4)</Label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={cn(
                  "p-3 border rounded-lg text-left transition-all",
                  selectedModels.includes(model.id)
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 transition-all",
                      selectedModels.includes(model.id)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedModels.includes(model.id) && (
                      <div className="h-full w-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <Label>Results</Label>
            {results.map((result, idx) => (
              <motion.div
                key={result.model}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="font-medium">{getModelName(result.model)}</span>
                    <span className="text-xs text-muted-foreground">
                      {getModelProvider(result.model)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isStreaming && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {result.response && !result.isStreaming && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyResponse(result.model, result.response)}
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
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <Button
            onClick={runComparison}
            disabled={!query.trim() || selectedModels.length === 0 || isRunning}
            className="flex-1 gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Compare {selectedModels.length} Models
              </>
            )}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ModelComparisonButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <ModelComparisonDialog onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
