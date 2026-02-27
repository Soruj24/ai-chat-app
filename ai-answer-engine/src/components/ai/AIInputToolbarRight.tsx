import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, Mic, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  selectedTone: string;
  onToneChange: (value: string) => void;
  selectedModel: string;
  onModelChange?: (model: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  canSubmit: boolean;
  isGenerating: boolean;
  onSubmit: () => void;
}

export function AIInputToolbarRight({
  selectedTone,
  onToneChange,
  selectedModel,
  onModelChange,
  isListening,
  onToggleListening,
  canSubmit,
  isGenerating,
  onSubmit,
}: Props) {
  const handleModelChange = onModelChange || (() => {});

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
          >
            <span className="text-xs font-medium max-w-[80px] truncate">
              {selectedTone}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Select Tone</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedTone}
            onValueChange={onToneChange}
          >
            <DropdownMenuRadioItem value="Neutral">Neutral</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Professional">
              Professional
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Creative">Creative</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Academic">Academic</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Simplified">
              Simplified
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Concise">Concise</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
          >
            <span className="text-xs font-medium max-w-[80px] truncate">
              {selectedModel === "llama3.2"
                ? "Llama 3.2"
                : selectedModel.split("/").pop()?.split("-")[0] ||
                  selectedModel}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Select Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedModel}
            onValueChange={handleModelChange}
          >
            <DropdownMenuRadioItem value="llama3.2">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Llama 3.2
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="deepseek-r1:1.5b">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                DeepSeek R1 (1.5B)
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="groq/llama-3.1-8b-instant">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Groq Llama 3.1 8B
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="groq/llama-3.3-70b-versatile">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Groq Llama 3.3 70B
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="gemini/gemini-1.5-flash">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Gemini 1.5 Flash
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="gemini/gemini-1.5-pro">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Gemini 1.5 Pro
              </span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-4 w-px bg-border/50 mx-1 hidden md:block" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleListening}
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-300",
                isListening
                  ? "text-red-500 bg-red-500/10 hover:bg-red-500/20 animate-pulse"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10",
              )}
              aria-label="Voice Input"
            >
              <Mic className={cn("h-4 w-4", isListening && "fill-current")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isListening ? "Listening..." : "Voice Input"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        onClick={onSubmit}
        disabled={!canSubmit}
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full transition-all duration-300 shadow-sm ml-1",
          canSubmit
            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
        )}
        aria-label="Send message"
      >
        {isGenerating ? (
          <Sparkles className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
