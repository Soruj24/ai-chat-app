 "use client";
 
 import React from "react";
 import { AIInput } from "@/components/ai/AIInput";
 
 interface StickyInputProps {
   show: boolean;
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
 
 export function StickyInput({
   show,
   onSearch,
   selectedModel,
   onModelChange,
 }: StickyInputProps) {
   if (!show) return null;
 
   return (
     <div className="flex-none sticky bottom-0 z-20 bg-background/95 backdrop-blur-xl border-t border-border/40 px-4 py-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
       <div className="max-w-3xl mx-auto">
         <AIInput
           onSearch={onSearch}
           placeholder="Ask a follow up..."
           className="w-full shadow-lg"
           selectedModel={selectedModel}
           onModelChange={onModelChange}
         />
         <div className="flex justify-center mt-2">
           <span className="text-[10px] text-muted-foreground">
             AI-generated content may be inaccurate.
           </span>
         </div>
       </div>
     </div>
   );
 }
 
