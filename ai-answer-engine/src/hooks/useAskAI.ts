import { useState, useCallback, useEffect } from "react";
import { Source, ResearchStep, Message } from "@/types";
import { useAuth } from "@/context/AuthContext";

export interface ChatSession {
  sessionId: string;
  title: string;
  updatedAt: string;
}

export function useAskAI(onSourcesUpdate?: (sources: Source[]) => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini/gemma-4-31b-it");
  const { token, isLoading: authLoading } = useAuth();

  const rankAndDedupSources = useCallback((sources: Source[]): Source[] => {
    const seen = new Set<string>();
    const score = (s: Source) => {
      const url = s.url || "";
      let domain = "";
      try {
        domain = url ? new URL(url).hostname : "";
      } catch {
        domain = "";
      }
      let sc = 0;
      if (/(\.gov|\.edu|\.ac\.)/i.test(domain)) sc += 5;
      if (/wikipedia\.org$/i.test(domain)) sc += 4;
      if (/docs|developer|support|help|api/i.test(url)) sc += 3;
      if (/nytimes|bbc|reuters|apnews|nature|science|arxiv/i.test(url)) sc += 3;
      if ((s.content || "").length > 140) sc += 1;
      return sc;
    };
    const normKey = (s: Source) =>
      (s.url || "").replace(/\/+$/, "") + "|" + (s.title || "").toLowerCase().trim();
    const dedup = sources.filter((s) => {
      const k = normKey(s);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    return dedup.sort((a, b) => score(b) - score(a)).slice(0, 5);
  }, []);

  // Initialize session ID
  useEffect(() => {
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    if (token && !authLoading) {
      fetchHistory();
    }
  }, [token, authLoading]);

  const fetchHistory = async () => {
    if (!token) return;
    // Skip if no external API is configured
    if (!process.env.NEXT_PUBLIC_API_URL) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/history`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const loadSession = async (id: string) => {
    if (isStreaming || !token) return; // Prevent switching while streaming or if no token
    if (!process.env.NEXT_PUBLIC_API_URL) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/history/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        
        // Ensure messages have IDs
        const messagesWithIds = data.messages.map((msg: Message, index: number) => ({
          ...msg,
          id: msg.id || `${data.sessionId}-${index}`
        }));

        // Sync with local bookmarks
        try {
          const savedStr = localStorage.getItem("starred_messages");
          if (savedStr) {
            const saved = JSON.parse(savedStr);
            const savedIds = new Set(saved.map((m: Message) => m.id));
            messagesWithIds.forEach((m: Message) => {
              if (m.id && savedIds.has(m.id)) {
                m.isBookmarked = true;
              }
            });
          }
        } catch (e) {
          console.error("Error syncing bookmarks:", e);
        }

        setMessages(messagesWithIds);

        // Update sources if available in the last message
        const lastMsg = data.messages[data.messages.length - 1];
        if (lastMsg && lastMsg.sources && onSourcesUpdate) {
          onSourcesUpdate(lastMsg.sources);
        } else if (onSourcesUpdate) {
          onSourcesUpdate([]);
        }
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const deleteSession = async (id: string) => {
    if (!token) return;
    if (!process.env.NEXT_PUBLIC_API_URL) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/history/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        // If current session is deleted, start a new one
        if (id === sessionId) {
          startNewChat();
        }
        // Refresh history
        await fetchHistory();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const updateSession = async (id: string, newTitle: string) => {
    if (!token) return;
    if (!process.env.NEXT_PUBLIC_API_URL) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/history/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (response.ok) {
        await fetchHistory();
      }
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  const startNewChat = () => {
    if (isStreaming) return;
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);
    setMessages([]);
    if (onSourcesUpdate) onSourcesUpdate([]);
  };

  const toggleBookmark = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => {
      if (msg.id === messageId) {
        const isBookmarked = !msg.isBookmarked;
        
        // Save to localStorage
        try {
          const savedStr = localStorage.getItem("starred_messages");
          const saved = savedStr ? JSON.parse(savedStr) : [];
          
          if (isBookmarked) {
            // Check if already exists
            if (!saved.some((m: Message) => m.id === messageId)) {
              saved.push({ ...msg, isBookmarked: true, savedAt: new Date().toISOString() });
            }
          } else {
            const index = saved.findIndex((m: Message) => m.id === messageId);
            if (index > -1) saved.splice(index, 1);
          }
          localStorage.setItem("starred_messages", JSON.stringify(saved));
          window.dispatchEvent(new Event("bookmarks-updated"));
        } catch (e) {
          console.error("Failed to save bookmark:", e);
        }

        return { ...msg, isBookmarked };
      }
      return msg;
    }));
  };

  const ask = useCallback(
    async (
      query: string,
      isResearchMode: boolean = false,
      model: string = "llama3.2",
      tone: string = "Neutral",
      focusMode: string = "web",
      images?: string[],
    ) => {
      // Add user message with images
      const userMessage: Message = { 
        id: Date.now().toString(),
        role: "user", 
        content: query,
        images: images,
      };
      setMessages((prev) => [...prev, userMessage]);
      setSelectedModel(model);

      // Simulate AI thinking/streaming
      setIsStreaming(true);

      // Initial placeholder for assistant message
      let researchSteps: ResearchStep[] = [];
      if (isResearchMode) {
        researchSteps = [
          {
            id: "init",
            title: "Initializing search...",
            status: "in_progress",
          },
        ];
      }

      setMessages((prev) => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(),
          role: "assistant", 
          content: "", 
          researchSteps 
        },
      ]);

      try {
        const externalApi = process.env.NEXT_PUBLIC_API_URL;
        if (!externalApi) {
          throw new Error("Backend API not configured. Set NEXT_PUBLIC_API_URL");
        }
        // Use external backend that streams SSE JSON
        const response = await fetch(`${externalApi}/api/ask`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            message: query,
            sessionId: sessionId,
            isResearchMode: isResearchMode,
            model: model,
            tone: tone,
            focusMode: focusMode,
            images: images,
          }),
        });
        if (!response.ok) throw new Error("Failed to connect to backend");
        if (!response.body) throw new Error("No response body");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";
          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMsgIndex = newMessages.length - 1;
                const lastMsg = { ...newMessages[lastMsgIndex] };
                if (lastMsg.role === "assistant") {
                  if (data.type === "answer") {
                    lastMsg.content = (lastMsg.content || "") + data.content;
                  } else if (data.type === "step") {
                    const content = data.content as string;
                    const toolName = data.tool as string | undefined;
                    const newSteps = lastMsg.researchSteps ? [...lastMsg.researchSteps] : [];
                    if (newSteps.length > 0 && newSteps[0].id === "init") newSteps.shift();
                    if (content.startsWith("Completed:")) {
                      let found = false;
                      if (toolName) {
                        for (let i = newSteps.length - 1; i >= 0; i--) {
                          if (newSteps[i].status === "in_progress" && newSteps[i].toolName === toolName) {
                            newSteps[i] = { ...newSteps[i], status: "completed" };
                            found = true;
                            break;
                          }
                        }
                      }
                      if (!found) {
                        for (let i = newSteps.length - 1; i >= 0; i--) {
                          if (newSteps[i].status === "in_progress") {
                            newSteps[i] = { ...newSteps[i], status: "completed" };
                            break;
                          }
                        }
                      }
                    } else {
                      newSteps.push({
                        id: Date.now().toString() + Math.random().toString().slice(2),
                        title: content,
                        status: "in_progress",
                        toolName,
                      });
                    }
                    lastMsg.researchSteps = newSteps;
                    if (data.sources) {
                      const ranked = rankAndDedupSources(data.sources);
                      lastMsg.sources = ranked;
                      onSourcesUpdate?.(ranked);
                    }
                    if (data.images) lastMsg.images = data.images;
                  } else if (data.type === "done") {
                    if (data.sources) {
                      const ranked = rankAndDedupSources(data.sources);
                      lastMsg.sources = ranked;
                      onSourcesUpdate?.(ranked);
                    }
                    if (data.images) lastMsg.images = data.images;
                    if (data.suggestions) {
                      const uniq = Array.from(new Set<string>(data.suggestions))
                        .map((s) => String(s).trim())
                        .filter((s) => s.length >= 8)
                        .slice(0, 3);
                      lastMsg.suggestions = uniq;
                    }
                    setIsStreaming(false);
                    fetchHistory();
                  } else if (data.type === "error") {
                    lastMsg.content += `\n\n**Error**: ${data.message}`;
                    setIsStreaming(false);
                  }
                  newMessages[lastMsgIndex] = lastMsg;
                }
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      } catch (error: unknown) {
        console.error("Chat Error:", error);
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMsgIndex = newMessages.length - 1;
          if (
            newMessages[lastMsgIndex] &&
            newMessages[lastMsgIndex].role === "assistant"
          ) {
            newMessages[lastMsgIndex].content +=
              `\n\n**Error**: ${(error as Error).message || "Could not connect to backend"}`;
          }
          return newMessages;
        });
        setIsStreaming(false);
      }
    },
    [sessionId, onSourcesUpdate],
  );

  return {
    messages,
    ask,
    isStreaming,
    sessionId,
    setMessages,
    history,
    loadSession,
    deleteSession,
    updateSession,
    startNewChat,
    selectedModel,
    setSelectedModel,
    toggleBookmark,
  };
}
