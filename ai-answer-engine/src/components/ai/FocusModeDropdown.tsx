import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Globe,
  GraduationCap,
  PenTool,
  Video,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { FOCUS_MODE_OPTIONS } from "@/types/aiInput";

interface Props {
  focusMode: string;
  onFocusModeChange: (value: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  PenTool: <PenTool className="h-4 w-4" />,
  Video: <Video className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
};

function getFocusLabel(value: string): string {
  if (value === "web") return "Focus";
  if (value === "reddit") return "Social";
  if (value === "future") return "Future";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function FocusModeDropdown({ focusMode, onFocusModeChange }: Props) {
  const currentIcon = FOCUS_MODE_OPTIONS.find((m) => m.value === focusMode)?.icon || "Globe";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          {ICON_MAP[currentIcon]}
          <span className="text-xs font-medium hidden sm:inline-block">
            {getFocusLabel(focusMode)}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        <DropdownMenuLabel>Focus</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={focusMode} onValueChange={onFocusModeChange}>
          {FOCUS_MODE_OPTIONS.map((mode) => (
            <DropdownMenuRadioItem key={mode.value} value={mode.value}>
              {ICON_MAP[mode.icon]} <span className="ml-2">{mode.label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
