 "use client";
 
 import React from "react";
 import { TableRow, TableCell } from "@/components/ui/table";
 import { Skeleton } from "@/components/ui/skeleton";
 
 export function AdminChatsSkeletonRow() {
   return (
     <TableRow className="border-b border-border/10">
       <TableCell>
         <div className="flex flex-col gap-2">
           <Skeleton className="h-4 w-[200px]" />
           <Skeleton className="h-3 w-[150px]" />
         </div>
       </TableCell>
       <TableCell>
         <Skeleton className="h-5 w-[40px]" />
       </TableCell>
       <TableCell>
         <Skeleton className="h-4 w-[120px]" />
       </TableCell>
       <TableCell className="text-right">
         <Skeleton className="h-8 w-8 ml-auto rounded-full" />
       </TableCell>
     </TableRow>
   );
 }
 
