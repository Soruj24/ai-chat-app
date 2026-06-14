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
import { MODEL_OPTIONS } from "@/types/aiInput";
import { useModelDisplayName } from "@/hooks/useModelDisplayName";

interface Props {
  selectedModel: string;
  onModelChange?: (value: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: Props) {
  const { getShortDisplayName } = useModelDisplayName();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-colors hidden md:flex"
        >
          <span className="text-xs font-medium max-w-[80px] truncate">
            {getShortDisplayName(selectedModel)}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Select Model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={onModelChange}>
          {MODEL_OPTIONS.map((model) => (
            <DropdownMenuRadioItem key={model.id} value={model.id}>
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${model.color}`} />
                {model.name}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
