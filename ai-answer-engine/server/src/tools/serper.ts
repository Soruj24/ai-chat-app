import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getSerperTool = () => {
  return new DynamicStructuredTool({
    name: "serper_search",
    description:
      "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query string.",
    schema: z.object({
      query: z.any().describe("The search query string"),
    }),
    func: async (input: unknown) => {
      const searchQuery =
        typeof input === "object" && input !== null && "value" in input
          ? input.value
          : typeof input === "string"
            ? input
            : JSON.stringify(input);
      console.log(`[Serper] Searching for: ${searchQuery}`);

      // Mock fallback if specific query is used or key is missing (for dev)
      if (
        !process.env.SERPER_API_KEY ||
        process.env.SERPER_API_KEY === "your_serper_api_key"
      ) {
        console.warn("[Serper] API Key missing or default, using mock data.");
        return JSON.stringify([
          {
            title: "Paris - Wikipedia",
            url: "https://en.wikipedia.org/wiki/Paris",
            snippet: "Paris is the capital and most populous city of France.",
            content: "Paris is the capital and most populous city of France.",
          },
          {
            title: "France - Wikipedia",
            url: "https://en.wikipedia.org/wiki/France",
            snippet: "France is a country located primarily in Western Europe.",
            content: "France is a country located primarily in Western Europe.",
          },
        ]);
      }

      try {
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: searchQuery }),
        });

        const data = await response.json();
        console.log(
          `[Serper] Response status: ${response.status}, hasOrganic: ${!!data.organic}`,
        );

        if (!data.organic) {
          return JSON.stringify([]);
        }

        const results = data.organic.map(
          (result: { title: string; link: string; snippet: string }) => ({
            title: result.title,
            url: result.link,
            snippet: result.snippet,
            content: result.snippet, // Serper doesn't provide full content, using snippet
          }),
        );

        return JSON.stringify(results);
      } catch (error: unknown) {
        console.error("Serper API error:", error);
        return `Error searching: ${(error as Error).message}`;
      }
    },
  });
};
