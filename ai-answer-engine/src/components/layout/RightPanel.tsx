"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link2, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Source } from "@/types";
import { SourceListItem } from "./SourceListItem";

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sources?: Source[];
}

export function RightPanel({ isOpen, onClose, sources = [] }: RightPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:flex-col lg:border-l lg:border-border lg:bg-background/95 lg:backdrop-blur-xl lg:pt-0"
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Link2 className="h-4 w-4 text-indigo-500" />
              Sources
            </h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {sources.length > 0 ? (
                sources.map((source, index) => (
                  <SourceListItem key={index} source={source} index={index} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10 flex flex-col items-center gap-2">
                  <Globe className="h-8 w-8 opacity-20" />
                  <p className="text-sm">No sources available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
