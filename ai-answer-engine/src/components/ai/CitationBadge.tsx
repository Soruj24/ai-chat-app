"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ExternalLink } from "lucide-react";
import { Source } from "@/types";
import Image from "next/image";

interface CitationBadgeProps extends HTMLMotionProps<"span"> {
  index: number;
  href?: string;
  tooltip?: string;
  source?: Source;
}

export function CitationBadge({
  index,
  href,
  tooltip,
  className,
  source,
  ...props
}: CitationBadgeProps) {
  const Component: React.ElementType = href ? motion.a : motion.span;

  const BadgeContent = (
    <Component
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center min-w-[1.2rem] h-[1.2rem] px-1 text-[10px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border/50 align-super ml-0.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer select-none no-underline",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      title={!source ? tooltip : undefined}
      aria-label={`Citation ${index}`}
      {...props}
    >
      {index}
    </Component>
  ) as React.ReactNode;

  if (!source) return BadgeContent;

  const domain =
    source.url ? source.domain || new URL(source.url).hostname : source.domain;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{BadgeContent}</HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-xl"
        align="start"
      >
        <div className="flex flex-col">
          {/* Header Image/Icon area could go here if we had one */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold leading-tight line-clamp-2 text-foreground">
                {source.title}
              </h4>
            </div>

            {domain && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md border border-border/30">
                  <Image
                    src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
                    alt={domain}
                    className="w-3 h-3 rounded-sm opacity-70"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="truncate max-w-[150px]">{domain}</span>
                </div>
              </div>
            )}

            {/* Preview Text */}
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {source.content ||
                `Click to read the full source content on ${domain}.`}
            </p>

            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-2 py-2 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors border border-primary/10"
              >
                Visit Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
