import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "AI Answer Engine" },
  supportEmail: { type: String, default: "support@example.com" },

  defaultModel: { type: String, default: "llama-3.2-11b-vision-preview" },
  groqApiKey: { type: String, default: "" },
  openaiApiKey: { type: String, default: "" },
  anthropicApiKey: { type: String, default: "" },

  temperature: { type: Number, default: 0.7 },
  maxTokens: { type: Number, default: 4096 },
  systemPrompt: {
    type: String,
    default:
      "You are a helpful AI assistant. You answer questions accurately and concisely.",
  },

  allowRegistration: { type: Boolean, default: true },
  requireEmailVerification: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Settings = mongoose.model("Settings", settingsSchema);
