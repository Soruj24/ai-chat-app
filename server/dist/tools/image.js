"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageGenerationTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getImageGenerationTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "image_generation",
        description: "Generate an image based on a text description. Use this when the user asks to 'draw', 'create an image', 'generate a picture', etc.",
        schema: zod_1.z.object({
            prompt: zod_1.z.string().describe("The detailed description of the image to generate"),
        }),
        func: async ({ prompt }) => {
            try {
                const encodedPrompt = encodeURIComponent(prompt);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
                return `![Generated Image](${imageUrl})`;
            }
            catch (error) {
                console.error("Image generation error:", error);
                return "Failed to generate image.";
            }
        },
    });
};
exports.getImageGenerationTool = getImageGenerationTool;
//# sourceMappingURL=image.js.map