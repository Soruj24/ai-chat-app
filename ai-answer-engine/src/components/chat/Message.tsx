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
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

import { LoaderTyping } from "@/components/ai/LoaderTyping";
import { ResearchProcess, ResearchStep } from "./ResearchProcess";
import { MessageImages } from "./MessageImages";
import { MessageSources } from "./MessageSources";

import { Source } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Message as AiMessage,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
  MessageToolbar,
} from "@/components/ai-elements/message";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

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
  const messageRef = React.useRef<HTMLDivElement>(null);

  const { isEnabled, isAutoRead, isSpeaking, speak, stop, selectedVoice } = useTextToSpeech();

  React.useEffect(() => {
    if (isAutoRead && !isUser && !isStreaming && content && isEnabled) {
      const timer = setTimeout(() => {
        speak({ text: content });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [content, isStreaming, isAutoRead, isUser, isEnabled]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak({ text: content });
    }
  };

  const handleDownloadImage = async () => {
    if (messageRef.current) {
      try {
        const canvas = await html2canvas(messageRef.current, {
          backgroundColor: "transparent",
          scale: 2,
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
      navigator.share({ title: "AI Answer", text: content }).catch(console.error);
    } else {
      handleCopy();
      showToast("Link copied to clipboard (simulated share)");
    }
    if (onShare) onShare();
  };

  const processedContent = React.useMemo(() => {
    if (!content) return "";
    return content.replace(/\[(\d+)\]/g, "[^$1]");
  }, [content]);

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
      <AiMessage from={role}>
        <MessageContent>
          {isUser ? (
            <div className="space-y-2">
              {images && images.length > 0 && (
                <div className="flex flex-wrap gap-2 max-w-[300px]">
                  {images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Upload ${idx + 1}`} className="max-h-40 max-w-full rounded-lg border border-primary/20" />
                  ))}
                </div>
              )}
              <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-base shadow-sm">
                {content}
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6">
              {researchSteps && researchSteps.length > 0 && (
                <ResearchProcess steps={researchSteps} className="mb-6" />
              )}

              <MessageImages images={images || []} />

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

              <MessageResponse>{processedContent}</MessageResponse>

              <MessageSources sources={sources || []} />

              {!isStreaming && (
                <MessageToolbar>
                  <MessageActions>
                    <MessageAction tooltip="Copy answer" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </MessageAction>
                    <MessageAction
                      tooltip={isSpeaking ? "Stop reading" : "Read aloud"}
                      onClick={handleSpeak}
                      className={isSpeaking ? "text-primary bg-primary/10 animate-pulse" : ""}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </MessageAction>
                    {onBookmark && (
                      <MessageAction tooltip={isBookmarked ? "Bookmarked" : "Bookmark"} onClick={onBookmark}>
                        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current text-indigo-500")} />
                      </MessageAction>
                    )}
                    <MessageAction tooltip="Download image" onClick={handleDownloadImage}>
                      <Download className="h-4 w-4" />
                    </MessageAction>
                    <MessageAction tooltip="Share" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </MessageAction>
                  </MessageActions>
                </MessageToolbar>
              )}

              {suggestions && suggestions.length > 0 && !isStreaming && (
                <div className="mt-8 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground/80">
                    <RefreshCw className="h-4 w-4" />
                    <span>Follow-ups</span>
                  </div>
                  <Suggestions>
                    {suggestions.map((suggestion, idx) => (
                      <Suggestion
                        key={idx}
                        suggestion={suggestion}
                        onClick={onSuggestionClick}
                        variant="outline"
                      />
                    ))}
                  </Suggestions>
                </div>
              )}
            </div>
          )}
        </MessageContent>
      </AiMessage>
    </motion.div>
  );
});
