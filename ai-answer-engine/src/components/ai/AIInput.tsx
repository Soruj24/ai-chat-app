"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { showToast } from "@/lib/swal";
import { AIInputAttachment } from "@/components/ai/AIInputAttachment";
import { AIInputAtMenu } from "@/components/ai/AIInputAtMenu";
import { AIInputFocusPills } from "@/components/ai/AIInputFocusPills";
import { AIInputToolbarLeft } from "@/components/ai/AIInputToolbarLeft";
import { AIInputToolbarRight } from "@/components/ai/AIInputToolbarRight";
import { AIInputResearchBanner } from "@/components/ai/AIInputResearchBanner";
import { AIInputKeyboardHint } from "@/components/ai/AIInputKeyboardHint";
import { AIInputFeatureBanner } from "@/components/ai/AIInputFeatureBanner";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: SpeechRecognitionAlternative | undefined;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognitionConstructor;
  SpeechRecognition: SpeechRecognitionConstructor;
}

export interface AIInputProps {
  onSearch: (
    query: string,
    isResearchMode: boolean,
    model: string,
    tone: string,
    focusMode: string,
  ) => void;
  className?: string;
  placeholder?: string;
  centered?: boolean;
  isGenerating?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function AIInput({
  onSearch,
  className,
  placeholder = "Type @ for connectors and sources",
  centered = false,
  isGenerating = false,
  selectedModel = "llama3.2",
  onModelChange,
}: AIInputProps) {
  const [query, setQuery] = useState("");
  const [isResearchMode, setIsResearchMode] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Neutral");
  const [focusMode, setFocusMode] = useState("web");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachment, setAttachment] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAtMenu, setShowAtMenu] = useState(false);

  const toggleListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      showToast(
        "Speech recognition is not supported in this browser.",
        "error",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition =
        (window as unknown as IWindow).webkitSpeechRecognition ||
        (window as unknown as IWindow).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setQuery((prev) => prev + (prev ? " " : "") + transcript);
      };

      recognitionRef.current.start();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        setAttachment({ name: file.name, content: data.content });
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload file");
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((query.trim() || attachment) && !isGenerating) {
      let finalQuery = query;
      if (attachment) {
        finalQuery = `Context from uploaded file (${attachment.name}):\n${attachment.content}\n\nQuestion: ${query}`;
      }
      onSearch(
        finalQuery,
        isResearchMode,
        selectedModel,
        selectedTone,
        focusMode,
      );
      setQuery("");
      setAttachment(null);
      setIsResearchMode(false);
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }
    if (e.key === "Escape") setShowAtMenu(false);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + "px";
    }
  }, [query]);
  useEffect(() => {
    const endsWithAt = /@(\s*)?$/.test(query);
    setShowAtMenu(isFocused && endsWithAt);
  }, [query, isFocused]);

  return (
    <div className={cn("relative w-full mx-auto", className)}>
      <motion.div
        layout
        initial={false}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex flex-col w-full rounded-2xl glass-card overflow-hidden transition-all duration-300",
          isFocused
            ? "ring-1 ring-primary/20 shadow-lg"
            : "shadow-sm hover:shadow-md",
          centered ? "border-primary/10" : "border-border/50",
        )}
      >
        <div className="flex flex-col w-full">
          {attachment && (
            <AIInputAttachment
              name={attachment.name}
              onRemove={() => setAttachment(null)}
            />
          )}
          <div className="relative flex flex-col w-full">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 scrollbar-hide leading-relaxed"
              rows={1}
            />
            <AIInputFocusPills
              focusMode={focusMode}
              onChange={setFocusMode}
              isResearchMode={isResearchMode}
              onToggleResearch={() => setIsResearchMode(!isResearchMode)}
            />
            {showAtMenu && (
              <AIInputAtMenu
                onUpload={() => {
                  fileInputRef.current?.click();
                  setShowAtMenu(false);
                }}
                onCloudImport={() => {
                  showToast("Cloud import coming soon");
                  setShowAtMenu(false);
                }}
                onConnectors={() => {
                  window.location.href = "/settings";
                  setShowAtMenu(false);
                }}
                onToggleResearch={() => {
                  setIsResearchMode(!isResearchMode);
                  setShowAtMenu(false);
                }}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.md,.json"
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <AIInputToolbarLeft
                isUploading={isUploading}
                onUploadClick={() => fileInputRef.current?.click()}
                focusMode={focusMode}
                onFocusChange={setFocusMode}
                isResearchMode={isResearchMode}
                onToggleResearch={() => setIsResearchMode(!isResearchMode)}
                onCloudImport={() => showToast("Cloud import coming soon")}
                onConnectors={() => (window.location.href = "/settings")}
                onDiscover={() => (window.location.href = "/discover")}
              />
              <AIInputToolbarRight
                selectedTone={selectedTone}
                onToneChange={setSelectedTone}
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                isListening={isListening}
                onToggleListening={toggleListening}
                canSubmit={!!query.trim() && !isGenerating}
                isGenerating={isGenerating}
                onSubmit={() => handleSubmit()}
              />
            </div>
            <AIInputKeyboardHint />
          </div>

          <AIInputResearchBanner isResearchMode={isResearchMode} />
        </div>
      </motion.div>

      {centered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50 hover:border-primary/30 transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Llama 3.2
          </span>
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50 hover:border-primary/30 transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            DeepSeek R1
          </span>
          <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full border border-border/50 hover:border-primary/30 transition-colors cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Gemini 1.5
          </span>
          <AIInputFeatureBanner text="When a user searches, Google collects information from Wikipedia and YouTube, and shows the user the most accurate and relevant information." className="w-full" />
        </motion.div>
      )}
    </div>
  );
}
