 "use client";
 
 import React from "react";
 import { Brain, Cloud, Link as LinkIcon, Paperclip } from "lucide-react";
 
 interface AIInputAtMenuProps {
   onUpload: () => void;
   onCloudImport: () => void;
   onConnectors: () => void;
   onToggleResearch: () => void;
 }
 
 export function AIInputAtMenu({
   onUpload,
   onCloudImport,
   onConnectors,
   onToggleResearch,
 }: AIInputAtMenuProps) {
   return (
     <div className="absolute left-2 bottom-12 z-20 min-w-[240px] rounded-xl border border-border/50 bg-background/95 backdrop-blur-md shadow-xl p-1">
       <button
         className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-md hover:bg-muted/50"
         onMouseDown={(e) => e.preventDefault()}
         onClick={onUpload}
       >
         <span className="flex items-center gap-2">
           <Paperclip className="h-4 w-4" />
           Upload files or images
         </span>
       </button>
       <button
         className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-md hover:bg-muted/50"
         onMouseDown={(e) => e.preventDefault()}
         onClick={onCloudImport}
       >
         <span className="flex items-center gap-2">
           <Cloud className="h-4 w-4" />
           Add files from cloud
         </span>
       </button>
       <button
         className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-md hover:bg-muted/50"
         onMouseDown={(e) => e.preventDefault()}
         onClick={onConnectors}
       >
         <span className="flex items-center gap-2">
           <LinkIcon className="h-4 w-4" />
           Connectors and sources
         </span>
       </button>
       <button
         className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-md hover:bg-muted/50"
         onMouseDown={(e) => e.preventDefault()}
         onClick={onToggleResearch}
       >
         <span className="flex items-center gap-2">
           <Brain className="h-4 w-4" />
           Deep research
         </span>
       </button>
     </div>
   );
 }
 
