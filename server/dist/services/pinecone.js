"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPineconeClient = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
let pineconeClient = null;
const getPineconeClient = () => {
    if (!process.env.PINECONE_API_KEY) {
        console.warn("PINECONE_API_KEY not set");
        return null;
    }
    if (!pineconeClient) {
        pineconeClient = new pinecone_1.Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    }
    return pineconeClient;
};
exports.getPineconeClient = getPineconeClient;
//# sourceMappingURL=pinecone.js.map