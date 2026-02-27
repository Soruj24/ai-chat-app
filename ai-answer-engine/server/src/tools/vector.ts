import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPineconeClient } from "../services/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export const getVectorSearchTool = () => {
  return new DynamicStructuredTool({
    name: "vector_search",
    description:
      "Search for similar documents and past conversations in the internal knowledge base. Use this tool when the user asks about specific uploaded documents, internal company policies, or information that might be stored in the vector database.",
    schema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    func: async ({ query }) => {
      console.log(`[Vector] Searching for: ${query}`);

      try {
        const pineconeClient = getPineconeClient();
        if (!pineconeClient) {
          return JSON.stringify([
            {
              title: "Vector DB Unavailable",
              url: "#",
              snippet: "Pinecone client not initialized",
              content: "Please check PINECONE_API_KEY",
            },
          ]);
        }

        const indexName = process.env.PINECONE_INDEX || "ai-chat";
        const pineconeIndex = pineconeClient.Index(indexName);

        const embeddings = new OllamaEmbeddings({
          model: "llama3.2",
          baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex: pineconeIndex as any,
        });

        const results = await vectorStore.similaritySearch(query, 5);

        const mappedResults = results.map((doc: any) => ({
          title:
            doc.metadata?.title ||
            `Document Chunk (${doc.metadata?.source || "Unknown Source"})`,
          url: "#",
          snippet: doc.pageContent.substring(0, 200) + "...",
          content: doc.pageContent,
          metadata: doc.metadata,
        }));

        return JSON.stringify(mappedResults);
      } catch (error: any) {
        if (
          error.name === "PineconeNotFoundError" ||
          (error.message && error.message.includes("404"))
        ) {
          console.warn(
            `Vector search skipped: Pinecone index '${process.env.PINECONE_INDEX || "ai-chat"}' not found.`,
          );
          return JSON.stringify([
            {
              title: "No Knowledge Base Found",
              url: "#",
              snippet: "The vector database index has not been created yet.",
              content:
                "Please initialize the Pinecone index to enable document search.",
            },
          ]);
        }
        console.error("Vector search error:", error);
        return `Error searching vector DB: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
