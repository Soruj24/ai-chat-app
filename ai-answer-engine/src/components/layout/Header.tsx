"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { Menu } from "lucide-react";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { BookmarksList } from "@/components/chat/BookmarksList";
import { HeaderModelBadge } from "./HeaderModelBadge";
import { HeaderExportMenu } from "./HeaderExportMenu";
import { HeaderSearchButton } from "./HeaderSearchButton";
import { HeaderNotificationsButton } from "./HeaderNotificationsButton";
import { HeaderTTSButton } from "./HeaderTTSButton";
import { ModelSelectorDialog } from "@/components/ai/ModelSelectorDialog";

interface HeaderProps {
    toggleSidebar: () => void;
    selectedModel?: string;
    onModelChange?: (model: string) => void;
    onExportChat?: (format: 'json' | 'md' | 'pdf') => void;
}

export function Header({ selectedModel = "gemini/gemma-4-31b-it", onModelChange, onExportChat }: HeaderProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsModelDialogOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <HeaderModelBadge selectedModel={selectedModel} onClick={() => setIsModelDialogOpen(true)} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {onExportChat && <HeaderExportMenu onExportChat={onExportChat} />}
          <HeaderSearchButton />
          <HeaderTTSButton />
          <BookmarksList />
          <HeaderNotificationsButton />
          <UserDropdown />
        </div>
      </header>

      <MobileSidebar isOpen={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen} />
      <ModelSelectorDialog open={isModelDialogOpen} onOpenChange={setIsModelDialogOpen} onSelect={onModelChange} />
    </>
  );
}
