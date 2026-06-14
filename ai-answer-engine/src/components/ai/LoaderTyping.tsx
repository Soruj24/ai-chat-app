"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ai-elements/shimmer";

interface LoaderTypingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function LoaderTyping({ className, size = "md", showText = false }: LoaderTypingProps) {
  const dotSize = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const containerSize = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} role="status" aria-label="Typing indicator">
      <div className={cn("flex items-center justify-center", containerSize[size])}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("rounded-full bg-current opacity-50", dotSize[size])}
            animate={{
              y: ["0%", "-50%", "0%"],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {showText && (
        <Shimmer className="text-sm text-muted-foreground" duration={2}>
          Thinking...
        </Shimmer>
      )}
      <span className="sr-only">Typing...</span>
    </div>
  );
}
