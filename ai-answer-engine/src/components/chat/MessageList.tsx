"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Message } from "./Message";
import { Message as MessageType } from "@/types";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

interface MessageListProps {
  messages: MessageType[];
  isStreaming: boolean;
  onBookmark?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onFavorite?: (messageId: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export function MessageList({
  messages,
  isStreaming,
  onBookmark,
  onPin,
  onFavorite,
  onSuggestionClick,
}: MessageListProps) {
  return (
    <Conversation>
      <ConversationContent>
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <Message
              key={msg.id || `msg-${index}-${(msg.content || "").slice(0, 8)}`}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              sources={msg.sources}
              researchSteps={msg.researchSteps}
              reasoning={msg.reasoning}
              suggestions={msg.suggestions}
              isBookmarked={msg.isBookmarked}
              isPinned={msg.isPinned}
              isFavorite={msg.isFavorite}
              onBookmark={() => onBookmark?.(msg.id || "")}
              onPin={() => onPin?.(msg.id || "")}
              onFavorite={() => onFavorite?.(msg.id || "")}
              onSuggestionClick={onSuggestionClick}
              isStreaming={index === messages.length - 1 && isStreaming}
            />
          ))}
        </AnimatePresence>
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
