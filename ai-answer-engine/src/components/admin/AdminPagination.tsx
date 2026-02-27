 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import { ChevronLeft, ChevronRight } from "lucide-react";
 
 interface AdminPaginationProps {
   page: number;
   totalPages: number;
   onPrev: () => void;
   onNext: () => void;
 }
 
 export function AdminPagination({ page, totalPages, onPrev, onNext }: AdminPaginationProps) {
   if (totalPages <= 1) return null;
   return (
     <div className="flex items-center justify-between border-t border-border/10 p-4 bg-muted/5">
       <div className="text-sm text-muted-foreground">
         Page {page} of {totalPages}
       </div>
       <div className="flex gap-2">
         <Button
           variant="outline"
           size="sm"
           onClick={onPrev}
           disabled={page === 1}
           className="h-8 w-8 p-0"
         >
           <ChevronLeft className="h-4 w-4" />
         </Button>
         <Button
           variant="outline"
           size="sm"
           onClick={onNext}
           disabled={page === totalPages}
           className="h-8 w-8 p-0"
         >
           <ChevronRight className="h-4 w-4" />
         </Button>
       </div>
     </div>
   );
 }
 
