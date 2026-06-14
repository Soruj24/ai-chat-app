"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRight, Brain, Mic, Paperclip, Sparkles } from "lucide-react";
import { ActionsMenu } from "./ActionsMenu";
import { FocusModeDropdown } from "./FocusModeDropdown";
import { ToneDropdown } from "./ToneDropdown";
import { ModelSelector } from "./ModelSelector";

interface ActionsRowProps {
  focusMode: string;
  onFocusModeChange: (value: string) => void;
  isResearchMode: boolean;
  onToggleResearchMode: () => void;
  selectedTone: string;
  onToneChange: (value: string) => void;
  selectedModel: string;
  onModelChange?: (value: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isUploading: boolean;
  onUploadClick: () => void;
  onCloudImport: () => void;
  onConnectors: () => void;
  onMore: () => void;
  canSubmit: boolean;
  isGenerating: boolean;
  onSubmit: () => void;
}

export function AIInputActionsRow({
  focusMode,
  onFocusModeChange,
  isResearchMode,
  onToggleResearchMode,
  selectedTone,
  onToneChange,
  selectedModel,
  onModelChange,
  isListening,
  onToggleListening,
  isUploading,
  onUploadClick,
  onCloudImport,
  onConnectors,
  onMore,
  canSubmit,
  isGenerating,
  onSubmit,
}: ActionsRowProps) {
  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <div className="flex items-center gap-1">
        <ActionsMenu
          onUploadClick={onUploadClick}
          onCloudImport={onCloudImport}
          onConnectors={onConnectors}
          onToggleResearchMode={onToggleResearchMode}
          onMore={onMore}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
                aria-label="Attach file"
                onClick={onUploadClick}
                disabled={isUploading}
              >
                {isUploading ? <span className="animate-spin text-xs">⌛</span> : <Paperclip className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file (PDF, TXT, MD, JSON)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <FocusModeDropdown focusMode={focusMode} onFocusModeChange={onFocusModeChange} />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleResearchMode}
                className={cn(
                  "h-8 gap-1.5 px-2 rounded-full transition-all duration-300 border",
                  isResearchMode ? "text-indigo-600 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent",
                )}
                aria-label="Toggle Research Mode"
                aria-pressed={isResearchMode}
              >
                <Brain className={cn("h-4 w-4", isResearchMode && "text-indigo-600 animate-pulse")} />
                <span className={cn("text-xs font-medium hidden sm:inline-block transition-colors", isResearchMode && "text-indigo-600")}>
                  Deep Research
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isResearchMode ? "Deep Research Mode On" : "Enable Deep Research"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-1">
        <ToneDropdown selectedTone={selectedTone} onToneChange={onToneChange} />
        <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleListening}
                className={cn(
                  "h-8 w-8 rounded-full transition-all duration-300",
                  isListening ? "text-red-500 bg-red-500/10 hover:bg-red-500/20 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                )}
                aria-label="Voice Input"
              >
                <Mic className={cn("h-4 w-4", isListening && "fill-current")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isListening ? "Listening..." : "Voice Input"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isGenerating}
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-all duration-300 shadow-sm ml-1",
            canSubmit && !isGenerating ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
          )}
          aria-label="Send message"
        >
          {isGenerating ? <Sparkles className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
