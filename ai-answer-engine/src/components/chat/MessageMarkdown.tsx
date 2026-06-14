"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { CitationBadge } from "@/components/ai/CitationBadge";
import { CodeBlockWrapper } from "@/components/ai/CodeBlockWrapper";
import { DataChart } from "./DataChart";
import type { Source } from "@/types";

interface MessageMarkdownProps {
  processedContent: string;
  sources?: Source[];
  isStreaming?: boolean;
}

function parseChartData(children: React.ReactNode) {
  try {
    const raw = String(children).replace(/\n$/, "");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function renderChartBlock(children: React.ReactNode) {
  const chartData = parseChartData(children);
  if (!chartData) {
    return (
      <div className="text-red-500 text-xs p-2 border border-red-500/50 rounded">
        Invalid chart data
      </div>
    );
  }

  const xAxisKey =
    chartData.xAxisKey ||
    (chartData.data?.length > 0 ? Object.keys(chartData.data[0])[0] : "name");

  return (
    <DataChart
      data={chartData.data}
      type={chartData.type || chartData.name || "bar"}
      title={chartData.title}
      description={chartData.description}
      xAxisKey={xAxisKey}
      dataKeys={chartData.series || [{ key: "value", color: "#8884d8" }]}
    />
  );
}

function renderCitation(children: React.ReactNode, sources?: Source[]) {
  if (
    children &&
    children[0] &&
    typeof children[0] === "string" &&
    children[0].startsWith("^")
  ) {
    const index = parseInt(children[0].substring(1));
    const source = sources?.[index - 1];
    if (source) {
      return <CitationBadge index={index} url={source.url} title={source.title} />;
    }
  }
  return null;
}

const markdownComponents = (sources?: Source[]) => ({
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 my-4 space-y-1" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5 my-4 space-y-1" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-1" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 last:mb-0" {...props} />
  ),
  code({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (!inline && language === "chart") return renderChartBlock(children);

    if (!inline && match) {
      return (
        <CodeBlockWrapper
          code={String(children).replace(/\n$/, "")}
          language={language}
        />
      );
    }

    return (
      <code
        className={cn(
          "bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary border border-border/30",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
  a({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const citation = renderCitation(children, sources);
    if (citation) return citation;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
        {...props}
      >
        {children}
      </a>
    );
  },
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className="font-semibold text-foreground bg-indigo-500/10 px-1 rounded box-decoration-clone"
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      className="rounded-xl shadow-lg max-w-full h-auto my-6 border border-border/50"
      {...props}
      loading="lazy"
    />
  ),
  sup({ children }: { children: React.ReactNode }) {
    if (typeof children === "string" && !isNaN(parseInt(children))) {
      const index = parseInt(children);
      const source = sources?.[index - 1];
      if (source) {
        return (
          <CitationBadge index={index} url={source.url} title={source.title} />
        );
      }
    }
    return <span className="text-xs text-muted-foreground">{children}</span>;
  },
});

export function MessageMarkdown({
  processedContent,
  sources,
  isStreaming,
}: MessageMarkdownProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents(sources)}>
        {processedContent}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-indigo-500 animate-pulse" />
      )}
    </div>
  );
}
