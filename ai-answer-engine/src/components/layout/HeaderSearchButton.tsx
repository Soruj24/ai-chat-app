 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import { Search } from "lucide-react";
 
 export function HeaderSearchButton() {
   return (
     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex" title="Search">
       <Search className="h-5 w-5" />
     </Button>
   );
 }
 
