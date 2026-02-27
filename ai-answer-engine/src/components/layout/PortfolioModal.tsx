"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
  Mail,
  Cpu,
  Globe,
  Database,
  Code,
  Layers,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function PortfolioModal({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Code className="h-4 w-4" />
            <span>About Project</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="h-full max-h-[80vh]">
          <div className="p-6 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                AI Answer Engine
              </DialogTitle>
              <DialogDescription className="text-base">
                An advanced AI-powered research and chat application built with
                modern web technologies. Designed to mimic the capabilities of
                Perplexity.ai with a focus on accuracy, multi-model support, and
                real-time web research.
              </DialogDescription>
            </DialogHeader>

            {/* Tech Stack Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                Tech Stack
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Globe className="h-4 w-4 text-sky-500" />
                    Frontend
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Next.js 14</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">Tailwind CSS</Badge>
                    <Badge variant="outline">Framer Motion</Badge>
                    <Badge variant="outline">Shadcn UI</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 space-y-3">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Cpu className="h-4 w-4 text-orange-500" />
                    AI & Backend
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">LangChain</Badge>
                    <Badge variant="outline">Node.js / Express</Badge>
                    <Badge variant="outline">Groq API</Badge>
                    <Badge variant="outline">Ollama</Badge>
                    <Badge variant="outline">Gemini API</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                Key Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Multi-Model Support (Llama 3, Gemini, Gemma)",
                  "Real-time Web Search & Citation",
                  "Deep Research Mode",
                  "File Analysis (PDF/Text)",
                  "Image Generation",
                  "Streaming Responses",
                  "Markdown & Code Highlighting",
                  "Chat History Management",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Developer Info */}
            <div className="pt-4 border-t border-border/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-foreground">
                    Developed for Portfolio
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Demonstrating full-stack AI engineering capabilities.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
