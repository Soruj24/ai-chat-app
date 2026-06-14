"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export function SidebarHeader({ isOpen, isMobile, toggleSidebar }: SidebarHeaderProps) {
  if (isMobile) return null;

  return (
    <div className="flex items-center justify-between p-4 h-16 border-b border-border/50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <Link href="/" className="font-semibold text-lg bg-gradient-to-r from-indigo-500 to-sky-500 bg-clip-text text-transparent">AI Engine</Link>
        ) : (
          <Link href="/" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 mx-auto" />
        )}
      </AnimatePresence>
      {isOpen ? (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto"><ChevronLeft className="h-4 w-4" /></Button>
      ) : (
        <div className="absolute top-4 right-0 w-full flex justify-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}
