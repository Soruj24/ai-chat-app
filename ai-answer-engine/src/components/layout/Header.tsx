"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { Menu } from "lucide-react";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { BookmarksList } from "@/components/chat/BookmarksList";
import { HeaderModelBadge } from "./HeaderModelBadge";
import { HeaderExportMenu } from "./HeaderExportMenu";
import { HeaderSearchButton } from "./HeaderSearchButton";
import { HeaderNotificationsButton } from "./HeaderNotificationsButton";

interface HeaderProps {
    toggleSidebar: () => void;
    selectedModel?: string;
    onExportChat?: (format: 'json' | 'md') => void;
}

export function Header({  selectedModel = "llama3.2", onExportChat }: HeaderProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <HeaderModelBadge selectedModel={selectedModel} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {onExportChat && <HeaderExportMenu onExportChat={onExportChat} />}
          <HeaderSearchButton />
          <BookmarksList />
          <HeaderNotificationsButton />
          <UserDropdown />
        </div>
      </header>

      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onOpenChange={setIsMobileSidebarOpen} 
      />
    </>
  );
}
