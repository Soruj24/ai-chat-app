"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Trash2, Copy, Check, Code, Loader2, Terminal, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXAMPLE_CODE, executeJavaScript } from "@/lib/codeExecution";
import type { ExecutionResult } from "@/lib/codeExecution";

export function CodeExecutionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"javascript" | "python">("javascript");
  const [code, setCode] = useState(EXAMPLE_CODE.javascript);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (language === "javascript") {
      setResult(executeJavaScript(code));
    } else {
      setResult({
        output: "Python execution requires a backend service.\n\nUse JavaScript for local execution.",
        executionTime: 0,
      });
    }
    setIsRunning(false);
  }, [code, language]);

  const clearCode = () => { setCode(""); setResult(null); };
  const copyCode = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const loadExample = (lang: "javascript" | "python") => { setCode(EXAMPLE_CODE[lang]); setLanguage(lang); setResult(null); };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2"><Code className="h-4 w-4" /> Code</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" /> Code Execution</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Tabs value={language} onValueChange={(v) => { setLanguage(v as "javascript" | "python"); setCode(EXAMPLE_CODE[v as "javascript" | "python"]); }}>
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={() => loadExample(language)}>Load Example</Button>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <Label>Code</Label>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyCode}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearCode}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <Textarea value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 font-mono text-sm min-h-[300px]" placeholder="Enter your code here..." />
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <Label>Output</Label>
                {result && <span className="text-xs text-muted-foreground">Executed in {result.executionTime.toFixed(2)}ms</span>}
              </div>
              <div className={cn("flex-1 border rounded-lg p-4 font-mono text-sm overflow-auto", result?.error ? "bg-destructive/10" : "bg-muted/50")}>
                {isRunning ? (
                  <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Running...</div>
                ) : result ? (
                  <div className="space-y-3">
                    {result.output && <div className="whitespace-pre-wrap">{result.output}</div>}
                    {result.error && (
                      <div className="flex items-start gap-2 text-destructive"><AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /><span className="whitespace-pre-wrap">{result.error}</span></div>
                    )}
                    {result.output && !result.error && (
                      <div className="flex items-center gap-2 text-green-600 text-xs"><CheckCircle className="h-4 w-4" /> Execution completed successfully</div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">Output will appear here...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">JavaScript runs in browser sandbox. Python requires backend.</p>
          <Button onClick={runCode} disabled={isRunning || !code.trim()} className="gap-2">
            {isRunning ? <><Loader2 className="h-4 w-4 animate-spin" /> Running...</> : <><Play className="h-4 w-4" /> Run Code</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
