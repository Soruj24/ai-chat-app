"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Zap } from "lucide-react";
import { ModelResultCard } from "./ModelResultCard";
import { ModelSelectorGrid } from "./ModelSelectorGrid";
import type { ModelComparisonResult } from "@/types/modelComparison";

interface ModelComparisonDialogProps { onClose?: () => void; }

export function ModelComparisonDialog({ onClose }: ModelComparisonDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["gemini/gemma-4-31b-it", "gemini/gemma-4-26b-a4b-it"]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ModelComparisonResult[]>([]);
  const [copiedModel, setCopiedModel] = useState<string | null>(null);

  const toggleModel = (modelId: string) => setSelectedModels((prev) => prev.includes(modelId) ? prev.filter((m) => m !== modelId) : [...prev, modelId]);

  const fetchModelResponse = async (modelId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const response = await fetch(`${apiUrl}/api/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: query, model: modelId, sessionId: `compare-${Date.now()}-${modelId}`, isResearchMode: false, tone: "Neutral", focusMode: "web" }) });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "answer") { fullResponse += data.content; setResults((prev) => prev.map((r) => r.model === modelId ? { ...r, response: fullResponse } : r)); }
            else if (data.type === "done") setResults((prev) => prev.map((r) => r.model === modelId ? { ...r, isStreaming: false } : r));
            else if (data.type === "error") setResults((prev) => prev.map((r) => r.model === modelId ? { ...r, isStreaming: false, error: data.message } : r));
          } catch { /* streaming parse error */ }
        }
      }
    } catch (error) { setResults((prev) => prev.map((r) => r.model === modelId ? { ...r, isStreaming: false, error: (error as Error).message } : r)); }
  };

  const runComparison = async () => {
    if (!query.trim() || selectedModels.length === 0) return;
    setIsRunning(true);
    setResults(selectedModels.map((m) => ({ model: m, response: "", isStreaming: true })));
    await Promise.all(selectedModels.map(fetchModelResponse));
    setIsRunning(false);
  };

  const copyResponse = (modelId: string, response: string) => { navigator.clipboard.writeText(response); setCopiedModel(modelId); setTimeout(() => setCopiedModel(null), 2000); };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-500" /> Model Comparison</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="space-y-2">
          <Label>Your Question</Label>
          <Textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What would you like to ask multiple models?" className="min-h-[100px]" />
        </div>
        <div className="space-y-2">
          <Label>Select Models (select 2-4)</Label>
          <ModelSelectorGrid selectedModels={selectedModels} onToggle={toggleModel} />
        </div>
        {results.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <Label>Results</Label>
            {results.map((result) => <ModelResultCard key={result.model} result={result} copiedModel={copiedModel} onCopy={copyResponse} />)}
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <Button onClick={runComparison} disabled={!query.trim() || selectedModels.length === 0 || isRunning} className="flex-1 gap-2">
            {isRunning ? <><Loader2 className="h-4 w-4 animate-spin" /> Comparing...</> : <><Zap className="h-4 w-4" /> Compare {selectedModels.length} Models</>}
          </Button>
          {onClose && <Button variant="outline" onClick={onClose}>Close</Button>}
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
        <Button variant="outline" size="sm" className="gap-2"><Zap className="h-4 w-4" /> Compare</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <ModelComparisonDialog onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
