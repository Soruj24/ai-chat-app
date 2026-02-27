"use client";

import React from "react";
import { motion } from "framer-motion";
import { Message } from "@/components/chat/Message";

export function DemoPreviewSection() {
  const [userMsg, setUserMsg] = React.useState<string | null>(null);
  const [assistantMsg, setAssistantMsg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadRecent = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/api/admin/chats?limit=1`);
        if (!res.ok) throw new Error("Failed to load recent chat");
        const list = await res.json();
        const first = list?.chats?.[0];
        if (!first?.sessionId) {
          setLoading(false);
          return;
        }
        const detailsRes = await fetch(`${apiUrl}/api/admin/chats/${first.sessionId}`);
        if (!detailsRes.ok) throw new Error("Failed to load chat details");
        const chat = await detailsRes.json();
        const msgs: Array<{ role: string; content: string }> = chat?.messages || [];
        if (msgs.length > 0) {
          // Find last assistant message and its preceding user message
          let aiIndex = -1;
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === "assistant") {
              aiIndex = i;
              break;
            }
          }
          if (aiIndex > 0) {
            setAssistantMsg(msgs[aiIndex].content);
            // Find nearest user message before assistant
            for (let j = aiIndex - 1; j >= 0; j--) {
              if (msgs[j].role === "user") {
                setUserMsg(msgs[j].content);
                break;
              }
            }
          } else {
            // Fallback to first message if only user exists
            const firstUser = msgs.find((m) => m.role === "user");
            setUserMsg(firstUser?.content || null);
          }
        }
      } catch {
        // Silent fail: just show empty state
      } finally {
        setLoading(false);
      }
    };
    loadRecent();
  }, []);

  return (
    <section className="py-32 bg-background relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            See it in action
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience the power of conversational AI search.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              live-preview
            </div>
            <div className="w-16" />
          </div>

          <div className="p-6 md:p-10 space-y-8 min-h-[500px] bg-gradient-to-b from-background to-muted/20">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground">Loading recent activity…</div>
            ) : userMsg || assistantMsg ? (
              <>
                {userMsg && <Message role="user" content={userMsg} />}
                {assistantMsg && <Message role="assistant" content={assistantMsg} />}
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground">No recent conversations yet. Start a new one!</div>
            )}
          </div>

          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
            <div className="max-w-2xl mx-auto pointer-events-none opacity-80">
              <div className="flex items-center gap-2 p-3 rounded-2xl border border-input/50 bg-background/50 shadow-sm">
                <span className="text-muted-foreground text-sm ml-2">Ask a follow up...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
