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
import { ChevronDown } from "lucide-react";
import { TONE_OPTIONS } from "@/types/aiInput";

interface Props {
  selectedTone: string;
  onToneChange: (value: string) => void;
}

export function ToneDropdown({ selectedTone, onToneChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
        >
          <span className="text-xs font-medium max-w-[80px] truncate">
            {selectedTone}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Select Tone</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedTone} onValueChange={onToneChange}>
          {TONE_OPTIONS.map((tone) => (
            <DropdownMenuRadioItem key={tone.value} value={tone.value}>
              {tone.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
