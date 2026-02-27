"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Bot,
  RefreshCw,
  Check,
  FileText,
  User,
  Volume2,
  StopCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ResearchProcess,
  ResearchStep,
} from "@/components/chat/ResearchProcess";
import { SourceCard } from "@/components/ai/SourceCard";
import { LoaderTyping } from "@/components/ai/LoaderTyping";
import { CitationBadge } from "@/components/ai/CitationBadge";
import { Source } from "@/types";

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

export function ChatMessage({
  role,
  content,
  sources,
  isStreaming,
  researchSteps,
  onCopy,
  onRegenerate,
  onShare,
  className,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(content);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Function to process content and inject citation badges
  // This is a simplified version. In a real app, you'd parse the markdown AST.
  // For now, we'll let ReactMarkdown handle the rendering and we can assume citations are [1], [2] etc.
  // or we can custom render specific patterns if needed.

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 py-6 px-4 md:px-0 max-w-3xl mx-auto group",
        isUser ? "justify-end" : "justify-start",
        !isUser && "border-b border-border/40 last:border-0",
        className,
      )}
    >
      {/* Avatar Section */}
      <div className={cn("flex-shrink-0 mt-1", isUser ? "order-2" : "order-1")}>
        {isUser ? (
          <Avatar className="h-8 w-8 ring-2 ring-primary/10 transition-transform hover:scale-105">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-8 w-8 ring-2 ring-indigo-500/10 transition-transform hover:scale-105">
            <AvatarFallback className="bg-indigo-500/10 text-indigo-500">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content Section */}
      <div
        className={cn(
          "flex flex-col gap-2 w-full min-w-0 max-w-full overflow-hidden",
          isUser
            ? "items-end max-w-[85%] md:max-w-[75%]"
            : "order-2 items-start",
        )}
      >
        {/* User Message Bubble */}
        {isUser ? (
          <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-base shadow-sm leading-relaxed selection:bg-primary-foreground/30">
            {content}
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* Research Process */}
            {researchSteps && researchSteps.length > 0 && (
              <ResearchProcess steps={researchSteps} className="mb-6 w-full" />
            )}

            {/* Answer Header */}
            {(content || isStreaming) && (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/80">
                    Answer
                  </span>
                  {isStreaming && !content && (
                    <LoaderTyping size="sm" className="ml-2" />
                  )}
                </div>

                {/* Message Actions */}
                {!isStreaming && content && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={handleSpeak}
                      title={isSpeaking ? "Stop reading" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <StopCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={handleCopy}
                      title="Copy answer"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Markdown Content */}
            {(content || isStreaming) && (
              <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => (
                      <h1
                        className="text-2xl font-bold mt-6 mb-4 text-foreground"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="text-xl font-bold mt-5 mb-3 text-foreground"
                        {...props}
                      />
                    ),
                    h3: (props) => (
                      <h3
                        className="text-lg font-semibold mt-4 mb-2 text-foreground"
                        {...props}
                      />
                    ),
                    ul: (props) => (
                      <ul
                        className="list-disc pl-5 my-4 space-y-1 text-muted-foreground marker:text-muted-foreground"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal pl-5 my-4 space-y-1 text-muted-foreground marker:text-muted-foreground"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="pl-1" {...props} />,
                    p: (props) => (
                      <p
                        className="my-3 last:mb-0 text-foreground/90"
                        {...props}
                      />
                    ),
                    strong: (props) => (
                      <strong
                        className="font-semibold text-foreground bg-primary/10 px-0.5 rounded box-decoration-clone"
                        {...props}
                      />
                    ),
                    code: ({ className, children, ...props }) => {
                      const inline = !className?.includes("language-");
                      return !inline ? (
                        <div className="relative rounded-lg bg-muted/50 border border-border/50 p-4 my-4 overflow-x-auto group">
                          <code
                            className={cn("text-sm font-mono", className)}
                            {...props}
                          >
                            {children}
                          </code>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                navigator.clipboard.writeText(String(children))
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <code
                          className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-foreground border border-border/20"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 bg-secondary/10 py-1 rounded-r-lg"
                        {...props}
                      />
                    ),
                    a: ({ href, children, ...props }) => {
                      const textChild =
                        typeof children === "string"
                          ? children
                          : Array.isArray(children) && children.length === 1
                            ? String(children[0])
                            : null;
                      const isCitation =
                        !!textChild && /^\[\d+\]$/.test(textChild);
                      if (isCitation) {
                        const index = Number(textChild!.replace(/[\[\]]/g, ""));
                        const source =
                          Number.isFinite(index) && index >= 1
                            ? sources?.[index - 1]
                            : undefined;
                        const targetHref = href || source?.url;
                        return (
                          <CitationBadge
                            index={index || 0}
                            href={targetHref}
                            source={source}
                            tooltip={!source ? "Source unavailable" : undefined}
                          />
                        );
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline cursor-pointer font-medium decoration-primary/30 underline-offset-2 hover:decoration-primary"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>

                {/* Streaming Cursor */}
                {isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary animate-pulse rounded-full" />
                )}
              </div>
            )}

            {/* Sources Grid */}
            {sources && sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Sources</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {sources.map((source, idx) => (
                    <SourceCard
                      key={idx}
                      title={source.title}
                      url={source.url}
                      domain={source.domain}
                      index={idx + 1}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isStreaming && content && (
              <div className="flex items-center gap-1 mt-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-muted-foreground hover:text-foreground gap-1.5 rounded-full px-3"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
                </Button>

                {onRegenerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
                    onClick={onRegenerate}
                    title="Regenerate"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                )}

                {onShare && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
                    onClick={onShare}
                    title="Share"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                )}

                <div className="flex-1" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground p-0"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
