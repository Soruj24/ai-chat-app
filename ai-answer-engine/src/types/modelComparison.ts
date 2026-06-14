export interface ModelComparisonResult {
  model: string;
  response: string;
  isStreaming: boolean;
  error?: string;
}

export const AVAILABLE_MODELS = [
  { id: "gemini/gemma-4-31b-it", name: "Gemma 4 31B", provider: "Google" },
  { id: "gemini/gemma-4-26b-a4b-it", name: "Gemma 4 26B MoE", provider: "Google" },
  { id: "gemini/gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
  { id: "gemini/gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google" },
  { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq" },
  { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq" },
  { id: "llama3.2", name: "Llama 3.2", provider: "Ollama" },
];
