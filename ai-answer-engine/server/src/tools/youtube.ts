import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getYouTubeSearchTool = () => {
  return new DynamicStructuredTool({
    name: "youtube_search",
    description:
      "Useful for finding video content and tutorials on YouTube. Input should be a search query string.",
    schema: z.object({
      query: z.string().describe("The search query for videos"),
    }),
    func: async ({ query }: { query: string }) => {
      try {
        console.log(`[YouTube Search] Searching for: ${query}`);
        
        if (
          !process.env.SERPER_API_KEY ||
          process.env.SERPER_API_KEY === "your_serper_api_key"
        ) {
          console.warn("[YouTube Search] SERPER_API_KEY missing. Using mock data.");
          return JSON.stringify([
            {
              title: "Next.js 14 Full Course 2024 | Build and Deploy a Full Stack App",
              link: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
              snippet: "Learn Next.js 14 by building a modern full-stack application...",
              channel: "JavaScript Mastery",
              duration: "5:30:00",
              thumbnail: "https://i.ytimg.com/vi/wm5gMKuwSYk/hqdefault.jpg"
            },
            {
              title: "What is AI? | Artificial Intelligence Explained",
              link: "https://www.youtube.com/watch?v=ad79nYk2keg",
              snippet: "A simple explanation of what AI is and how it works...",
              channel: "Tech Quickie",
              duration: "10:15",
              thumbnail: "https://i.ytimg.com/vi/ad79nYk2keg/hqdefault.jpg"
            }
          ]);
        }

        const response = await fetch("https://google.serper.dev/videos", {
          method: "POST",
          headers: {
            "X-API-KEY": process.env.SERPER_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q: query }),
        });

        if (!response.ok) {
           // Fallback to regular search if videos endpoint fails or not available on plan
           console.warn("[YouTube Search] Videos endpoint failed, trying site:youtube.com");
           const fallbackResponse = await fetch("https://google.serper.dev/search", {
             method: "POST",
             headers: {
               "X-API-KEY": process.env.SERPER_API_KEY,
               "Content-Type": "application/json",
             },
             body: JSON.stringify({ q: `site:youtube.com ${query}` }),
           });
           
           if (!fallbackResponse.ok) throw new Error(`Serper API error: ${fallbackResponse.status}`);
           const data = await fallbackResponse.json();
           return JSON.stringify(data.organic || []);
        }

        const data = await response.json();
        return JSON.stringify(data.videos || []);
      } catch (error) {
        console.error("YouTube search error:", error);
        return `Error searching YouTube: ${(error as Error).message}`;
      }
    },
  });
};
