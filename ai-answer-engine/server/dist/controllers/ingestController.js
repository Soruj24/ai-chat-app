"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestDocument = void 0;
const pinecone_1 = require("../services/pinecone");
const ollama_1 = require("@langchain/ollama");
const pinecone_2 = require("@langchain/pinecone");
const textsplitters_1 = require("@langchain/textsplitters");
const ingestDocument = async (req, res) => {
    const { content, metadata } = req.body;
    if (!content) {
        res.status(400).json({ error: "Content is required" });
        return;
    }
    try {
        const pineconeClient = (0, pinecone_1.getPineconeClient)();
        if (!pineconeClient) {
            res.status(500).json({ error: "Pinecone client not initialized" });
            return;
        }
        const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX || "ai-chat");
        const embeddings = new ollama_1.OllamaEmbeddings({
            model: "llama3.2",
            baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        });
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const docs = await splitter.createDocuments([content], metadata || {
            source: "user-upload",
            createdAt: new Date().toISOString(),
        });
        console.log(`Ingesting ${docs.length} chunks...`);
        await pinecone_2.PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex: pineconeIndex,
        });
        res.json({
            success: true,
            chunks: docs.length,
            message: "Document ingested successfully",
        });
    }
    catch (error) {
        console.error("Ingestion error:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.ingestDocument = ingestDocument;
//# sourceMappingURL=ingestController.js.map