 "use client";
 
 import React from "react";
 import { AnimatePresence } from "framer-motion";
 import { Message } from "./Message";
 import { Message as MessageType } from "@/types";
 
 interface MessageListProps {
   messages: MessageType[];
   isStreaming: boolean;
   onBookmark?: (messageId: string) => void;
   onSuggestionClick: (suggestion: string) => void;
 }
 
 export function MessageList({
   messages,
   isStreaming,
   onBookmark,
   onSuggestionClick,
 }: MessageListProps) {
   return (
     <AnimatePresence mode="popLayout">
       {messages.map((msg, index) => (
         <Message
           key={msg.id || `msg-${index}-${(msg.content || "").slice(0, 8)}`}
           id={msg.id}
           role={msg.role}
           content={msg.content}
           sources={msg.sources}
           researchSteps={msg.researchSteps}
           suggestions={msg.suggestions}
           isBookmarked={msg.isBookmarked}
           onBookmark={() => onBookmark?.(msg.id || "")}
           onSuggestionClick={onSuggestionClick}
           isStreaming={index === messages.length - 1 && isStreaming}
         />
       ))}
     </AnimatePresence>
   );
 }
 
