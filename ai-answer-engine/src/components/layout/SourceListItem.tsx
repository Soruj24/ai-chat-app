 "use client";
 
 import React from "react";
 import { Card } from "@/components/ui/card";
 import { Globe } from "lucide-react";
 import { Source } from "@/types";
 
 interface SourceListItemProps {
   source: Source;
   index: number;
 }
 
 export function SourceListItem({ source, index }: SourceListItemProps) {
   return (
     <Card className="group hover:border-primary/40 hover:shadow-md transition-all">
       <a
         href={source.url}
         target="_blank"
         rel="noopener noreferrer"
         className="block p-3"
       >
         <div className="flex items-start justify-between gap-2 mb-2">
           <div className="flex items-center gap-2 min-w-0">
             {source.domain ? (
               <img
                 src={`https://www.google.com/s2/favicons?domain=${source.domain}&sz=32`}
                 alt=""
                 className="w-4 h-4 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
               />
             ) : (
               <Globe className="w-4 h-4 text-muted-foreground" />
             )}
             <span className="text-xs font-medium text-muted-foreground truncate group-hover:text-indigo-500 transition-colors">
               {source.domain || "Source " + (index + 1)}
             </span>
           </div>
           <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-bold text-indigo-500 flex-shrink-0">
             {index + 1}
           </div>
         </div>
 
         <h3 className="text-sm font-medium leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2">
           {source.title}
         </h3>
       </a>
     </Card>
   );
 }
 
