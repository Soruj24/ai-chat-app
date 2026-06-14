import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Paperclip,
  Cloud,
  Link as LinkIcon,
  Lock,
  Brain,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FocusModeDropdown } from "./FocusModeDropdown";

interface Props {
  isUploading: boolean;
  onUploadClick: () => void;
  focusMode: string;
  onFocusChange: (value: string) => void;
  isResearchMode: boolean;
  onToggleResearch: () => void;
  onCloudImport: () => void;
  onConnectors: () => void;
  onDiscover: () => void;
}

export function AIInputToolbarLeft({
  isUploading,
  onUploadClick,
  focusMode,
  onFocusChange,
  isResearchMode,
  onToggleResearch,
  onCloudImport,
  onConnectors,
  onDiscover,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors shrink-0"
            aria-label="More actions"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors" onClick={onUploadClick}>
            <span className="flex items-center gap-2"><Paperclip className="h-4 w-4" />Upload files or images</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors" onClick={onCloudImport}>
            <span className="flex items-center gap-2"><Cloud className="h-4 w-4" />Add files from cloud</span>
            <Lock className="h-3.5 w-3.5 opacity-60" />
          </button>
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors" onClick={onConnectors}>
            <span className="flex items-center gap-2"><LinkIcon className="h-4 w-4" />Connectors and sources</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors" onClick={onToggleResearch}>
            <span className="flex items-center gap-2"><Brain className="h-4 w-4" />Deep research</span>
          </button>
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors cursor-not-allowed opacity-70" disabled>
            <span className="flex items-center gap-2"><Cloud className="h-4 w-4" />Model council</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Max</span>
          </button>
          <DropdownMenuSeparator />
          <button className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 rounded-md transition-colors" onClick={onDiscover}>
            <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />More</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

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

      <FocusModeDropdown focusMode={focusMode} onFocusModeChange={onFocusChange} />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleResearch}
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
  );
}
