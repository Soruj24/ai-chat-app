import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getWikipediaTool = () => {
  return new DynamicStructuredTool({
    name: "wikipedia",
    description:
      "Get summaries and facts from Wikipedia. Input should be a search term or topic.",
    schema: z.object({
      query: z.string().describe("The topic to search on Wikipedia"),
    }),
    func: async ({ query }: { query: string }) => {
      try {
        console.log(`[Wikipedia] Searching for: ${query}`);

        // 1. Search for the page title
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          query
        )}&format=json&origin=*`;
        
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.query?.search?.length) {
          return "No Wikipedia articles found.";
        }

        const pageTitle = searchData.query.search[0].title;

        // 2. Get the summary
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
        const summaryRes = await fetch(summaryUrl);
        
        if (!summaryRes.ok) {
           throw new Error("Failed to fetch summary");
        }

        const summaryData = await summaryRes.json();

        return JSON.stringify({
            title: summaryData.title,
            summary: summaryData.extract,
            url: summaryData.content_urls.desktop.page,
            thumbnail: summaryData.thumbnail?.source
        });
      } catch (error) {
        console.error("Wikipedia tool error:", error);
        return `Error searching Wikipedia: ${(error as Error).message}`;
      }
    },
  });
};
