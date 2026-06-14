"use client";

import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message as MessageType } from "@/types";
import { ChatEmptyState } from "./ChatEmptyState";
import { MessageList } from "./MessageList";
import { StickyInput } from "./StickyInput";

interface ChatAreaProps {
  messages: MessageType[];
  ask: (
    query: string,
    isResearchMode?: boolean,
    model?: string,
    tone?: string,
    focusMode?: string,
    images?: string[],
  ) => Promise<void>;
  isStreaming: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  onBookmark?: (messageId: string) => void;
}

export function ChatArea({
  messages,
  ask,
  isStreaming,
  selectedModel,
  onModelChange,
  onBookmark,
}: ChatAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShouldAutoScroll(isAtBottom);
  };

  const handleSearch = async (
    query: string,
    isResearchMode: boolean = false,
    model: string = "groq/llama-3.3-70b-versatile",
    tone: string = "Neutral",
    focusMode: string = "web",
    images?: string[],
  ) => {
    setShouldAutoScroll(true);
    await ask(query, isResearchMode, selectedModel || model, tone, focusMode, images);
  };

  useEffect(() => {
    // Auto-scroll to bottom when messages change, but only if user hasn't scrolled up
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, shouldAutoScroll]);

  return (
    <div className="flex flex-col h-full relative w-full">
      <ScrollArea
        className="flex-1"
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="p-4 md:p-8 min-h-full">
          <div className="max-w-3xl mx-auto space-y-8 pb-4">
            {messages.length === 0 ? (
              <ChatEmptyState
                onSearch={handleSearch}
                selectedModel={selectedModel}
                onModelChange={onModelChange}
              />
            ) : (
              <MessageList
                messages={messages}
                isStreaming={isStreaming}
                onBookmark={(id) => onBookmark?.(id)}
                onSuggestionClick={(suggestion) => handleSearch(suggestion)}
              />
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </ScrollArea>

      <StickyInput
        show={messages.length > 0}
        onSearch={handleSearch}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
    </div>
  );
}
