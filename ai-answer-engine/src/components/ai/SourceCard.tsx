"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface SourceCardProps {
  title: string;
  url: string;
  domain?: string;
  favicon?: string;
  index?: number;
  className?: string;
}

export function SourceCard({
  title,
  url,
  domain,
  favicon,
  index,
  className,
}: SourceCardProps) {
  const displayDomain = domain || new URL(url).hostname.replace("www.", "");
  const displayFavicon =
    favicon ||
    `https://www.google.com/s2/favicons?domain=${displayDomain}&sz=32`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden bg-card hover:bg-secondary/30 transition-all duration-300 border-border/50 hover:border-primary/20 hover:shadow-lg dark:hover:shadow-primary/5",
          className,
        )}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col p-3 h-full gap-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-5 w-5 rounded-full bg-background border border-border/50 flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src={displayFavicon}
                  alt=""
                  className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement?.classList.add(
                      "bg-secondary",
                    );
                  }}
                />
                <Globe
                  className="w-3 h-3 text-muted-foreground hidden group-hover:block absolute"
                  style={{ display: "none" }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground truncate group-hover:text-primary transition-colors">
                {displayDomain}
              </span>
            </div>
            {index !== undefined && (
              <span className="text-[10px] font-mono font-medium text-muted-foreground/50 bg-secondary/50 px-1.5 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {index}
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </a>
      </Card>
    </motion.div>
  );
}
