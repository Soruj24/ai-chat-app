"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft,  
  Plus, 
  Search, 
  MessageSquare, 
  History, 
  Settings,  
  Menu,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HistoryItem } from "./HistoryItem";
import { ProfileDropdown, ProfileDropdownProps } from "./ProfileDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat?: () => void;
  className?: string;
  user?: ProfileDropdownProps["user"];
  historyGroups?: {
    label: string;
    items: {
      id: string;
      title: string;
      date: Date | string;
    }[];
  }[];
  currentChatId?: string;
  onHistoryItemClick?: (id: string) => void;
  onHistoryItemDelete?: (id: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  className,
  user,
  historyGroups = [],
  currentChatId,
  onHistoryItemClick,
  onHistoryItemDelete
}: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className={cn("flex items-center p-4 h-16 border-b border-border/40", !isOpen && !mobile && "justify-center p-2")}>
        <AnimatePresence mode="wait">
          {(isOpen || mobile) ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5 font-bold text-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <Brain className="w-5 h-5" />
              </div>
              <span className="font-semibold tracking-tight text-foreground">
                Answer Engine
              </span>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary/90"
              onClick={onToggle}
            >
              <Brain className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {(isOpen || mobile) && !mobile && (
           <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
           </Button>
        )}
      </div>

      {/* New Chat Button */}
      <div className={cn("p-3", !isOpen && !mobile && "px-2")}>
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300",
            !isOpen && !mobile && "px-0 justify-center"
          )}
        >
          {isOpen || mobile ? (
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </div>
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation / Main Links */}
      <div className={cn("px-3 py-2 space-y-1", !isOpen && !mobile && "px-2")}>
        <NavItem 
          href="/chat" 
          icon={<MessageSquare className="h-4 w-4" />} 
          label="Chat" 
          isOpen={isOpen || mobile} 
          active={pathname === "/chat" || pathname === "/"} 
        />
        <NavItem 
          href="/search" 
          icon={<Search className="h-4 w-4" />} 
          label="Search" 
          isOpen={isOpen || mobile} 
          active={pathname === "/search"} 
        />
        <NavItem 
          href="/history" 
          icon={<History className="h-4 w-4" />} 
          label="History" 
          isOpen={isOpen || mobile} 
          active={pathname === "/history"} 
        />
      </div>

      {/* History List */}
      <ScrollArea className="flex-1 px-3">
        {(isOpen || mobile) ? (
          <div className="space-y-6 py-2">
            {historyGroups.length > 0 ? (
              historyGroups.map((group, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider px-2">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <HistoryItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        date={item.date}
                        isActive={currentChatId === item.id}
                        onClick={() => onHistoryItemClick?.(item.id)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          onHistoryItemDelete?.(item.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No history yet
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
             {/* Collapsed state indicators could go here */}
             <div className="w-8 h-px bg-border/50" />
          </div>
        )}
      </ScrollArea>

      {/* Footer / User */}
      <div className="p-3 mt-auto border-t border-border/40 bg-background/50 backdrop-blur-sm">
        <div className={cn("flex items-center", (!isOpen && !mobile) ? "justify-center" : "justify-between")}>
          <ProfileDropdown 
            user={user} 
            side={mobile ? "top" : "right"} 
            align={mobile ? "start" : "end"}
            className={(!isOpen && !mobile) ? "w-8 h-8" : ""}
          />
          
          {(isOpen || mobile) && (
            <Link href="/settings">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4" />
                </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: isOpen ? 280 : 70 }}
        animate={{ width: isOpen ? 280 : 70 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-border/40 bg-background/60 backdrop-blur-xl z-30 sticky top-0",
          className
        )}
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Trigger - usually placed in a header, but provided here if needed */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md border-border/50">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-r border-border/40 bg-background/95 backdrop-blur-xl">
             <SidebarContent mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function NavItem({ 
  icon, 
  label, 
  isOpen, 
  active = false, 
  href 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isOpen: boolean; 
  active?: boolean; 
  href: string 
}) {
  return (
    <Link href={href} className="block w-full">
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start transition-all duration-200",
          active 
            ? "bg-primary/10 text-primary hover:bg-primary/15" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          !isOpen && "justify-center px-2"
        )}
      >
        <span className={cn("h-4 w-4 shrink-0", isOpen && "mr-3")}>{icon}</span>
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="truncate text-sm font-medium"
          >
            {label}
          </motion.span>
        )}
      </Button>
    </Link>
  );
}
