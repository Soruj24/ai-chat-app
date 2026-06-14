"use client";

import React from "react";
import { Source } from "@/types";
import {
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source as SourceLink,
} from "@/components/ai-elements/sources";

interface MessageSourcesProps {
  sources: Source[];
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "example.com";
  }
}

export function MessageSources({ sources }: MessageSourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <Sources>
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source, idx) => (
          <SourceLink
            key={idx}
            href={source.url}
            title={source.title || source.domain || getHostname(source.url || "http://example.com")}
          />
        ))}
      </SourcesContent>
    </Sources>
  );
}
