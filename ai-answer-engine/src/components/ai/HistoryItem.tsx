"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HistoryItemProps {
  id: string;
  title: string;
  date: string | Date;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  className?: string;
}

export function HistoryItem({
  title,
  date,
  isActive,
  onClick,
  onDelete,
  className,
}: HistoryItemProps) {
  const formattedDate =
    typeof date === "string"
      ? date
      : new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        }).format(date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn("group relative", className)}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-auto py-3 px-3 rounded-lg transition-all duration-200",
          isActive
            ? "bg-secondary text-foreground font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
        )}
        onClick={onClick}
      >
        <MessageSquare
          className={cn(
            "h-4 w-4 mr-3 shrink-0 transition-colors",
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        />

        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-sm truncate w-full">{title}</span>
          <span className="text-[10px] text-muted-foreground/70 flex items-center mt-0.5">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </span>
        </div>

        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
          />
        )}
      </Button>

      {onDelete && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
