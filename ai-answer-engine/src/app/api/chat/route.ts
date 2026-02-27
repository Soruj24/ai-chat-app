import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
 

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, isResearchMode } = await req.json();

    // Convert messages to LangChain format
    const formattedMessages = messages.map((m: { role: string; content: string }) => {
      if (m.role === 'user') return new HumanMessage(m.content);
      if (m.role === 'assistant') return new AIMessage(m.content);
      return new SystemMessage(m.content);
    });

    // Add a system prompt based on mode
    const systemPrompt = isResearchMode
      ? "You are a deep research assistant. Provide a comprehensive, detailed answer with citations. Structure your response with 'Executive Summary', 'Detailed Analysis', and 'Conclusion'. Use markdown."
      : "You are a helpful AI assistant. Provide a clear and concise answer. Use markdown.";

    formattedMessages.unshift(new SystemMessage(systemPrompt));

    const model = new ChatOllama({
      model: "llama3.2",
      temperature: 0.7,
      baseUrl: "http://localhost:11434", // Default Ollama URL
    });

    const stream = await model.stream(formattedMessages);

    // Create a simple text stream
    const textStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.content) {
            controller.enqueue(new TextEncoder().encode(String(chunk.content)));
          }
        }
        controller.close();
      },
    });

    return new Response(textStream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Error communicating with Ollama. Make sure Ollama is running.", { status: 500 });
  }
}
