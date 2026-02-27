"use client";

import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ isOpen, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] p-0 rounded-t-2xl border-t border-border/50">
        <Sidebar isOpen={true} toggleSidebar={() => {}} isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}
