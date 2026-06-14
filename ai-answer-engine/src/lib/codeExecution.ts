export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

export const EXAMPLE_CODE = {
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

export function executeJavaScript(code: string): ExecutionResult {
  const startTime = performance.now();
  let output = "";
  const errors: string[] = [];

  const customConsole = {
    log: (...args: unknown[]) => {
      output += args
        .map((a) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))
        .join(" ") + "\n";
    },
    error: (...args: unknown[]) => {
      errors.push(args.map((a) => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" "));
    },
    warn: (...args: unknown[]) => {
      output += "[WARN] " + args.map(String).join(" ") + "\n";
    },
  };

  try {
    const safeEval = new Function(
      "console", "Math", "Date", "JSON", "Array", "Object", "Map", "Set", "Promise", "setTimeout", "setInterval", code
    );
    safeEval(customConsole, Math, Date, JSON, Array, Object, Map, Set, Promise, undefined, undefined);
  } catch (error) {
    errors.push((error as Error).message);
  }

  return {
    output: output.trim(),
    error: errors.length > 0 ? errors.join("\n") : undefined,
    executionTime: performance.now() - startTime,
  };
}
