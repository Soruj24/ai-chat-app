 "use client";
 
 import React from "react";
 import { Paperclip } from "lucide-react";
 
 interface AIInputAttachmentProps {
   name: string;
   onRemove: () => void;
 }
 
 export function AIInputAttachment({ name, onRemove }: AIInputAttachmentProps) {
   return (
     <div className="px-4 pt-3 flex items-center gap-2">
       <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-3 py-1.5 rounded-lg text-sm border border-indigo-500/20">
         <Paperclip className="h-3.5 w-3.5" />
         <span className="truncate max-w-[200px]">{name}</span>
         <button onClick={onRemove} className="ml-2 hover:bg-indigo-500/20 rounded-full p-0.5">
           <span className="sr-only">Remove</span>×
         </button>
       </div>
     </div>
   );
 }
 
