"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./MarkdownComponents";
import type { Source } from "@/types";

interface MessageMarkdownProps {
  processedContent: string;
  sources?: Source[];
  isStreaming?: boolean;
}

export function MessageMarkdown({ processedContent, sources, isStreaming }: MessageMarkdownProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents(sources)}>
        {processedContent}
      </ReactMarkdown>
      {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-indigo-500 animate-pulse" />}
    </div>
  );
}
