"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RightPanel } from "@/components/layout/RightPanel";
import { ChatArea } from "@/components/chat/ChatArea";
import { Source } from "@/types";
import { useAskAI } from "@/hooks/useAskAI";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ChatContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const handleSourcesUpdate = (newSources: Source[]) => {
    setSources(newSources);
  };

  const { messages, ask, isStreaming, history, loadSession, deleteSession, updateSession, startNewChat, selectedModel, setSelectedModel, toggleBookmark } = useAskAI(handleSourcesUpdate);

  // Auto-search if query param exists
  useEffect(() => {
    if (initialQuery && !isLoading && user && messages.length === 0 && !isStreaming) {
      ask(initialQuery);
      // Clean up URL
      router.replace("/chat", { scroll: false });
    }
  }, [initialQuery, isLoading, user, messages.length, isStreaming, ask, router]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }


  const handleExportChat = (format: 'json' | 'md') => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `chat-export-${timestamp}.${format === 'json' ? 'json' : 'md'}`;
    let content = '';

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
    } else {
      content = messages.map(msg => {
        const role = msg.role === 'user' ? 'User' : 'AI';
        const sources = msg.sources?.map((s, i) => `[${i + 1}] ${s.title} (${s.url})`).join('\n') || '';
        return `### ${role}\n\n${msg.content}\n\n${sources ? `**Sources:**\n${sources}\n\n` : ''}`;
      }).join('---\n\n');
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        history={history}
        onSelectSession={loadSession}
        onDeleteSession={deleteSession}
        onUpdateSession={updateSession}
        onNewChat={startNewChat}
      />
      
      <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} selectedModel={selectedModel} onExportChat={handleExportChat} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
            <ChatArea 
                messages={messages}
                ask={ask}
                isStreaming={isStreaming}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onBookmark={toggleBookmark}
            />
        </main>
      </div>

      <RightPanel 
        isOpen={isRightPanelOpen} 
        onClose={() => setIsRightPanelOpen(false)} 
        sources={sources}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
