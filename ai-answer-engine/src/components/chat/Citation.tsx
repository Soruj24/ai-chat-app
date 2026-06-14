"use client";

import React from "react";
import { Source } from "@/types";
import {
  InlineCitation,
  InlineCitationText,
  InlineCitationCard,
  InlineCitationCardTrigger,
  InlineCitationCardBody,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselItem,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselPrev,
  InlineCitationCarouselNext,
  InlineCitationSource,
} from "@/components/ai-elements/inline-citation";

interface InlineCitationCardProps {
  number: number;
  sources: Source[];
}

export function Citation({ number, sources }: InlineCitationCardProps) {
  const relevantSources = sources.slice(0, 3);

  if (relevantSources.length === 0) {
    return null;
  }

  return (
    <InlineCitation>
      <InlineCitationCard>
        <InlineCitationCardTrigger
          sources={relevantSources.map((s) => s.url || "")}
        >
          {number}
        </InlineCitationCardTrigger>
        <InlineCitationCardBody>
          <InlineCitationCarousel>
            <InlineCitationCarouselHeader>
              <InlineCitationCarouselPrev />
              <InlineCitationCarouselIndex />
              <InlineCitationCarouselNext />
            </InlineCitationCarouselHeader>
            <InlineCitationCarouselContent>
              {relevantSources.map((source, idx) => (
                <InlineCitationCarouselItem key={idx}>
                  <InlineCitationSource
                    title={source.title}
                    url={source.url}
                    description={source.content}
                  />
                </InlineCitationCarouselItem>
              ))}
            </InlineCitationCarouselContent>
          </InlineCitationCarousel>
        </InlineCitationCardBody>
      </InlineCitationCard>
    </InlineCitation>
  );
}
