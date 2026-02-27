 "use client";
 
 import React from "react";
 import { Button } from "@/components/ui/button";
 import { Bell } from "lucide-react";
 
 export function HeaderNotificationsButton() {
   return (
     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" title="Notifications">
       <Bell className="h-5 w-5" />
       <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
     </Button>
   );
 }
 
