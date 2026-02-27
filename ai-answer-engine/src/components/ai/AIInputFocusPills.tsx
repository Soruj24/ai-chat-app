 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 
 interface AIInputFocusPillsProps {
   focusMode: string;
   onChange: (value: string) => void;
   isResearchMode: boolean;
   onToggleResearch: () => void;
 }
 
 export function AIInputFocusPills({
   focusMode,
   onChange,
   isResearchMode,
   onToggleResearch,
 }: AIInputFocusPillsProps) {
   return (
     <div className="hidden md:flex items-center gap-2 px-3 pb-2">
       <Button
         variant={focusMode === "web" ? "secondary" : "ghost"}
         size="sm"
         className="h-7 rounded-full px-3 text-xs"
         onClick={() => onChange("web")}
         aria-label="Focus: All"
       >
         All
       </Button>
       <Button
         variant={focusMode === "academic" ? "secondary" : "ghost"}
         size="sm"
         className="h-7 rounded-full px-3 text-xs"
         onClick={() => onChange("academic")}
         aria-label="Focus: Academic"
       >
         Academic
       </Button>
       <Button
         variant={focusMode === "writing" ? "secondary" : "ghost"}
         size="sm"
         className="h-7 rounded-full px-3 text-xs"
         onClick={() => onChange("writing")}
         aria-label="Focus: Writing"
       >
         Writing
       </Button>
       <div className="mx-1 h-4 w-px bg-border/50" />
       <Button
         variant={isResearchMode ? "secondary" : "ghost"}
         size="sm"
         className="h-7 rounded-full px-3 text-xs gap-1.5"
         onClick={onToggleResearch}
         aria-pressed={isResearchMode}
         aria-label="Toggle Deep Research"
       >
         Deep Research
       </Button>
     </div>
   );
 }
 
