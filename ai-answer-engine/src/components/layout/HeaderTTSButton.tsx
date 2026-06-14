"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TTSSettings } from "@/components/ai/TTSSettings";

export function HeaderTTSButton() {
  const { isEnabled, setIsEnabled, isAutoRead, setIsAutoRead, voices, selectedVoice, setSelectedVoice, speechRate, setSpeechRate, isSpeaking, stop } = useTextToSpeech();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", isEnabled && "text-primary bg-primary/10")}>
          {isSpeaking ? <VolumeX className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5" />}
          {isEnabled && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2"><Volume2 className="h-4 w-4" /> Text to Speech</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tts-enabled" className="text-sm font-normal cursor-pointer">Enable TTS</Label>
            <Switch id="tts-enabled" checked={isEnabled} onCheckedChange={(v) => { if (isSpeaking) stop(); setIsEnabled(v); }} />
          </div>
        </div>
        <TTSSettings isEnabled={isEnabled} isAutoRead={isAutoRead} setIsAutoRead={setIsAutoRead} speechRate={speechRate} setSpeechRate={setSpeechRate} voices={voices} selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} isSpeaking={isSpeaking} stop={stop} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
