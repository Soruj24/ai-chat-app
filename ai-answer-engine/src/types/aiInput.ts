export interface ModelOption {
  id: string;
  name: string;
  color: string;
  provider: "ollama" | "groq" | "google";
}

export interface FocusModeOption {
  value: string;
  label: string;
  icon: string;
}

export interface ToneOption {
  value: string;
  label: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "llama3.2", name: "Llama 3.2", color: "bg-blue-500", provider: "ollama" },
  { id: "deepseek-r1:1.5b", name: "DeepSeek R1 (1.5B)", color: "bg-purple-500", provider: "ollama" },
  { id: "groq/llama-3.1-8b-instant", name: "Groq Llama 3.1 8B", color: "bg-orange-500", provider: "groq" },
  { id: "groq/llama-3.3-70b-versatile", name: "Groq Llama 3.3 70B", color: "bg-orange-500", provider: "groq" },
  { id: "gemini/gemini-1.5-flash", name: "Gemini 1.5 Flash", color: "bg-green-500", provider: "google" },
  { id: "gemini/gemini-1.5-pro", name: "Gemini 1.5 Pro", color: "bg-green-500", provider: "google" },
  { id: "gemini/gemma-4-31b-it", name: "Gemma 4 31B", color: "bg-teal-500", provider: "google" },
  { id: "gemini/gemma-4-26b-a4b-it", name: "Gemma 4 26B MoE", color: "bg-teal-500", provider: "google" },
];

export const FOCUS_MODE_OPTIONS: FocusModeOption[] = [
  { value: "web", label: "All", icon: "Globe" },
  { value: "academic", label: "Academic", icon: "GraduationCap" },
  { value: "writing", label: "Writing", icon: "PenTool" },
  { value: "youtube", label: "YouTube", icon: "Video" },
  { value: "reddit", label: "Social", icon: "MessageSquare" },
  { value: "future", label: "Future", icon: "Calendar" },
];

export const TONE_OPTIONS: ToneOption[] = [
  { value: "Neutral", label: "Neutral" },
  { value: "Professional", label: "Professional" },
  { value: "Creative", label: "Creative" },
  { value: "Academic", label: "Academic" },
  { value: "Simplified", label: "Simplified" },
  { value: "Concise", label: "Concise" },
];
