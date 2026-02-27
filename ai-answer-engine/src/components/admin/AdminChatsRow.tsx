 "use client";
 
 import React from "react";
 import Link from "next/link";
 import { TableRow, TableCell } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
 import { Eye, MoreHorizontal, Trash2, Clock } from "lucide-react";
 import { format } from "date-fns";
 
 export interface AdminChatRowData {
   sessionId: string;
   title: string;
   updatedAt: string;
   messageCount: number;
   lastMessage: string;
 }
 
 interface AdminChatsRowProps {
   chat: AdminChatRowData;
   onDelete: (sessionId: string) => void;
   deleteLoadingId?: string | null;
 }
 
 export function AdminChatsRow({ chat, onDelete, deleteLoadingId }: AdminChatsRowProps) {
   return (
     <TableRow className="group border-b border-border/10 hover:bg-muted/5 transition-colors">
       <TableCell className="font-medium">
         <div className="flex flex-col gap-1">
           <span className="truncate max-w-[200px] sm:max-w-[300px] font-semibold text-foreground/90">
             {chat.title}
           </span>
           <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px] font-normal opacity-80">
             {chat.lastMessage}
           </span>
         </div>
       </TableCell>
       <TableCell>
         <Badge variant="outline" className="font-mono bg-background/50">
           {chat.messageCount}
         </Badge>
       </TableCell>
       <TableCell>
         <div className="flex items-center text-sm text-muted-foreground">
           <Clock className="mr-2 h-3 w-3 opacity-70" />
           {format(new Date(chat.updatedAt), "MMM d, HH:mm")}
         </div>
       </TableCell>
       <TableCell className="text-right">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
             >
               <MoreHorizontal className="h-4 w-4" />
               <span className="sr-only">Open menu</span>
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuItem asChild>
               <Link
                 href={`/admin/chats/${chat.sessionId}`}
                 className="flex items-center cursor-pointer"
               >
                 <Eye className="mr-2 h-4 w-4" />
                 View Details
               </Link>
             </DropdownMenuItem>
             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(chat.sessionId)}>
               Copy ID
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem
               className="text-destructive focus:text-destructive"
               onClick={() => onDelete(chat.sessionId)}
               disabled={deleteLoadingId === chat.sessionId}
             >
               <Trash2 className="mr-2 h-4 w-4" />
               Delete
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </TableCell>
     </TableRow>
   );
 }
 
