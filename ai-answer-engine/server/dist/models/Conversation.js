"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const sourceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    content: { type: String },
    snippet: { type: String }
}, { _id: false });
const conversationSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    query: { type: String, required: true },
    answer: { type: String, required: true },
    sources: [sourceSchema],
    createdAt: { type: Date, default: Date.now }
});
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1, createdAt: -1 });
exports.Conversation = mongoose_1.default.model("Conversation", conversationSchema);
//# sourceMappingURL=Conversation.js.map