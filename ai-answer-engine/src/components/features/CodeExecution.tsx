"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Trash2, Copy, Check, Code, Loader2, Terminal, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

const EXAMPLE_CODE = {
  javascript: `// JavaScript Code Execution
// Available: console.log(), Math, Date, Array, Object

function fibonacci(n) {
  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  return sequence.slice(0, n);
}

console.log("Fibonacci sequence (first 10):");
console.log(fibonacci(10));

// Calculate sum
const sum = fibonacci(10).reduce((a, b) => a + b, 0);
console.log("Sum:", sum);`,
  python: `# Python simulation (limited)
# Note: True Python execution requires backend

# Simulated Python-to-JS
def fibonacci(n):
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence[:n]

result = fibonacci(10)
print("Fibonacci:", result)
print("Sum:", sum(result))`,
};

function executeJavaScript(code: string): ExecutionResult {
  const startTime = performance.now();
  let output = "";
  const errors: string[] = [];

  const customConsole = {
    log: (...args: unknown[]) => {
      output += args
        .map((a) =>
          typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
        )
        .join(" ") + "\n";
    },
    error: (...args: unknown[]) => {
      errors.push(
        args
          .map((a) =>
            typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
          )
          .join(" ")
      );
    },
    warn: (...args: unknown[]) => {
      output += "[WARN] " + args.map(String).join(" ") + "\n";
    },
  };

  try {
    const safeEval = new Function(
      "console",
      "Math",
      "Date",
      "JSON",
      "Array",
      "Object",
      "Map",
      "Set",
      "Promise",
      "setTimeout",
      "setInterval",
      code
    );

    safeEval(
      customConsole,
      Math,
      Date,
      JSON,
      Array,
      Object,
      Map,
      Set,
      Promise,
      undefined,
      undefined
    );
  } catch (error) {
    errors.push((error as Error).message);
  }

  const executionTime = performance.now() - startTime;

  return {
    output: output.trim(),
    error: errors.length > 0 ? errors.join("\n") : undefined,
    executionTime,
  };
}

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
      const execResult = executeJavaScript(code);
      setResult(execResult);
    } else {
      setResult({
        output: "Python execution requires a backend service.\n\nUse JavaScript for local execution.",
        error: undefined,
        executionTime: 0,
      });
    }

    setIsRunning(false);
  }, [code, language]);

  const clearCode = () => {
    setCode("");
    setResult(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (lang: "javascript" | "python") => {
    setCode(EXAMPLE_CODE[lang]);
    setLanguage(lang);
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code className="h-4 w-4" />
          Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Code Execution
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Tabs
              value={language}
              onValueChange={(v) => {
                setLanguage(v as "javascript" | "python");
                if (v === "python") {
                  setCode(EXAMPLE_CODE.python);
                } else {
                  setCode(EXAMPLE_CODE.javascript);
                }
              }}
            >
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => loadExample(language)}>
                Load Example
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <Label>Code</Label>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyCode}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearCode}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 font-mono text-sm min-h-[300px]"
                placeholder="Enter your code here..."
              />
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between">
                <Label>Output</Label>
                {result && (
                  <span className="text-xs text-muted-foreground">
                    Executed in {result.executionTime.toFixed(2)}ms
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "flex-1 border rounded-lg p-4 font-mono text-sm overflow-auto",
                  result?.error ? "bg-destructive/10" : "bg-muted/50"
                )}
              >
                {isRunning ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </div>
                ) : result ? (
                  <div className="space-y-3">
                    {result.output && (
                      <div className="whitespace-pre-wrap">{result.output}</div>
                    )}
                    {result.error && (
                      <div className="flex items-start gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="whitespace-pre-wrap">{result.error}</span>
                      </div>
                    )}
                    {result.output && !result.error && (
                      <div className="flex items-center gap-2 text-green-600 text-xs">
                        <CheckCircle className="h-4 w-4" />
                        Execution completed successfully
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Output will appear here...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            JavaScript runs in browser sandbox. Python requires backend.
          </p>
          <Button onClick={runCode} disabled={isRunning || !code.trim()} className="gap-2">
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
