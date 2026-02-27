import mongoose from "mongoose";

const collectionItemSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messageId: { type: String, required: false },
  role: { type: String, required: true },
  content: { type: String, required: true },
  sources: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const collectionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  items: { type: [collectionItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Collection = mongoose.model("Collection", collectionSchema);

