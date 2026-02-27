import { Request, Response } from "express";
import { createChatAgent, generateFollowUpQuestions } from "../services/agent";
import { Document } from "@langchain/core/documents";
import { Chat } from "../models/Chat";
import { Conversation } from "../models/Conversation";
import { getPineconeClient } from "../services/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select("sessionId title updatedAt");
    res.json(chats);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const chat = await Chat.findOne({ sessionId, userId });
    if (!chat) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.json(chat);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const deletedChat = await Chat.findOneAndDelete({ sessionId, userId });
    if (!deletedChat) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    await Conversation.deleteMany({ sessionId });
    res.json({ message: "Session deleted successfully" });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { title } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  try {
    const chat = await Chat.findOneAndUpdate(
      { sessionId, userId },
      { title },
      { new: true },
    );

    if (!chat) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    res.json(chat);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const askQuestion = async (req: Request, res: Response) => {
  const {
    message,
    query,
    input,
    sessionId,
    isResearchMode,
    model,
    tone,
    focusMode,
  } = req.body;
  
  const userId = req.user?.userId;
  
  if (!userId) {
     res.status(401).json({ error: "Unauthorized" });
     return;
  }

  const userMessage = message || query || input;
  const selectedModel = model || "llama3.2";

  if (!userMessage) {
    res.status(400).json({ error: "Message, query or input is required" });
    return;
  }

  // Determine title if it's a new session (first message)
  // We can do this async or just use the first few words of the query
  const title =
    userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "");

  const currentSessionId = sessionId || `session_${Date.now()}`;

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Initialize agent service
    const { agent } = await createChatAgent(
      currentSessionId,
      isResearchMode,
      selectedModel,
      tone,
      focusMode,
    );

    // Fetch chat history from database
    let sanitizedHistory: (
      | HumanMessage
      | AIMessage
      | SystemMessage
      | ToolMessage
    )[] = [];

    try {
      // Only fetch history if it belongs to the current user
      const chatSession = await Chat.findOne({ sessionId: currentSessionId, userId });
      if (chatSession && chatSession.messages) {
        sanitizedHistory = chatSession.messages.map((m: any) => {
          if (m.role === "user" || m.role === "human") {
            return new HumanMessage(m.content);
          } else if (m.role === "assistant" || m.role === "ai") {
            return new AIMessage(m.content);
          } else if (m.role === "system") {
            return new SystemMessage(m.content);
          } else {
            return new HumanMessage(m.content);
          }
        });
      }
    } catch (err) {
      console.warn("Failed to load history from DB:", err);
    }

    // If using Groq, limit history to prevent token limits
    if (selectedModel.startsWith("groq/")) {
      // Simple heuristic: keep last 10 messages
      // A better approach would be to count tokens, but that's more complex
      if (sanitizedHistory.length > 10) {
        sanitizedHistory = sanitizedHistory.slice(-10);
      }
    }

    const inputs = {
      messages: [...sanitizedHistory, new HumanMessage(userMessage)],
    };

    // Stream the events
    const stream = await agent.streamEvents(inputs, { version: "v2" });

    let finalAnswer = "";
    let sources: { title: string; url: string; content: string; domain?: string }[] = [];
    let images: string[] = [];
    const steps: string[] = [];

    for await (const event of stream) {
      const eventType = event.event;
      console.log(`[Event] ${eventType}`, event.name || "");

      if (eventType === "on_chain_start") {
        // Could log chain start
      } else if (eventType === "on_tool_start") {
        let message = `Using tool: ${event.name}`;
        try {
          const input = event.data?.input;
          if (input) {
            let query = "";
            if (typeof input === "string") {
              query = input;
            } else if (typeof input === "object") {
              // Extract query from common tool input patterns
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              query =
                (input as any).query ||
                (input as any).input ||
                (input as any).url ||
                (input as any).location ||
                "";
              if (!query && Object.keys(input).length > 0) {
                // If query is an object (like { type: 'string' }), it's likely a schema definition or malformed input.
                // We should try to find any string property that looks like a query, or default to a generic message.
                // Don't just stringify the whole object as it looks bad in UI.
                const values = Object.values(input).filter(
                  (v) => typeof v === "string",
                );
                if (values.length > 0) {
                  query = values[0] as string;
                }
              }
            }

            if (query) {
              // Truncate if too long
              const displayQuery =
                query.length > 50 ? query.substring(0, 50) + "..." : query;

              if (event.name === "academic_search") {
                message = `Researching academic papers for "${displayQuery}"`;
              } else if (event.name === "youtube_search") {
                message = `Searching YouTube for "${displayQuery}"`;
              } else if (event.name === "weather") {
                message = `Checking weather for "${displayQuery}"`;
              } else if (event.name === "reddit_search") {
                message = `Searching Reddit for "${displayQuery}"`;
              } else if (event.name === "wikipedia") {
                message = `Reading Wikipedia article "${displayQuery}"`;
              } else if (event.name.includes("search")) {
                message = `Searching for "${displayQuery}"`;
              } else if (
                event.name.includes("scraper") ||
                event.name.includes("fetch")
              ) {
                message = `Reading ${displayQuery}`;
              } else if (event.name.includes("calculator")) {
                message = `Calculating ${displayQuery}`;
              } else {
                message = `Using ${event.name}: ${displayQuery}`;
              }
            }
          }
        } catch (e) {
          console.error("Error parsing tool input for step display:", e);
        }

        steps.push(message);
        res.write(
          `data: ${JSON.stringify({ type: "step", content: message, tool: event.name })}\n\n`,
        );
      } else if (eventType === "on_tool_end") {
        // Capture tool outputs if needed, or just notify completion
        const toolNames = [
          "tavily_search_results_json",
          "web_scraper",
          "serper_search",
          "news_search",
          "vector_search",
          "calculator",
          "academic_search",
          "youtube_search",
          "weather",
          "reddit_search",
          "wikipedia",
        ];

        if (toolNames.includes(event.name) || event.name.startsWith("mcp_")) {
          try {
            const outputStr = event.data.output;

            // Handle if output is already an object
            let output;
            if (typeof outputStr === "string") {
              try {
                output = JSON.parse(outputStr);
              } catch {
                // Treat as raw text content if not JSON
                output = [
                  { title: "Search Result", url: "#", content: outputStr },
                ];
              }
            } else {
              output = outputStr;
            }

            if (output) {
              let resultsToProcess: any[] = [];
              
              if (Array.isArray(output)) {
                resultsToProcess = output;
              } else if (typeof output === "object" && output !== null) {
                 if (Array.isArray((output as any).results)) {
                    resultsToProcess = (output as any).results;
                 }
                 // Check for images
                 if (Array.isArray((output as any).images)) {
                    const newImages = (output as any).images
                      .filter((img: any) => typeof img === "string")
                      .map((img: string) => img);
                    images = [...images, ...newImages];
                 }
              }

              if (resultsToProcess.length > 0) {
                const newSources = resultsToProcess.map((r: any) => {
                  const url = r.url || "#";
                  let domain = "";
                  try {
                    if (url && url !== "#") {
                      domain = new URL(url).hostname;
                    }
                  } catch (e) {
                     // ignore invalid urls
                  }
                  
                  return {
                    title: r.title || "Source",
                    url: url,
                    content: r.content || r.snippet || "",
                    domain: domain,
                  };
                });
                sources = [...sources, ...newSources];
              } else if (typeof output === "string") {
                sources.push({
                  title: "Tool Output",
                  url: "#",
                  content: output,
                  domain: "",
                });
              }
            }
          } catch (e) {
            console.error("Error processing tool output:", e);
          }
        }
        steps.push(`Completed: ${event.name}`);
        res.write(
          `data: ${JSON.stringify({ type: "step", content: `Completed: ${event.name}`, sources, images, tool: event.name })}\n\n`,
        );
      } else if (eventType === "on_chat_model_stream") {
        const content = event.data.chunk?.content;
        // console.log(`[Stream]`, content);
        if (content) {
          finalAnswer += content;
          res.write(`data: ${JSON.stringify({ type: "answer", content })}\n\n`);
        }
      } else {
        // Log other events to debug
        // console.log(`[Unhandled Event] ${eventType}`, event);
      }
    }

    // Generate follow-up suggestions
    let suggestions: string[] = [];
    try {
      // memoryVariables was removed, use sanitizedHistory instead
      const historyArray = sanitizedHistory || [];
      const historyStr = historyArray
        .map((m) => `${m._getType()}: ${m.content}`)
        .join("\n");
      const fullHistory = `${historyStr}\nhuman: ${userMessage}`;

      suggestions = await generateFollowUpQuestions(
        fullHistory,
        finalAnswer,
        selectedModel,
      );
    } catch (e) {
      console.error("Error generating suggestions:", e);
    }

    // Send done signal immediately
    res.write(
      `data: ${JSON.stringify({ type: "done", sources, images, suggestions })}\n\n`,
    );
    res.end();

    // Save to persistent storage (MongoDB) - Async, don't block response
    const saveToMongo = async () => {
      try {
        // 1. Save to Conversation (Turn-based memory)
        await Conversation.create({
          userId: userId || "anonymous",
          sessionId: currentSessionId,
          query: userMessage,
          answer: finalAnswer,
          sources: sources,
          createdAt: new Date(),
        });

        // 2. Save to Chat (Session-based history - Legacy support)
        await Chat.findOneAndUpdate(
          { sessionId: currentSessionId, userId: userId },
          {
            $push: {
              messages: [
                { role: "user", content: userMessage },
                { role: "assistant", content: finalAnswer },
              ],
            },
            $setOnInsert: { sessionId: currentSessionId, title: title, userId: userId },
          },
          { upsert: true, new: true },
        );
        console.log("Saved conversation to MongoDB");
      } catch (dbError) {
        console.error("Error saving to MongoDB:", dbError);
      }
    };
    saveToMongo().catch((e) => console.error("Error in saveToMongo:", e));

    // Save to vector store (Pinecone) - Async, don't block response
    const saveToPinecone = async () => {
      try {
        // Store interaction in vector database
        const pineconeClient = getPineconeClient();
        if (pineconeClient) {
          const indexName = process.env.PINECONE_INDEX || "ai-chat";
          const pineconeIndex = pineconeClient.Index(indexName);

          const embeddings = new OllamaEmbeddings({
            model: "llama3.2",
            baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
          });

          // Store user message
          await PineconeStore.fromDocuments(
            [
              new Document({
                pageContent: userMessage,
                metadata: {
                  sessionId: currentSessionId,
                  role: "user",
                  type: "message",
                },
              }),
              new Document({
                pageContent: finalAnswer,
                metadata: {
                  sessionId: currentSessionId,
                  role: "assistant",
                  type: "message",
                },
              }),
            ],
            embeddings,
            { pineconeIndex: pineconeIndex as any },
          );
        }
      } catch (vecError: unknown) {
        if (
          (vecError as { name?: string }).name === "PineconeNotFoundError" ||
          ((vecError as Error).message &&
            (vecError as Error).message.includes("404"))
        ) {
          console.warn(
            `Pinecone index not found. Skipping vector storage. Ensure index '${process.env.PINECONE_INDEX || "ai-chat"}' exists.`,
          );
        } else {
          console.error("Error saving to Pinecone:", vecError);
        }
      }
    };
    saveToPinecone().catch((e) => console.error("Error in saveToPinecone:", e));
  } catch (error: unknown) {
    console.error("Error in streamEvents:", error);
    res.write(
      `data: ${JSON.stringify({ type: "error", message: (error as Error).message })}\n\n`,
    );
    res.end();
  }
};
