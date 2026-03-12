/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Bot, RefreshCw, Check, Volume2, VolumeX, Bookmark, Download, Plus, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/swal";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

import { LoaderTyping } from "@/components/ai/LoaderTyping";
import { ResearchProcess, ResearchStep } from "./ResearchProcess";
import { MessageImages } from "./MessageImages";
import { MessageSources } from "./MessageSources";
import { MessageMarkdown } from "./MessageMarkdown";

import { Source } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageProps {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  images?: string[];
  isStreaming?: boolean;
  researchSteps?: ResearchStep[];
  suggestions?: string[];
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(function Message(
  {
    id,
    role,
    content,
    sources,
    images,
    isStreaming,
    researchSteps,
    suggestions,
    isBookmarked,
    onBookmark,
    onShare,
    onSuggestionClick,
  }: MessageProps,
  ref,
) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messageRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.name.includes("Google US English")) ||
        voices.find((v) => v.lang === "en-US");
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleDownloadImage = async () => {
    if (messageRef.current) {
      try {
        const canvas = await html2canvas(messageRef.current, {
          backgroundColor: "transparent", // Transparent background
          scale: 2, // Higher resolution
        });
        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = data;
        link.download = `ai-answer-${Date.now()}.png`;
        link.click();
      } catch (error) {
        console.error("Failed to generate image:", error);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "AI Answer",
          text: content,
        })
        .catch(console.error);
    } else {
      handleCopy();
      showToast("Link copied to clipboard (simulated share)");
    }
    if (onShare) onShare();
  };

  const handleSaveToCollection = async () => {};

  // Preprocess content to turn [1] into markdown links [[1]](#source-1)
  const processedContent = React.useMemo(() => {
    if (!content) return "";

    // Simple replacement for citations to work with our custom components
    // We'll replace [1] with a custom link format that our markdown renderer can detect
    // Using a distinct pattern like [^1] which is standard for footnotes
    return content.replace(/\[(\d+)\]/g, "[^$1]");
  }, [content]);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "example.com";
    }
  };

  return (
    <motion.div
      layout
      ref={(node) => {
        messageRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 py-6",
        isUser ? "justify-end" : "justify-start border-b border-border/40",
      )}
    >
      {/* Avatar Section */}
      <div className={cn("flex-shrink-0 mt-1", isUser ? "order-2" : "order-1")}>
        {isUser ? (
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">
              U
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 ring-2 ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content Section */}
      <div
        className={cn(
          "flex flex-col gap-2 w-full max-w-full overflow-hidden",
          isUser
            ? "items-end max-w-[85%] md:max-w-[75%]"
            : "order-2 items-start",
        )}
      >
        {/* User Message Bubble */}
        {isUser ? (
          <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-base shadow-sm">
            {content}
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* Research Process */}
            {researchSteps && researchSteps.length > 0 && (
              <ResearchProcess steps={researchSteps} className="mb-6" />
            )}

            <MessageImages images={images || []} />

            {/* Research Process - Perplexity Style Steps */}
            {researchSteps && researchSteps.length > 0 && (
              <div className="mb-6">
                <ResearchProcess steps={researchSteps} />
              </div>
            )}

            {/* Header / Title */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium bg-secondary/60 text-foreground px-2 py-0.5 rounded-full border border-border/50">
                Answer
              </span>
              {sources && sources.length > 0 && (
                <span className="text-[10px] font-medium bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-500/20">
                  Web‑verified
                </span>
              )}
              {sources && sources.length > 0 && (
                <span className="text-[10px] font-medium bg-muted/40 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                  {sources.length} Sources
                </span>
              )}
              {researchSteps && researchSteps.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/20 font-medium">
                  <Brain className="h-3 w-3" />
                  Deep Research
                </span>
              )}
              {isStreaming && <LoaderTyping size="sm" />}
            </div>

            <MessageMarkdown
              processedContent={processedContent}
              sources={sources}
              isStreaming={isStreaming}
            />

            {/* Sources list below the answer */}
            <MessageSources sources={sources || []} />

            {/* Actions Bar */}
            {!isStreaming && (
              <div className="flex items-center gap-2 mt-4 pt-2 border-t border-border/30">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label="Copy answer"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy answer</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSpeak}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
                      >
                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isSpeaking ? "Stop reading" : "Read aloud"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {onBookmark && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onBookmark}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          aria-label="Bookmark"
                        >
                          <Bookmark
                            className={cn(
                              "h-4 w-4",
                              isBookmarked && "fill-current text-indigo-500",
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isBookmarked ? "Bookmarked" : "Bookmark"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownloadImage}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label="Download image of answer"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label="Share answer"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && !isStreaming && (
              <div className="mt-8 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground/80">
                  <RefreshCw className="h-4 w-4" />
                  <span>Follow-ups</span>
                </div>
                <div className="flex flex-col gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="group flex items-center justify-between px-4 py-3 text-sm text-left bg-card/50 hover:bg-muted/50 border border-border/50 rounded-xl transition-all duration-200"
                    >
                      <span className="truncate flex-1 mr-4 text-foreground/90 group-hover:text-primary transition-colors">
                        {suggestion}
                      </span>
                      <div className="h-6 w-6 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});
