 "use client";
 
 import React from "react";
 
 interface HeaderModelBadgeProps {
   selectedModel?: string;
 }
 
 export function HeaderModelBadge({ selectedModel = "llama3.2" }: HeaderModelBadgeProps) {
   const getModelDisplayName = (model: string) => {
     if (model.startsWith("groq/")) {
       const parts = model.split("/");
       if (parts.length > 1) {
         const modelName = parts[1];
         if (modelName.startsWith("llama")) return "Groq Llama";
         if (modelName.startsWith("mixtral")) return "Groq Mixtral";
         return "Groq " + modelName.split("-")[0];
       }
       return "Groq Model";
     }
     if (model.startsWith("gemini/")) return "Gemini " + model.split("/")[1].replace("gemini-", "");
     if (model === "llama3.2") return "Llama 3.2";
     if (model === "deepseek-r1:1.5b") return "DeepSeek R1";
     return model;
   };
 
   return (
     <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
       <span className="mr-2">Model:</span>
       <span className="text-foreground bg-secondary px-2 py-0.5 rounded-md text-xs border border-border/50">
         {getModelDisplayName(selectedModel)}
       </span>
     </div>
   );
 }
 
