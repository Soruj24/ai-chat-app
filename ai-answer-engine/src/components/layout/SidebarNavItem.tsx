 "use client";
 
 import React from "react";
 import Link from "next/link";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
 interface SidebarNavItemProps {
   icon: React.ReactNode;
   label: string;
   isOpen: boolean;
   active?: boolean;
   href: string;
 }
 
 export function SidebarNavItem({
   icon,
   label,
   isOpen,
   active = false,
   href,
 }: SidebarNavItemProps) {
   return (
     <Link href={href} className="block w-full">
       <Button
         variant={active ? "secondary" : "ghost"}
         className={cn(
           "w-full justify-start",
           active ? "bg-secondary/50 text-foreground" : "text-muted-foreground hover:text-foreground",
           !isOpen && "justify-center px-2",
         )}
       >
         <span className={cn("h-5 w-5", isOpen && "mr-3")}>{icon}</span>
         {isOpen && <span className="truncate">{label}</span>}
       </Button>
     </Link>
   );
 }
 
