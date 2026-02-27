 "use client";
 
 import React from "react";
 import ReactMarkdown from "react-markdown";
 import { cn } from "@/lib/utils";
 import { Bot, User } from "lucide-react";
 
 interface ChatDetailMessageItemProps {
   role: "user" | "assistant";
   content: string;
 }
 
 export function ChatDetailMessageItem({ role, content }: ChatDetailMessageItemProps) {
   const isUser = role === "user";
   return (
     <div
       className={cn(
         "flex gap-4 max-w-4xl mx-auto group",
         isUser ? "flex-row-reverse" : "flex-row",
       )}
     >
       <div
         className={cn(
           "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-sm border",
           isUser
             ? "bg-primary text-primary-foreground border-primary"
             : "bg-background border-border text-foreground",
         )}
       >
         {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
       </div>
 
       <div
         className={cn(
           "flex-1 min-w-0 max-w-[85%]",
           isUser ? "flex justify-end" : "flex justify-start",
         )}
       >
         <div
           className={cn(
             "relative px-5 py-4 rounded-2xl shadow-sm border text-sm leading-relaxed overflow-hidden",
             isUser
               ? "bg-primary/5 border-primary/10 text-foreground rounded-tr-sm"
               : "bg-card border-border/40 text-foreground rounded-tl-sm glass-card",
           )}
         >
           <div
             className={cn(
               "text-[10px] font-bold uppercase tracking-wider mb-2 opacity-50",
               isUser ? "text-right" : "text-left",
             )}
           >
             {role}
           </div>
 
           <div className="prose dark:prose-invert max-w-none break-words">
             <ReactMarkdown>{content}</ReactMarkdown>
           </div>
         </div>
       </div>
     </div>
   );
 }
 
