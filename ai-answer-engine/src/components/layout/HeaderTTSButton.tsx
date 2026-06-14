"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, ChevronDown } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function HeaderTTSButton() {
  const {
    isEnabled,
    setIsEnabled,
    isAutoRead,
    setIsAutoRead,
    voices,
    selectedVoice,
    setSelectedVoice,
    speechRate,
    setSpeechRate,
    isSpeaking,
    stop,
  } = useTextToSpeech();

  const [showSettings, setShowSettings] = useState(false);

  const handleToggle = () => {
    if (isSpeaking) {
      stop();
    }
    setIsEnabled(!isEnabled);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative",
            isEnabled && "text-primary bg-primary/10"
          )}
        >
          {isSpeaking ? (
            <VolumeX className="h-5 w-5 animate-pulse" />
          ) : isEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          {isEnabled && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Text to Speech
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tts-enabled" className="text-sm font-normal cursor-pointer">
              Enable TTS
            </Label>
            <Switch
              id="tts-enabled"
              checked={isEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>

        {isEnabled && (
          <>
            <DropdownMenuSeparator />

            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-read" className="text-sm font-normal cursor-pointer">
                  Auto-read answers
                </Label>
                <Switch
                  id="auto-read"
                  checked={isAutoRead}
                  onCheckedChange={setIsAutoRead}
                />
              </div>
            </div>

            <DropdownMenuSeparator />

            <div className="px-3 py-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-normal">Speech Rate</Label>
                <span className="text-xs text-muted-foreground">{speechRate.toFixed(1)}x</span>
              </div>
              <Slider
                value={[speechRate]}
                onValueChange={([value]) => setSpeechRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x</span>
                <span>1x</span>
                <span>2x</span>
              </div>
            </div>

            <DropdownMenuSeparator />

            <div className="px-3 py-2">
              <Label className="text-sm mb-2 block">Voice</Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-between text-sm">
                    <span className="truncate">
                      {selectedVoice?.name || "Select voice"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 max-h-64 overflow-y-auto">
                  {voices.map((voice) => (
                    <DropdownMenuItem
                      key={voice.name}
                      onClick={() => setSelectedVoice(voice)}
                      className={cn(
                        "cursor-pointer",
                        selectedVoice?.name === voice.name && "bg-primary/10"
                      )}
                    >
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={stop}
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop Speaking
                </Button>
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
