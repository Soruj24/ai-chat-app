"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVectorSearchTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const pinecone_1 = require("../services/pinecone");
const ollama_1 = require("@langchain/ollama");
const pinecone_2 = require("@langchain/pinecone");
const getVectorSearchTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "vector_search",
        description: "Search for similar documents and past conversations in the internal knowledge base. Use this tool when the user asks about specific uploaded documents, internal company policies, or information that might be stored in the vector database.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The search query to find relevant documents"),
        }),
        func: async ({ query }) => {
            console.log(`[Vector] Searching for: ${query}`);
            try {
                const pineconeClient = (0, pinecone_1.getPineconeClient)();
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
                const embeddings = new ollama_1.OllamaEmbeddings({
                    model: "llama3.2",
                    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
                });
                const vectorStore = await pinecone_2.PineconeStore.fromExistingIndex(embeddings, {
                    pineconeIndex: pineconeIndex,
                });
                const results = await vectorStore.similaritySearch(query, 5);
                const mappedResults = results.map((doc) => {
                    var _a, _b;
                    return ({
                        title: ((_a = doc.metadata) === null || _a === void 0 ? void 0 : _a.title) ||
                            `Document Chunk (${((_b = doc.metadata) === null || _b === void 0 ? void 0 : _b.source) || "Unknown Source"})`,
                        url: "#",
                        snippet: doc.pageContent.substring(0, 200) + "...",
                        content: doc.pageContent,
                        metadata: doc.metadata,
                    });
                });
                return JSON.stringify(mappedResults);
            }
            catch (error) {
                if (error.name === "PineconeNotFoundError" ||
                    (error.message && error.message.includes("404"))) {
                    console.warn(`Vector search skipped: Pinecone index '${process.env.PINECONE_INDEX || "ai-chat"}' not found.`);
                    return JSON.stringify([
                        {
                            title: "No Knowledge Base Found",
                            url: "#",
                            snippet: "The vector database index has not been created yet.",
                            content: "Please initialize the Pinecone index to enable document search.",
                        },
                    ]);
                }
                console.error("Vector search error:", error);
                return `Error searching vector DB: ${error instanceof Error ? error.message : "Unknown error"}`;
            }
        },
    });
};
exports.getVectorSearchTool = getVectorSearchTool;
//# sourceMappingURL=vector.js.map