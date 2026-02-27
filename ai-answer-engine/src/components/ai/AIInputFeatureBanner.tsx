import React from "react";
import { Sparkles } from "lucide-react";

interface Props {
  text: string;
  className?: string;
}

export function AIInputFeatureBanner({ text, className }: Props) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground " +
        (className || "")
      }
    >
      <Sparkles className="h-3 w-3 text-primary" />
      <span className="text-center">{text}</span>
    </div>
  );
}
