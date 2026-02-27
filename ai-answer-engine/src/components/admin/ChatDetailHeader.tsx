 "use client";
 
 import React from "react";
 import Link from "next/link";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { ArrowLeft, Clock, Loader2, Trash2, Copy, Check } from "lucide-react";
 import { format } from "date-fns";
 
 interface ChatDetailHeaderProps {
   title: string;
   updatedAt: string;
   sessionId: string;
   messageCount: number;
   copiedId: string | null;
   onCopyId: () => void;
   onDelete: () => void;
   deleteLoading: boolean;
 }
 
 export function ChatDetailHeader({
   title,
   updatedAt,
   sessionId,
   messageCount,
   copiedId,
   onCopyId,
   onDelete,
   deleteLoading,
 }: ChatDetailHeaderProps) {
   return (
     <div className="glass-card border-border/50 rounded-xl p-6 sticky top-0 z-10 backdrop-blur-xl">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-start gap-4">
           <Link href="/admin/chats">
             <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted/50">
               <ArrowLeft className="h-5 w-5" />
             </Button>
           </Link>
           <div className="space-y-1">
             <h2 className="text-2xl font-bold tracking-tight line-clamp-1">{title || "Untitled Chat"}</h2>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
               <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-md">
                 <Clock className="h-3.5 w-3.5" />
                 <span>{format(new Date(updatedAt), "MMM d, yyyy HH:mm")}</span>
               </div>
               <div
                 className="flex items-center gap-1.5 bg-muted/30 px-2 py-0.5 rounded-md font-mono text-xs cursor-pointer hover:bg-muted/50 transition-colors"
                 onClick={onCopyId}
               >
                 <span>ID: {sessionId}</span>
                 {copiedId === "session-id" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 opacity-50" />}
               </div>
               <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                 {messageCount} Messages
               </Badge>
             </div>
           </div>
         </div>
         <Button
           variant="destructive"
           size="sm"
           onClick={onDelete}
           disabled={deleteLoading}
           className="self-end md:self-center shadow-sm"
         >
           {deleteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
           Delete Session
         </Button>
       </div>
     </div>
   );
 }
 
