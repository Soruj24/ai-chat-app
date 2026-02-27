import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getImageGenerationTool = () => {
  return new DynamicStructuredTool({
    name: "image_generation",
    description: "Generate an image based on a text description. Use this when the user asks to 'draw', 'create an image', 'generate a picture', etc.",
    schema: z.object({
      prompt: z.string().describe("The detailed description of the image to generate"),
    }),
    func: async ({ prompt }: { prompt: string }) => {
      try {
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        return `![Generated Image](${imageUrl})`;
      } catch (error) {
        console.error("Image generation error:", error);
        return "Failed to generate image.";
      }
    },
  });
};
