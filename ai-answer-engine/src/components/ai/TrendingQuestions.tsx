"use client";

import React from "react";
import { PromptChip } from "./PromptChip";
import { TrendingUp, Sparkles, Code2, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingQuestionsProps {
  onSelect: (question: string) => void;
}

type TrendItem = { text: string; icon: React.ReactElement };

const FALLBACK: TrendItem[] = [
  { text: "Explain quantum computing like I'm 5", icon: <Cpu className="h-4 w-4 text-amber-500" /> },
  { text: "Best practices for React Server Components", icon: <Code2 className="h-4 w-4 text-sky-500" /> },
  { text: "How to center a div in 2026", icon: <Globe className="h-4 w-4 text-pink-500" /> },
  { text: "Write a poem about coding bugs", icon: <Sparkles className="h-4 w-4 text-indigo-500" /> }
];

export function TrendingQuestions({ onSelect }: TrendingQuestionsProps) {
  const [items, setItems] = React.useState<TrendItem[]>(FALLBACK);

  React.useEffect(() => {
    let cancelled = false;
    const fetchActivity = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/api/admin/activity`);
        if (!res.ok) return;
        const data: Array<{ lastMessage?: string }> = await res.json();
        const texts = (data || [])
          .map((d) => (d.lastMessage || "").replace(/\s+\.\.\.$/, "").trim())
          .filter((t) => t.length > 0);
        const unique: string[] = [];
        for (const t of texts) {
          if (!unique.find((u) => u.toLowerCase() === t.toLowerCase())) {
            unique.push(t);
          }
          if (unique.length >= 4) break;
        }
        if (unique.length > 0 && !cancelled) {
          // Assign icons in a simple rotating pattern
          const icons = [
            <Cpu key="cpu" className="h-4 w-4 text-amber-500" />,
            <Code2 key="code2" className="h-4 w-4 text-sky-500" />,
            <Globe key="globe" className="h-4 w-4 text-pink-500" />,
            <Sparkles key="sparkles" className="h-4 w-4 text-indigo-500" />,
          ];
          setItems(unique.map((text, i) => ({ text, icon: icons[i % icons.length] })));
        }
      } catch {
        // ignore - fallback will remain
      }
    };
    fetchActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-2xl mx-auto mt-6 px-1"
    >
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider pl-1">
        <TrendingUp className="h-3 w-3" />
        <span>Trending now</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {items.map((q, i) => (
          <PromptChip 
            key={`${q.text}-${i}`} 
            onClick={() => onSelect(q.text)} 
            icon={React.cloneElement(q.icon as React.ReactElement, { className: "h-4 w-4" })}
            className="hover:border-primary/20 transition-all duration-300"
          >
            {q.text}
          </PromptChip>
        ))}
      </div>
    </motion.div>
  );
}
