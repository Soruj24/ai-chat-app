"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  active?: boolean;
  href: string;
}

export function NavItem({ icon, label, isOpen, active = false, href }: NavItemProps) {
  return (
    <Link href={href} className="block w-full">
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start transition-all duration-200",
          active ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          !isOpen && "justify-center px-2"
        )}
      >
        <span className={cn("h-4 w-4 shrink-0", isOpen && "mr-3")}>{icon}</span>
        {isOpen && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate text-sm font-medium">
            {label}
          </motion.span>
        )}
      </Button>
    </Link>
  );
}
