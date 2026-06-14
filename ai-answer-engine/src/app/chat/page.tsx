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
import jsPDF from "jspdf";

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

  const { messages, ask, isStreaming, history, loadSession, deleteSession, updateSession, startNewChat, selectedModel, setSelectedModel, toggleBookmark, togglePin, toggleFavorite } = useAskAI(handleSourcesUpdate);

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


  const handleExportChat = (format: 'json' | 'md' | 'pdf') => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    if (format === 'pdf') {
      const doc = new jsPDF();
      let y = 20;
      
      doc.setFontSize(16);
      doc.text("Chat Export", 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 20, y);
      y += 15;

      messages.forEach((msg) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        const role = msg.role === 'user' ? 'You' : 'AI';
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${role}:`, 20, y);
        y += 7;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(msg.content, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 5;

        if (msg.sources && msg.sources.length > 0) {
          doc.setFontSize(9);
          doc.setTextColor(100);
          msg.sources.forEach((s, i) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.text(`[${i + 1}] ${s.title} - ${s.url}`, 20, y);
            y += 5;
          });
          doc.setTextColor(0);
          y += 5;
        }
      });

      doc.save(`chat-export-${timestamp}.pdf`);
      return;
    }

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
        <Header toggleSidebar={toggleSidebar} selectedModel={selectedModel} onModelChange={setSelectedModel} onExportChat={handleExportChat} />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
            <ChatArea 
                messages={messages}
                ask={ask}
                isStreaming={isStreaming}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                onBookmark={toggleBookmark}
                onPin={togglePin}
                onFavorite={toggleFavorite}
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
