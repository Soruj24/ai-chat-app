"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationBadge } from "@/components/ai/CitationBadge";
import type { Source } from "@/types";

interface ChatMarkdownProps {
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
}

const markdownComponents = (sources?: Source[]) => ({
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold mt-5 mb-3 text-foreground" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc pl-5 my-4 space-y-1 text-muted-foreground marker:text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal pl-5 my-4 space-y-1 text-muted-foreground marker:text-muted-foreground"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 last:mb-0 text-foreground/90" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className="font-semibold text-foreground bg-primary/10 px-0.5 rounded box-decoration-clone"
      {...props}
    />
  ),
  code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
    const inline = !className?.includes("language-");
    return !inline ? (
      <div className="relative rounded-lg bg-muted/50 border border-border/50 p-4 my-4 overflow-x-auto group">
        <code className={cn("text-sm font-mono", className)} {...props}>
          {children}
        </code>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => navigator.clipboard.writeText(String(children))}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    ) : (
      <code
        className="bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-foreground border border-border/20"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4 bg-secondary/10 py-1 rounded-r-lg"
      {...props}
    />
  ),
  a({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const textChild =
      typeof children === "string"
        ? children
        : Array.isArray(children) && children.length === 1
          ? String(children[0])
          : null;
    const isCitation = !!textChild && /^\[\d+\]$/.test(textChild);

    if (isCitation) {
      const index = Number(textChild!.replace(/[\[\]]/g, ""));
      const source = Number.isFinite(index) && index >= 1 ? sources?.[index - 1] : undefined;
      const targetHref = href || source?.url;
      return (
        <CitationBadge
          index={index || 0}
          href={targetHref}
          source={source}
          tooltip={!source ? "Source unavailable" : undefined}
        />
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline cursor-pointer font-medium decoration-primary/30 underline-offset-2 hover:decoration-primary"
        {...props}
      >
        {children}
      </a>
    );
  },
});

export function ChatMarkdown({ content, sources, isStreaming }: ChatMarkdownProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents(sources)}>
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary animate-pulse rounded-full" />
      )}
    </div>
  );
}
