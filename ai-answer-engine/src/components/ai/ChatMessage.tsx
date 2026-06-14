"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Bot, Check, User, Volume2, StopCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ResearchProcess, ResearchStep } from "@/components/chat/ResearchProcess";
import { LoaderTyping } from "@/components/ai/LoaderTyping";
import { MessageActions } from "@/components/ai/MessageActions";
import { ChatMarkdown } from "@/components/ai/ChatMarkdown";
import { MessageSourcesGrid } from "@/components/ai/MessageSourcesGrid";
import type { Source } from "@/types";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
  researchSteps?: ResearchStep[];
  onCopy?: () => void;
  onRegenerate?: () => void;
  onShare?: () => void;
  className?: string;
}

export function ChatMessage({ role, content, sources, isStreaming, researchSteps, onCopy, onRegenerate, onShare, className }: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => { return () => { if (isSpeaking) window.speechSynthesis.cancel(); }; }, [isSpeaking]);

  const handleCopy = () => { if (onCopy) onCopy(); else navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleSpeak = () => { if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); } else { const u = new SpeechSynthesisUtterance(content); u.onend = () => setIsSpeaking(false); window.speechSynthesis.speak(u); setIsSpeaking(true); } };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={cn("flex w-full gap-4 py-6 px-4 md:px-0 max-w-3xl mx-auto group", isUser ? "justify-end" : "justify-start", !isUser && "border-b border-border/40 last:border-0", className)}>
      <div className={cn("flex-shrink-0 mt-1", isUser ? "order-2" : "order-1")}>
        <Avatar className={cn("h-8 w-8 ring-2 transition-transform hover:scale-105", isUser ? "ring-primary/10" : "ring-indigo-500/10")}>
          <AvatarFallback className={cn(isUser ? "bg-primary/10 text-primary" : "bg-indigo-500/10 text-indigo-500")}>
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className={cn("flex flex-col gap-2 w-full min-w-0 max-w-full overflow-hidden", isUser ? "items-end max-w-[85%] md:max-w-[75%]" : "order-2 items-start")}>
        {isUser ? (
          <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-base shadow-sm leading-relaxed selection:bg-primary-foreground/30">{content}</div>
        ) : (
          <div className="w-full space-y-6">
            {researchSteps && researchSteps.length > 0 && <ResearchProcess steps={researchSteps} className="mb-6 w-full" />}
            {(content || isStreaming) && (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/80">Answer</span>
                  {isStreaming && !content && <LoaderTyping size="sm" className="ml-2" />}
                </div>
                {!isStreaming && content && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={handleSpeak} title={isSpeaking ? "Stop reading" : "Read aloud"}>
                      {isSpeaking ? <StopCircle className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={handleCopy} title="Copy answer">
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                )}
              </div>
            )}
            {(content || isStreaming) && <ChatMarkdown content={content} sources={sources} isStreaming={isStreaming} />}
            <MessageSourcesGrid sources={sources || []} />
            {!isStreaming && content && <MessageActions copied={copied} isStreaming={isStreaming} onCopy={handleCopy} onRegenerate={onRegenerate} onShare={onShare} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
