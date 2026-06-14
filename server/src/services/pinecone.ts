import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = () => {
  if (!process.env.PINECONE_API_KEY) {
    console.warn("PINECONE_API_KEY not set");
    return null;
  }
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }
  return pineconeClient;
};
