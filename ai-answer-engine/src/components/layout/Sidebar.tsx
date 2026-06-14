"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarHistoryItem } from "./SidebarHistoryItem";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarFooter } from "./SidebarFooter";
import { ChatSession } from "@/hooks/useAskAI";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  history?: ChatSession[];
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onUpdateSession?: (sessionId: string, newTitle: string) => void;
  onNewChat?: () => void;
}

export function Sidebar({ isOpen, toggleSidebar, isMobile = false, history = [], onSelectSession, onDeleteSession, onUpdateSession, onNewChat }: SidebarProps) {
  const pathname = usePathname();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const startEditing = (session: ChatSession) => { setEditingSessionId(session.sessionId); setEditTitle(session.title || ""); };
  const saveTitle = () => { if (editingSessionId && onUpdateSession) { onUpdateSession(editingSessionId, editTitle); setEditingSessionId(null); } };
  const cancelEditing = () => { setEditingSessionId(null); setEditTitle(""); };

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 50 } : { width: isOpen ? 280 : 80 }}
      animate={isMobile ? { opacity: 1, y: 0 } : { width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("relative h-full flex flex-col z-20", isMobile ? "w-full bg-background" : "border-r border-border bg-background/50 backdrop-blur-xl hidden md:flex h-screen")}
    >
      <SidebarHeader isOpen={isOpen} isMobile={isMobile} toggleSidebar={toggleSidebar} />

      <div className="p-4">
        <Button onClick={onNewChat} className={cn("w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all duration-200", !isOpen && !isMobile && "px-2")} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          {(isOpen || isMobile) && <span>New Thread</span>}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          <SidebarNavItem href="/chat" icon={<Search />} label="Search" isOpen={isOpen || isMobile} active={pathname === "/chat"} />
          <div className="my-4 border-t border-border/50" />
          {(isOpen || isMobile) && <div className="text-xs font-medium text-muted-foreground px-4 mb-2">Recent</div>}
          {history.map((session) => (
            <SidebarHistoryItem key={session.sessionId} session={session} isOpen={isOpen} isMobile={isMobile} editingSessionId={editingSessionId} editTitle={editTitle} setEditTitle={setEditTitle} onStartEdit={startEditing} onSaveTitle={saveTitle} onCancelEdit={cancelEditing} onSelectSession={onSelectSession} onDeleteSession={onDeleteSession} />
          ))}
          {history.length === 0 && (isOpen || isMobile) && <div className="px-4 text-xs text-muted-foreground italic">No recent chats</div>}
        </div>
      </ScrollArea>

      <SidebarFooter isOpen={isOpen} isMobile={isMobile} />
    </motion.div>
  );
}
