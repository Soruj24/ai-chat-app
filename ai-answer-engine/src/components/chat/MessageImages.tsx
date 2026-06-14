"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
} from "@/components/ai-elements/attachments";

interface MessageImagesProps {
  images: string[];
}

export function MessageImages({ images }: MessageImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="mb-6 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
        <span>Images</span>
        <span className="bg-secondary text-secondary-foreground text-[10px] rounded-full px-2 py-0.5 font-medium">
          {images.length}
        </span>
      </div>
      <Attachments variant="grid">
        {images.map((img, idx) => (
          <Attachment
            key={idx}
            data={{
              type: "file",
              filename: `Image ${idx + 1}`,
              mediaType: "image/png",
              url: img,
              id: `img-${idx}`,
            }}
          >
            <AttachmentPreview />
          </Attachment>
        ))}
      </Attachments>
    </div>
  );
}
