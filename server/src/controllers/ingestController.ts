import { Request, Response } from "express";
import { getPineconeClient } from "../services/pinecone";
import { OllamaEmbeddings } from "@langchain/ollama";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const ingestDocument = async (req: Request, res: Response) => {
  const { content, metadata } = req.body;

  if (!content) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  try {
    const pineconeClient = getPineconeClient();
    if (!pineconeClient) {
      res.status(500).json({ error: "Pinecone client not initialized" });
      return;
    }

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX || "ai-chat",
    );

    const embeddings = new OllamaEmbeddings({
      model: "llama3.2",
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments(
      [content],
      metadata || {
        source: "user-upload",
        createdAt: new Date().toISOString(),
      },
    );

    console.log(`Ingesting ${docs.length} chunks...`);

    // Store in Pinecone
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pineconeIndex as any,
    });

    res.json({
      success: true,
      chunks: docs.length,
      message: "Document ingested successfully",
    });
  } catch (error: unknown) {
    console.error("Ingestion error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
