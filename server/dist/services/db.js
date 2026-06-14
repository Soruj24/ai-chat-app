"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isDBConnected = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.isDBConnected = false;
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-answer-engine";
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB Connected");
        exports.isDBConnected = true;
    }
    catch (err) {
        console.error("MongoDB Connection Error:", err);
        console.warn("Continuing without MongoDB. Persistence and admin analytics will be disabled.");
        exports.isDBConnected = false;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map