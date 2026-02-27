 "use client";
 
 import React from "react";
 import { FileText } from "lucide-react";
 import { Source } from "@/types";
 
 interface MessageSourcesProps {
   sources: Source[];
 }
 
 function getHostname(url: string) {
   try {
     return new URL(url).hostname;
   } catch {
     return "example.com";
   }
 }
 
 export function MessageSources({ sources }: MessageSourcesProps) {
   if (!sources || sources.length === 0) return null;
 
   return (
     <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
       <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
         <FileText className="h-4 w-4" />
         <span>Sources</span>
         <span className="bg-secondary text-secondary-foreground text-[10px] rounded-full px-2 py-0.5 font-medium">
           {sources.length}
         </span>
       </div>
       <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent snap-x">
         {sources.map((source, idx) => (
           <a
             key={idx}
             href={source.url}
             target="_blank"
             rel="noopener noreferrer"
             className="snap-start flex-shrink-0 w-40 md:w-48 flex flex-col justify-between p-3 rounded-xl border border-border/50 bg-card/30 hover:bg-muted/50 transition-all hover:border-primary/30 h-28 md:h-32 group relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
 
             <div className="flex flex-col gap-1 mb-2 relative z-10">
               <span className="text-xs font-medium line-clamp-3 text-foreground group-hover:text-primary transition-colors leading-snug">
                 {source.title}
               </span>
             </div>
 
             <div className="flex items-center gap-2 mt-auto relative z-10">
               <div className="h-5 w-5 rounded-full bg-background border border-border/50 flex items-center justify-center flex-shrink-0 text-[10px] font-medium text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors overflow-hidden">
                 {source.domain ? (
                   <img
                     src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                     alt=""
                     className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                     onError={(e) => (e.currentTarget.style.display = "none")}
                   />
                 ) : (
                   <span className="text-[9px]">{idx + 1}</span>
                 )}
               </div>
               <div className="flex flex-col min-w-0 flex-1">
                 <span className="text-[10px] font-medium text-muted-foreground truncate group-hover:text-foreground transition-colors">
                   {source.domain || getHostname(source.url || "http://example.com")}
                 </span>
                 <span className="text-[9px] text-muted-foreground/60 truncate">
                   {idx + 1}
                 </span>
               </div>
             </div>
           </a>
         ))}
       </div>
     </div>
   );
 }
 
