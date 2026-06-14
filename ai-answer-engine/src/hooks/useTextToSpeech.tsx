"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

interface Voice {
  name: string;
  lang: string;
  localService: boolean;
}

interface SpeechOptions {
  text: string;
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface TTSContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isAutoRead: boolean;
  setIsAutoRead: (auto: boolean) => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: (voice: Voice | null) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  isSpeaking: boolean;
  speak: (options: SpeechOptions) => void;
  stop: () => void;
  toggleEnabled: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export function TTSProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ttsEnabled");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [isAutoRead, setIsAutoRead] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ttsAutoRead");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [speechRate, setSpeechRate] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ttsSpeechRate");
      return saved ? JSON.parse(saved) : 1;
    }
    return 1;
  });

  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceList: Voice[] = availableVoices.map((v) => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
      }));
      setVoices(voiceList);

      if (!selectedVoice && voiceList.length > 0) {
        const preferred = voiceList.find(
          (v) => v.name.includes("Google US English") || v.name.includes("Microsoft")
        );
        setSelectedVoice(preferred || voiceList[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  useEffect(() => {
    localStorage.setItem("ttsEnabled", JSON.stringify(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem("ttsAutoRead", JSON.stringify(isAutoRead));
  }, [isAutoRead]);

  useEffect(() => {
    localStorage.setItem("ttsSpeechRate", JSON.stringify(speechRate));
  }, [speechRate]);

  const speak = useCallback(
    ({ text, voice, rate = speechRate, pitch = 1, volume = 1 }: SpeechOptions) => {
      if (!isEnabled || !text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      if (voice) {
        const nativeVoice = window.speechSynthesis.getVoices().find((v) => v.name === voice.name);
        if (nativeVoice) utterance.voice = nativeVoice;
      } else if (selectedVoice) {
        const nativeVoice = window.speechSynthesis.getVoices().find((v) => v.name === selectedVoice.name);
        if (nativeVoice) utterance.voice = nativeVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    },
    [isEnabled, selectedVoice, speechRate]
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentUtterance(null);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      stop();
    }
  }, [isEnabled, stop]);

  return (
    <TTSContext.Provider
      value={{
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
        speak,
        stop,
        toggleEnabled,
      }}
    >
      {children}
    </TTSContext.Provider>
  );
}

export function useTextToSpeech() {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error("useTextToSpeech must be used within a TTSProvider");
  }
  return context;
}
