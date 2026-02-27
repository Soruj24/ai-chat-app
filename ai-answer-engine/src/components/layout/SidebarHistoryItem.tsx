 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { cn } from "@/lib/utils";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
 import { MessageSquare, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
 import { ChatSession } from "@/hooks/useAskAI";
 import { showConfirm } from "@/lib/swal";
 
 interface SidebarHistoryItemProps {
   session: ChatSession;
   isOpen: boolean;
   isMobile: boolean;
   editingSessionId: string | null;
   editTitle: string;
   setEditTitle: (title: string) => void;
   onStartEdit: (session: ChatSession) => void;
   onSaveTitle: () => void;
   onCancelEdit: () => void;
   onSelectSession?: (sessionId: string) => void;
   onDeleteSession?: (sessionId: string) => void;
 }
 
 export function SidebarHistoryItem({
   session,
   isOpen,
   isMobile,
   editingSessionId,
   editTitle,
   setEditTitle,
   onStartEdit,
   onSaveTitle,
   onCancelEdit,
   onSelectSession,
   onDeleteSession,
 }: SidebarHistoryItemProps) {
   const isEditing = editingSessionId === session.sessionId;
 
   if (isEditing) {
     return (
       <div className="group flex items-center w-full">
         <div className="flex items-center w-full gap-1 px-1">
           <Input
             value={editTitle}
             onChange={(e) => setEditTitle(e.target.value)}
             className="h-8 text-xs px-2"
             autoFocus
             onKeyDown={(e) => {
               if (e.key === "Enter") onSaveTitle();
               if (e.key === "Escape") onCancelEdit();
             }}
             onClick={(e) => e.stopPropagation()}
           />
           <Button
             size="icon"
             variant="ghost"
             className="h-8 w-8 text-green-500 hover:text-green-600 shrink-0"
             onClick={(e) => {
               e.stopPropagation();
               onSaveTitle();
             }}
           >
             <Check className="h-4 w-4" />
           </Button>
           <Button
             size="icon"
             variant="ghost"
             className="h-8 w-8 text-red-500 hover:text-red-600 shrink-0"
             onClick={(e) => {
               e.stopPropagation();
               onCancelEdit();
             }}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       </div>
     );
   }
 
   return (
     <div className="group flex items-center w-full">
       <Button
         variant="ghost"
         className={cn(
           "flex-1 justify-start text-sm font-normal text-muted-foreground hover:text-foreground",
           !isOpen && !isMobile && "justify-center px-2",
         )}
         onClick={() => onSelectSession?.(session.sessionId)}
       >
         <MessageSquare className={cn("h-4 w-4", isOpen && "mr-2")} />
         {(isOpen || isMobile) && (
           <span className="truncate">{session.title || "Untitled Chat"}</span>
         )}
       </Button>
       {(isOpen || isMobile) && (
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
             >
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuItem
               onClick={(e) => {
                 e.stopPropagation();
                 onStartEdit(session);
               }}
             >
               <Pencil className="mr-2 h-4 w-4" />
               <span>Rename</span>
             </DropdownMenuItem>
             <DropdownMenuItem
               onClick={async (e) => {
                 e.stopPropagation();
                 const confirmed = await showConfirm(
                   "Delete Chat?",
                   "Are you sure you want to delete this chat conversation?",
                 );
                 if (confirmed) onDeleteSession?.(session.sessionId);
               }}
               className="text-destructive focus:text-destructive focus:bg-destructive/10"
             >
               <Trash2 className="mr-2 h-4 w-4" />
               <span>Delete</span>
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       )}
     </div>
   );
 }
 
