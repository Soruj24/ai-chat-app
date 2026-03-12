"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const collectionItemSchema = new mongoose_1.default.Schema({
    sessionId: { type: String, required: true },
    messageId: { type: String, required: false },
    role: { type: String, required: true },
    content: { type: String, required: true },
    sources: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
});
const collectionSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    items: { type: [collectionItemSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.Collection = mongoose_1.default.model("Collection", collectionSchema);
//# sourceMappingURL=Collection.js.map