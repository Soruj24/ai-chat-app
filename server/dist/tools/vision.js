"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisionTool = exports.VisionAnalysisTool = void 0;
const tools_1 = require("@langchain/core/tools");
const google_genai_1 = require("@langchain/google-genai");
class VisionAnalysisTool extends tools_1.Tool {
    constructor() {
        super(...arguments);
        this.name = "vision_analysis";
        this.description = `Analyzes images and answers questions about them. 
Use this tool when users upload images and ask questions about them.
Input should be a JSON object with 'image' (base64 data URL) and 'question' fields.`;
    }
    async _call(input) {
        try {
            const { image, question } = JSON.parse(input);
            if (!image || !question) {
                return "Error: Both 'image' and 'question' fields are required";
            }
            const apiKey = process.env.GOOGLE_API_KEY;
            if (!apiKey) {
                return "Error: Google API key not configured. Please set GOOGLE_API_KEY in your .env file.";
            }
            const model = new google_genai_1.ChatGoogleGenerativeAI({
                model: "gemini-pro-vision",
                apiKey: apiKey,
                maxOutputTokens: 2048,
            });
            const imagePart = {
                type: "image_url",
                image_url: { url: image },
            };
            const textPart = {
                type: "text",
                text: question,
            };
            const response = await model.invoke([
                [
                    textPart,
                    imagePart,
                ],
            ]);
            const content = response.content;
            return typeof content === "string"
                ? content
                : JSON.stringify(content);
        }
        catch (error) {
            console.error("Vision analysis error:", error);
            return `Error analyzing image: ${error instanceof Error ? error.message : "Unknown error"}`;
        }
    }
}
exports.VisionAnalysisTool = VisionAnalysisTool;
const getVisionTool = () => new VisionAnalysisTool();
exports.getVisionTool = getVisionTool;
//# sourceMappingURL=vision.js.map