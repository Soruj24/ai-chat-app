"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    } else {
        router.push("/chat");
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground pt-16 pb-32">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4 md:px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400 backdrop-blur-xl"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>New: Research Mode 2.0 is live</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent max-w-4xl"
        >
          Ask anything. <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 bg-clip-text text-transparent">
            Get instant answers.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Stop searching through links. Get direct, accurate answers with citations from the web&apos;s most trusted sources.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full max-w-2xl relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 rounded-2xl opacity-30 blur group-hover:opacity-50 transition duration-500" />
          <form onSubmit={handleSearch} className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-2">
            <Search className="h-6 w-6 text-muted-foreground ml-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explain quantum computing in simple terms..."
              className="w-full bg-transparent border-none text-lg px-4 py-3 focus:outline-none placeholder:text-muted-foreground/50"
            />
            <Button type="submit" size="lg" className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg h-12 px-6">
              Ask AI
            </Button>
          </form>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground/60">
            <span>Try asking:</span>
            {["Stock market trends", "Healthy meal plans", "Python tutorial"].map((item, i) => (
                <span 
                    key={i} 
                    onClick={() => router.push(`/chat?q=${encodeURIComponent(item)}`)}
                    className="px-2 py-1 bg-secondary/30 rounded-md border border-border/30 hover:border-primary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                    {item}
                </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
