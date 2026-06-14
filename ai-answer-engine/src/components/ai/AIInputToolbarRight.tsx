import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mic, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";

interface Props {
  selectedModel: string;
  onModelChange?: (model: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  canSubmit: boolean;
  isGenerating: boolean;
  onSubmit: () => void;
}

export function AIInputToolbarRight({
  selectedModel,
  onModelChange,
  isListening,
  onToggleListening,
  canSubmit,
  isGenerating,
  onSubmit,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />

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
