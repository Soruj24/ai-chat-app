 "use client";
 
 import React from "react";
 import { TableRow, TableCell } from "@/components/ui/table";
 import { Skeleton } from "@/components/ui/skeleton";
 
 export function AdminUsersSkeletonRow() {
   return (
     <TableRow className="border-b border-border/10">
       <TableCell>
         <div className="flex items-center gap-3">
           <Skeleton className="h-10 w-10 rounded-full" />
           <div className="space-y-2">
             <Skeleton className="h-4 w-[150px]" />
             <Skeleton className="h-3 w-[100px]" />
           </div>
         </div>
       </TableCell>
       <TableCell>
         <Skeleton className="h-5 w-[60px]" />
       </TableCell>
       <TableCell>
         <Skeleton className="h-4 w-[100px]" />
       </TableCell>
       <TableCell className="text-right">
         <Skeleton className="h-8 w-8 ml-auto rounded-full" />
       </TableCell>
     </TableRow>
   );
 }
 
