import { TavilySearch } from "@langchain/tavily";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getSearchTool = (options: { maxResults?: number; includeImages?: boolean; searchDepth?: "basic" | "advanced" } = {}) => {
  const { maxResults = 5, includeImages = false, searchDepth = "basic" } = options;
  if (
    !process.env.TAVILY_API_KEY ||
    process.env.TAVILY_API_KEY === "your_tavily_api_key"
  ) {
    console.warn("TAVILY_API_KEY not found or invalid. Using mock search.");
    return new DynamicStructuredTool({
      name: "tavily_search_results_json",
      description:
        "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query string.",
      schema: z.object({
        input: z.any().describe("The search query string"),
      }),
      func: async (input: unknown) => {
        console.log(`[Mock Search] Raw input:`, JSON.stringify(input));
        let query = "";
        if (typeof input === "string") {
          query = input;
        } else if (typeof input === "object" && input !== null) {
          if (
            "input" in input &&
            typeof (input as Record<string, unknown>).input === "string"
          )
            query = (input as Record<string, unknown>).input as string;
          else if (
            "input" in input &&
            typeof (input as Record<string, unknown>).input === "object" &&
            (input as Record<string, unknown>).input !== null &&
            "value" in
              ((input as Record<string, unknown>).input as Record<
                string,
                unknown
              >) &&
            typeof (
              (input as Record<string, unknown>).input as Record<
                string,
                unknown
              >
            ).value === "string"
          )
            query = (
              (input as Record<string, unknown>).input as Record<
                string,
                unknown
              >
            ).value as string;
          else if (
            "query" in input &&
            typeof (input as Record<string, unknown>).query === "string"
          )
            query = (input as Record<string, unknown>).query as string;
          else if (
            "value" in input &&
            typeof (input as Record<string, unknown>).value === "string"
          )
            query = (input as Record<string, unknown>).value as string;
          else query = JSON.stringify(input); // Fallback
        }

        if (typeof query === "object") {
          query = JSON.stringify(query);
        }

        console.log(`[Mock Search] Searching for: ${query}`);
        return JSON.stringify([
          {
            title: "Paris - Wikipedia",
            url: "https://en.wikipedia.org/wiki/Paris",
            content:
              "Paris is the capital and most populous city of France. It is located in the north-central part of the country.",
          },
          {
            title: "France - Wikipedia",
            url: "https://en.wikipedia.org/wiki/France",
            content:
              "France, officially the French Republic, is a country located primarily in Western Europe. Its capital is Paris.",
          },
          {
            title: "Geography of France",
            url: "https://www.britannica.com/place/France",
            content: "Paris is the capital of France and its largest city.",
          },
        ]);
      },
    });
  }

  const tavily = new TavilySearch({
    maxResults: maxResults,
    searchDepth: searchDepth,
    includeImages: includeImages,
    // apiBaseUrl: "https://api.tavily.com", // Optional if needed
  });

  return new DynamicStructuredTool({
    name: "tavily_search_results_json",
    description:
      "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query string.",
    schema: z.object({
      input: z.string().describe("The search query string"),
    }),
    func: async ({ input }: { input: string }) => {
      try {
        const result = await tavily.invoke({ query: input });
        return JSON.stringify(result);
      } catch (error: unknown) {
        return `Error searching: ${(error as Error).message}`;
      }
    },
  });
};
