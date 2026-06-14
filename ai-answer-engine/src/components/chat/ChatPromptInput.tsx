"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/swal";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionAddAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Mic,
  Paperclip,
  Globe,
  GraduationCap,
  PenTool,
  Video,
  MessageSquare,
  Brain,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MODEL_OPTIONS, FOCUS_MODE_OPTIONS } from "@/types/aiInput";
import { useModelDisplayName } from "@/hooks/useModelDisplayName";

interface ChatPromptInputProps {
  onSearch: (
    query: string,
    isResearchMode?: boolean,
    model?: string,
    tone?: string,
    focusMode?: string,
    images?: string[],
  ) => Promise<void>;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  isGenerating?: boolean;
  placeholder?: string;
}

export function ChatPromptInput({
  onSearch,
  selectedModel = "gemini/gemma-4-31b-it",
  onModelChange,
  isGenerating = false,
  placeholder = "What would you like to know?",
}: ChatPromptInputProps) {
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [focusMode, setFocusMode] = useState("web");
  const { getShortDisplayName } = useModelDisplayName();

  const handleSubmit = useCallback(
    async (message: { text: string; files: any[] }) => {
      if (!message.text.trim() && message.files.length === 0) return;

      const images = message.files
        .filter((f) => f.mediaType?.startsWith("image/"))
        .map((f) => f.url);

      await onSearch(
        message.text,
        isResearchMode,
        selectedModel,
        "Neutral",
        focusMode,
        images.length > 0 ? images : undefined,
      );
    },
    [onSearch, isResearchMode, selectedModel, focusMode],
  );

  return (
    <div className="w-full">
      <PromptInput
        onSubmit={handleSubmit}
        accept="image/*,.pdf,.txt,.md,.json"
        className="glass-card rounded-2xl border border-border/50"
      >
        <PromptInputBody>
          <PromptInputTextarea
            placeholder={placeholder}
            className="min-h-[60px] max-h-[200px]"
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger tooltip="Add attachments" />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>

            <PromptInputButton
              tooltip="Voice input"
              onClick={() => showToast("Voice input coming soon")}
            >
              <Mic className="size-4" />
            </PromptInputButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PromptInputButton tooltip="Focus mode">
                  {focusMode === "web" && <Globe className="size-4" />}
                  {focusMode === "academic" && <GraduationCap className="size-4" />}
                  {focusMode === "writing" && <PenTool className="size-4" />}
                  {focusMode === "youtube" && <Video className="size-4" />}
                  {focusMode === "reddit" && <MessageSquare className="size-4" />}
                </PromptInputButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup value={focusMode} onValueChange={setFocusMode}>
                  {FOCUS_MODE_OPTIONS.map((mode) => (
                    <DropdownMenuRadioItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <PromptInputButton
              tooltip={isResearchMode ? "Deep research on" : "Deep research off"}
              onClick={() => setIsResearchMode(!isResearchMode)}
              className={isResearchMode ? "text-indigo-500 bg-indigo-500/10" : ""}
            >
              <Brain className="size-4" />
            </PromptInputButton>
          </PromptInputTools>

          <PromptInputTools>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PromptInputButton variant="ghost">
                  {getShortDisplayName(selectedModel)}
                </PromptInputButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={selectedModel} onValueChange={onModelChange}>
                  {MODEL_OPTIONS.map((model) => (
                    <DropdownMenuRadioItem key={model.id} value={model.id}>
                      {model.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
