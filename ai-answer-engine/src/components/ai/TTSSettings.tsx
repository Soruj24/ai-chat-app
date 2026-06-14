"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { VolumeX, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface TTSSettingsProps {
  isEnabled: boolean;
  isAutoRead: boolean;
  setIsAutoRead: (v: boolean) => void;
  speechRate: number;
  setSpeechRate: (v: number) => void;
  voices: { name: string; lang: string }[];
  selectedVoice: { name: string; lang: string } | null;
  setSelectedVoice: (v: { name: string; lang: string }) => void;
  isSpeaking: boolean;
  stop: () => void;
}

export function TTSSettings({
  isEnabled, isAutoRead, setIsAutoRead, speechRate, setSpeechRate,
  voices, selectedVoice, setSelectedVoice, isSpeaking, stop,
}: TTSSettingsProps) {
  if (!isEnabled) return null;

  return (
    <>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-read" className="text-sm font-normal cursor-pointer">Auto-read answers</Label>
          <Switch id="auto-read" checked={isAutoRead} onCheckedChange={setIsAutoRead} />
        </div>
      </div>

      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-normal">Speech Rate</Label>
          <span className="text-xs text-muted-foreground">{speechRate.toFixed(1)}x</span>
        </div>
        <Slider value={[speechRate]} onValueChange={([value]) => setSpeechRate(value)} min={0.5} max={2} step={0.1} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground"><span>0.5x</span><span>1x</span><span>2x</span></div>
      </div>

      <div className="px-3 py-2">
        <Label className="text-sm mb-2 block">Voice</Label>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <Button variant="outline" size="sm" className="w-full justify-between text-sm">
              <span className="truncate">{selectedVoice?.name || "Select voice"}</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
            {voices.map((voice) => (
              <DropdownMenuItem key={voice.name} onClick={() => setSelectedVoice(voice)}
                className={cn("cursor-pointer", selectedVoice?.name === voice.name && "bg-primary/10")}>
                <div className="flex flex-col">
                  <span className="text-sm truncate">{voice.name}</span>
                  <span className="text-xs text-muted-foreground">{voice.lang}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isSpeaking && (
        <div className="px-3 py-2">
          <Button variant="outline" size="sm" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10" onClick={stop}>
            <VolumeX className="h-4 w-4 mr-2" /> Stop Speaking
          </Button>
        </div>
      )}
    </>
  );
}
