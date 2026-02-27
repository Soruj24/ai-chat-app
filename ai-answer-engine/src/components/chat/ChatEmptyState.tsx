 "use client";
 
 import React from "react";
 import { AIInput } from "@/components/ai/AIInput";
 import { SuggestedPrompts } from "./SuggestedPrompts";
 import { TrendingQuestions } from "@/components/ai/TrendingQuestions";
 import { motion } from "framer-motion";
 
 interface ChatEmptyStateProps {
   onSearch: (
     query: string,
     isResearchMode?: boolean,
     model?: string,
     tone?: string,
     focusMode?: string,
   ) => Promise<void>;
   selectedModel?: string;
   onModelChange?: (model: string) => void;
 }
 
 export function ChatEmptyState({
   onSearch,
   selectedModel,
   onModelChange,
 }: ChatEmptyStateProps) {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
     >
       <div className="space-y-2">
         <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
           AI Answer Engine
         </h1>
         <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
           Ask anything, analyze documents, or generate images with professional precision.
         </p>
       </div>
 
       <div className="w-full max-w-2xl">
         <AIInput
           onSearch={onSearch}
           centered
           selectedModel={selectedModel}
           onModelChange={onModelChange}
         />
       </div>
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
         <SuggestedPrompts onSelect={onSearch} />
         <TrendingQuestions onSelect={onSearch} />
       </div>
     </motion.div>
   );
 }
 
