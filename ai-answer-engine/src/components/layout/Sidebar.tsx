"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, User, Search, Code, ShieldCheck, Folder, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioModal } from "@/components/layout/PortfolioModal";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarHistoryItem } from "./SidebarHistoryItem";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

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
  const { user, logout } = useAuth();

  const startEditing = (session: ChatSession) => {
    setEditingSessionId(session.sessionId);
    setEditTitle(session.title || "");
  };

  const saveTitle = () => {
    if (editingSessionId && onUpdateSession) {
      onUpdateSession(editingSessionId, editTitle);
      setEditingSessionId(null);
    }
  };

  const cancelEditing = () => {
    setEditingSessionId(null);
    setEditTitle("");
  };

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 50 } : { width: isOpen ? 280 : 80 }}
      animate={isMobile ? { opacity: 1, y: 0 } : { width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative h-full flex flex-col z-20",
        isMobile ? "w-full bg-background" : "border-r border-border bg-background/50 backdrop-blur-xl hidden md:flex h-screen"
      )}
    >
      {/* Header */}
      {!isMobile && (
      <div className="flex items-center justify-between p-4 h-16 border-b border-border/50">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <Link href="/" className="font-semibold text-lg bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">
              AI Engine
            </Link>
          ) : (
            <Link href="/" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 mx-auto" />
          )}
        </AnimatePresence>
        
        {isOpen && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <ChevronLeft className="h-4 w-4" />
             </Button>
        )}
         {!isOpen && (
            <div className="absolute top-4 right-0 w-full flex justify-center">
                 <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                     <ChevronRight className="h-4 w-4" />
                 </Button>
            </div>
         )}
      </div>
      )}

      {/* New Chat Button */}
      <div className="p-4">
        <Button
            onClick={onNewChat}
            className={cn(
                "w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-sm transition-all duration-200",
                !isOpen && !isMobile && "px-2"
            )}
            variant="outline"
        >
            <Plus className="h-4 w-4 mr-2" />
            {(isOpen || isMobile) && <span>New Thread</span>}
        </Button>
      </div>

      {/* Navigation / History */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
            <SidebarNavItem href="/chat" icon={<Search />} label="Search" isOpen={isOpen || isMobile} active={pathname === "/chat"} />
            <SidebarNavItem href="/discover" icon={<Activity />} label="Discover" isOpen={isOpen || isMobile} active={pathname === "/discover"} />
            <SidebarNavItem href="/collections" icon={<Folder />} label="Collections" isOpen={isOpen || isMobile} active={pathname === "/collections"} />
            <div className="my-4 border-t border-border/50" />
            <div className="text-xs font-medium text-muted-foreground px-4 mb-2">
                {(isOpen || isMobile) && "Recent"}
            </div>
            {history.map((session) => (
              <SidebarHistoryItem
                key={session.sessionId}
                session={session}
                isOpen={isOpen}
                isMobile={isMobile}
                editingSessionId={editingSessionId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                onStartEdit={startEditing}
                onSaveTitle={saveTitle}
                onCancelEdit={cancelEditing}
                onSelectSession={onSelectSession}
                onDeleteSession={onDeleteSession}
              />
            ))}
             {history.length === 0 && (isOpen || isMobile) && (
                 <div className="px-4 text-xs text-muted-foreground italic">No recent chats</div>
             )}
      </div>
      </ScrollArea>

      {/* Footer / User */}
      <div className="p-4 border-t border-border/50 space-y-2">
        {(isOpen || isMobile) ? (
           <PortfolioModal />
        ) : (
           <PortfolioModal 
             trigger={
                <Button variant="ghost" size="icon" className="w-full h-8">
                    <Code className="h-4 w-4" />
                </Button>
             }
           />
        )}

        <div className="pt-2 mt-auto">
            <Link href="/admin" className={cn("block w-full mb-1", !isOpen && "flex justify-center")}>
              <Button variant="ghost" className={cn("w-full justify-start px-2", !isOpen && "justify-center h-10 w-10 p-0")}>
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                </div>
                {(isOpen || isMobile) && (
                  <span className="font-medium truncate ml-3">Admin Panel</span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("w-full justify-start px-2", !isOpen && "justify-center h-10 w-10 p-0")}>
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  {(isOpen || isMobile) && (
                    <div className="flex flex-col items-start text-sm overflow-hidden ml-3">
                      <span className="font-medium truncate">{user ? (user.name || user.email) : "Guest"}</span>
                      <span className="text-xs text-muted-foreground truncate">{user ? "Free Plan" : "Not logged in"}</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
                {user ? (
                  <>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">Log in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="cursor-pointer">Sign up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
