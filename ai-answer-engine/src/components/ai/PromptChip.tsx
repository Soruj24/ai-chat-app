"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PromptChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function PromptChip({
  children,
  icon,
  className,
  onClick,
  ...props
}: PromptChipProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        className={cn(
          "h-auto py-2 px-3 rounded-xl glass-card hover:bg-secondary/50 border-border/50 hover:border-primary/20 text-muted-foreground hover:text-foreground text-sm font-normal justify-start text-left whitespace-normal h-auto min-h-[2.5rem] w-full group transition-all duration-300 shadow-sm hover:shadow-md",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity text-primary">
          {icon || <MessageSquare className="h-4 w-4" />}
        </span>
        <span className="flex-1">{children}</span>
        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300" />
      </Button>
    </motion.div>
  );
}
