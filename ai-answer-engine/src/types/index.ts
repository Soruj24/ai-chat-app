export interface Source {
  title: string;
  url: string;
  domain?: string;
  content?: string;
}

export interface ResearchStep {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  toolName?: string;
  details?: string[];
  icon?: React.ReactNode; // React.ElementType is hard to type here without React import, using any for now or importing React
}

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  images?: string[];
  researchSteps?: ResearchStep[];
  suggestions?: string[];
  isBookmarked?: boolean;
}
