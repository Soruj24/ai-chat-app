"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Paperclip, Mic, Brain, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface SearchInputProps {
  onSearch: (query: string, isResearchMode: boolean, images?: string[]) => void;
  className?: string;
  placeholder?: string;
  centered?: boolean;
}

export function SearchInput({ onSearch, className, placeholder = "Ask anything...", centered = false }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isResearchMode, setIsResearchMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { attachedImages, isUploading, fileInputRef, handleImageUpload, removeImage } = useImageUpload();
  const { isListening, toggleListening } = useSpeechRecognition((transcript) => {
    setQuery((prev) => prev + (prev ? " " : "") + transcript);
  });

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() || attachedImages.length > 0) {
      onSearch(query, isResearchMode, attachedImages);
      setQuery("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [query]);

  return (
    <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
      {attachedImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          {attachedImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt={`Attachment ${idx + 1}`} className="h-16 w-16 object-cover rounded-lg border border-border" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
        </div>
      )}
      <div className={cn("relative flex items-end w-full p-3 rounded-2xl border border-input/50 bg-background/50 backdrop-blur-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300", centered ? "shadow-lg border-primary/20 bg-background/80" : "shadow-md")}>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
        <Button variant="ghost" size="icon" className={cn("h-8 w-8 mb-1 mr-2 transition-colors", attachedImages.length > 0 ? "text-primary" : "text-muted-foreground hover:text-primary")} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Paperclip className="h-5 w-5" />}
        </Button>
        <Textarea ref={textareaRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder={isListening ? "Listening..." : placeholder} className="min-h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent p-1 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/50 scrollbar-hide" rows={1} />
        <div className="flex items-center gap-2 ml-2 mb-0.5">
          <Button variant="ghost" size="icon" onClick={toggleListening} className={cn("h-8 w-8 transition-colors", isListening ? "text-red-500 animate-pulse bg-red-500/10" : "text-muted-foreground hover:text-primary")} title={isListening ? "Stop listening" : "Start voice input"}>
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsResearchMode(!isResearchMode)} className={cn("h-8 w-8 transition-colors", isResearchMode ? "text-indigo-500 bg-indigo-500/10" : "text-muted-foreground hover:text-primary")} title="Deep Research Mode">
            <Brain className="h-5 w-5" />
          </Button>
          <Button onClick={() => handleSubmit()} disabled={!query.trim()} size="icon" className={cn("h-8 w-8 rounded-lg transition-all duration-200", query.trim() ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" : "bg-secondary text-muted-foreground cursor-not-allowed")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {centered && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="bg-secondary/50 px-2 py-1 rounded-full border border-border/50">GPT-4o</span>
          <span className="bg-secondary/50 px-2 py-1 rounded-full border border-border/50">Claude 3.5 Sonnet</span>
          <span className="bg-secondary/50 px-2 py-1 rounded-full border border-border/50">Llama 3</span>
        </div>
      )}
    </div>
  );
}
