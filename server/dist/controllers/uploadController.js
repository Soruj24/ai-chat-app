"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const pdf = (_a = pdf_parse_1.default.default) !== null && _a !== void 0 ? _a : pdf_parse_1.default;
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
exports.uploadMiddleware = upload.single("file");
const handleFileUpload = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    try {
        let text = "";
        const fileBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;
        if (mimeType === "application/pdf") {
            const data = await pdf(fileBuffer);
            text = data.text;
        }
        else if (mimeType.startsWith("text/") ||
            mimeType === "application/json" ||
            mimeType.includes("javascript") ||
            mimeType.includes("typescript")) {
            text = fileBuffer.toString("utf-8");
        }
        else {
            res.status(400).json({
                error: "File type not supported for text extraction. Please upload PDF or text files.",
            });
            return;
        }
        text = text.replace(/\n\s*\n/g, "\n").trim();
        res.json({
            success: true,
            filename: req.file.originalname,
            content: text,
        });
        return;
    }
    catch (error) {
        console.error("File processing error:", error);
        res.status(500).json({
            error: "Failed to process file: " + error.message,
        });
        return;
    }
};
exports.handleFileUpload = handleFileUpload;
//# sourceMappingURL=uploadController.js.map