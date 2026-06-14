"use client";

import React, { useState, useEffect, useRef } from "react";
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
  onPin?: (messageId: string) => void;
  onFavorite?: (messageId: string) => void;
}

export function ChatArea({
  messages,
  ask,
  isStreaming,
  selectedModel,
  onModelChange,
  onBookmark,
  onPin,
  onFavorite,
}: ChatAreaProps) {
  const handleSearch = async (
    query: string,
    isResearchMode: boolean = false,
    model: string = "groq/llama-3.3-70b-versatile",
    tone: string = "Neutral",
    focusMode: string = "web",
    images?: string[],
  ) => {
    await ask(query, isResearchMode, selectedModel || model, tone, focusMode, images);
  };

  return (
    <div className="flex flex-col h-full relative w-full">
      <div className="flex-1 min-h-0">
        <div className="p-4 md:p-8 h-full">
          <div className="max-w-3xl mx-auto h-full">
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
                onPin={(id) => onPin?.(id)}
                onFavorite={(id) => onFavorite?.(id)}
                onSuggestionClick={(suggestion) => handleSearch(suggestion)}
              />
            )}
          </div>
        </div>
      </div>

      <StickyInput
        show={messages.length > 0}
        onSearch={handleSearch}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
    </div>
  );
}
