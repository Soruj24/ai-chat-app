"use client";

import React from "react";
import { Globe, GraduationCap, PenTool, Video, MessageSquare } from "lucide-react";

const FOCUS_MODE_ICONS: Record<string, React.ReactNode> = {
  web: <Globe className="size-4" />,
  academic: <GraduationCap className="size-4" />,
  writing: <PenTool className="size-4" />,
  youtube: <Video className="size-4" />,
  reddit: <MessageSquare className="size-4" />,
};

export function FocusModeIcon({ mode }: { mode: string }) {
  return <>{FOCUS_MODE_ICONS[mode] || <Globe className="size-4" />}</>;
}
