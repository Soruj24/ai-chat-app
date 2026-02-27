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
  const [selectedModel, setSelectedModel] = useState("llama3.2");
  const { token, isLoading: authLoading } = useAuth();

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
    ) => {
      // Add user message
      const userMessage: Message = { 
        id: Date.now().toString(),
        role: "user", 
        content: query 
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
        if (!token) throw new Error("User not authenticated");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/api/ask`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            message: query,
            sessionId: sessionId,
            isResearchMode: isResearchMode,
            model: model,
            tone: tone,
            focusMode: focusMode,
          }),
        });

        if (!response.ok) throw new Error("Failed to connect to backend");
        if (!response.body) throw new Error("No response body");

        // Process the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Split by double newline to handle SSE format
          const chunks = buffer.split("\n\n");
          // Keep the last chunk in buffer as it might be incomplete
          buffer = chunks.pop() || "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);

                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsgIndex = newMessages.length - 1;
                  // Create a deep copy of the last message to avoid mutation issues
                  const lastMsg = { ...newMessages[lastMsgIndex] };

                  if (lastMsg.role === "assistant") {
                    if (data.type === "answer") {
                      // Append new content token
                      lastMsg.content = (lastMsg.content || "") + data.content;
                    } else if (data.type === "step") {
                      const content = data.content as string;
                      const toolName = data.tool as string | undefined;
                      const newSteps = lastMsg.researchSteps
                        ? [...lastMsg.researchSteps]
                        : [];

                      // Remove initial placeholder if present
                      if (newSteps.length > 0 && newSteps[0].id === "init") {
                        newSteps.shift();
                      }

                      if (content.startsWith("Completed:")) {
                        // Find the last in-progress step and mark it as completed
                        // We do this in reverse to find the most recent one
                        let found = false;

                        // 1. Try to find by toolName match first (most accurate)
                        if (toolName) {
                          for (let i = newSteps.length - 1; i >= 0; i--) {
                            if (
                              newSteps[i].status === "in_progress" &&
                              newSteps[i].toolName === toolName
                            ) {
                              newSteps[i] = {
                                ...newSteps[i],
                                status: "completed",
                              };
                              found = true;
                              break;
                            }
                          }
                        }

                        // 2. Fallback: just find the last in-progress step
                        if (!found) {
                          for (let i = newSteps.length - 1; i >= 0; i--) {
                            if (newSteps[i].status === "in_progress") {
                              newSteps[i] = {
                                ...newSteps[i],
                                status: "completed",
                              };
                              found = true;
                              break;
                            }
                          }
                        }

                        // If no running step found, maybe it was already completed or missed
                      } else {
                        // Treat as a new step starting
                        newSteps.push({
                          id:
                            Date.now().toString() +
                            Math.random().toString().slice(2),
                          title: content,
                          status: "in_progress",
                          toolName: toolName,
                        });
                      }

                      // Update the message with new steps
                      lastMsg.researchSteps = newSteps;

                      // Update sources if provided in step event (real-time updates)
                      if (data.sources) {
                        lastMsg.sources = data.sources;
                        if (onSourcesUpdate) {
                          onSourcesUpdate(data.sources);
                        }
                      }
                      
                      // Update images if provided
                      if (data.images) {
                        lastMsg.images = data.images;
                      }
                    } else if (data.type === "done") {
                      if (data.sources) {
                        lastMsg.sources = data.sources;
                        if (onSourcesUpdate) {
                          onSourcesUpdate(data.sources);
                        }
                      }
                      if (data.images) {
                        lastMsg.images = data.images;
                      }
                      if (data.suggestions) {
                        lastMsg.suggestions = data.suggestions;
                      }
                      setIsStreaming(false);
                      // Refresh history after a successful chat completion
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
