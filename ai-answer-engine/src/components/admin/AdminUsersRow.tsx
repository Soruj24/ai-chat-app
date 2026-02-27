 "use client";
 
 import React from "react";
 import Link from "next/link";
 import { TableRow, TableCell } from "@/components/ui/table";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { Eye, MoreHorizontal, Trash2, Calendar, Shield } from "lucide-react";
 import { format } from "date-fns";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 
 export interface AdminUserRowData {
   _id: string;
   name?: string;
   email: string;
   role: string;
   createdAt: string;
 }
 
 interface AdminUsersRowProps {
   user: AdminUserRowData;
   onDelete: (userId: string) => void;
   deleteLoadingId?: string | null;
 }
 
 const getInitials = (name?: string, email?: string) => {
   if (name) return name.substring(0, 2).toUpperCase();
   if (email) return email.substring(0, 2).toUpperCase();
   return "U";
 };
 
 export function AdminUsersRow({ user, onDelete, deleteLoadingId }: AdminUsersRowProps) {
   return (
     <TableRow className="group border-b border-border/10 hover:bg-muted/5 transition-colors">
       <TableCell>
         <div className="flex items-center gap-3">
           <Avatar className="h-9 w-9 border border-border/50">
             <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
               {getInitials(user.name, user.email)}
             </AvatarFallback>
           </Avatar>
           <div className="flex flex-col">
             <span className="font-medium text-sm text-foreground/90">
               {user.name || "No Name"}
             </span>
             <span className="text-xs text-muted-foreground flex items-center gap-1">
               {user.email}
             </span>
           </div>
         </div>
       </TableCell>
       <TableCell>
         <Badge
           variant={user.role === "admin" ? "default" : "secondary"}
           className={`capitalize font-normal ${
             user.role === "admin"
               ? "bg-primary/90 hover:bg-primary/80"
               : "bg-muted text-muted-foreground hover:bg-muted/80"
           }`}
         >
           {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
           {user.role}
         </Badge>
       </TableCell>
       <TableCell>
         <div className="flex items-center text-sm text-muted-foreground">
           <Calendar className="mr-2 h-3 w-3 opacity-70" />
           {format(new Date(user.createdAt), "MMM d, yyyy")}
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
           <DropdownMenuContent align="end" className="w-[160px]">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuItem asChild>
               <Link
                 href={`/admin/users/${user._id}`}
                 className="flex items-center cursor-pointer"
               >
                 <Eye className="mr-2 h-4 w-4" />
                 View Details
               </Link>
             </DropdownMenuItem>
             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
               Copy Email
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem
               className="text-destructive focus:text-destructive"
               onClick={() => onDelete(user._id)}
               disabled={deleteLoadingId === user._id}
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
 
