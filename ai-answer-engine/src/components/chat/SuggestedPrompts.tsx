"use client";

import React, { useState } from "react";
import { Brain, Code, Globe, MessageSquare, RefreshCw, Zap, Lightbulb, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const allPrompts = [
  {
    icon: <Brain className="h-4 w-4 text-indigo-500" />,
    text: "Explain quantum computing",
    category: "Science",
  },
  {
    icon: <Code className="h-4 w-4 text-emerald-500" />,
    text: "Write a Python script for web scraping",
    category: "Coding",
  },
  {
    icon: <Globe className="h-4 w-4 text-sky-500" />,
    text: "Latest news on renewable energy",
    category: "News",
  },
  {
    icon: <MessageSquare className="h-4 w-4 text-amber-500" />,
    text: "Draft a professional email",
    category: "Writing",
  },
  {
    icon: <Zap className="h-4 w-4 text-yellow-500" />,
    text: "Explain the theory of relativity",
    category: "Physics",
  },
  {
    icon: <Lightbulb className="h-4 w-4 text-orange-500" />,
    text: "Creative ideas for a birthday party",
    category: "Creative",
  },
  {
    icon: <Terminal className="h-4 w-4 text-slate-500" />,
    text: "How to exit Vim?",
    category: "DevOps",
  },
  {
    icon: <Globe className="h-4 w-4 text-blue-500" />,
    text: "Capital cities of South America",
    category: "Geography",
  },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  const [currentPrompts, setCurrentPrompts] = useState(allPrompts.slice(0, 4));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Shuffle and pick 4
    setTimeout(() => {
      const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
      setCurrentPrompts(shuffled.slice(0, 4));
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Suggested Prompts</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-6 w-6 p-0 rounded-full hover:bg-muted text-muted-foreground transition-all duration-300"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh suggestions</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {currentPrompts.map((prompt, index) => (
            <motion.button
              key={`${prompt.text}-${index}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--muted), 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(prompt.text)}
              className="group flex items-center p-3.5 glass-card rounded-xl hover:border-primary/20 transition-all duration-300 text-left w-full"
            >
              <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 mr-3 group-hover:bg-primary/10 transition-colors shadow-sm">
                {React.cloneElement(prompt.icon as React.ReactElement, { className: "h-4 w-4" })}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {prompt.text}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {prompt.category}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
