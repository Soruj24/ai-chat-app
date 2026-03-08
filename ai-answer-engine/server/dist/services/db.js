"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-answer-engine";
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB Connected");
    }
    catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map