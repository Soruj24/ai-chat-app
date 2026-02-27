 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { Download, FileJson, FileText } from "lucide-react";
 
 interface HeaderExportMenuProps {
   onExportChat: (format: "json" | "md") => void;
 }
 
 export function HeaderExportMenu({ onExportChat }: HeaderExportMenuProps) {
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button
           variant="ghost"
           size="icon"
           className="text-muted-foreground hover:text-foreground hidden sm:flex"
           title="Export Chat"
         >
           <Download className="h-5 w-5" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end">
         <DropdownMenuItem onClick={() => onExportChat("json")}>
           <FileJson className="mr-2 h-4 w-4" />
           <span>Export as JSON</span>
         </DropdownMenuItem>
         <DropdownMenuItem onClick={() => onExportChat("md")}>
           <FileText className="mr-2 h-4 w-4" />
           <span>Export as Markdown</span>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 }
 
