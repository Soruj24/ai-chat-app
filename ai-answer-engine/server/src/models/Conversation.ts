import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String }, // Optional full content
    snippet: { type: String }
}, { _id: false });

const conversationSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    query: { type: String, required: true },
    answer: { type: String, required: true },
    sources: [sourceSchema],
    createdAt: { type: Date, default: Date.now }
});

// Create compound index for efficient querying
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1, createdAt: -1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);
