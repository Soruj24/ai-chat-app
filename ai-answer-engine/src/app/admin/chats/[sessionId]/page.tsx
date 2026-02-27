"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showConfirm, showToast } from "@/lib/swal";
import { ChatDetailHeader } from "@/components/admin/ChatDetailHeader";
import { ChatDetailMessageItem } from "@/components/admin/ChatDetailMessageItem";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatDetail {
  sessionId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:3001/api/admin/chats/${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch chat details");
        const data = await res.json();
        setChat(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      fetchChat();
    }
  }, [sessionId]);

  const handleDelete = async () => {
    const isConfirmed = await showConfirm(
      "Delete Chat Session?",
      "Are you sure you want to delete this chat session? This action cannot be undone."
    );

    if (!isConfirmed) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/admin/chats/${sessionId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete chat");
      
      showToast("Chat session deleted successfully");
      
      router.push("/admin/chats");
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error");
      setDeleteLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-6">
        <Link href="/admin/chats">
          <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chats
          </Button>
        </Link>
        <Alert variant="destructive">
          <AlertDescription>{error || "Chat not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <ChatDetailHeader
        title={chat.title}
        updatedAt={chat.updatedAt}
        sessionId={chat.sessionId}
        messageCount={chat.messages.length}
        copiedId={copiedId}
        onCopyId={() => handleCopy(chat.sessionId, "session-id")}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
      />

      {/* Messages */}
      <div className="space-y-8 px-2 md:px-6">
        {chat.messages.map((msg, idx) => (
          <ChatDetailMessageItem key={idx} role={msg.role} content={msg.content} />
        ))}
      </div>
    </div>
  );
}
