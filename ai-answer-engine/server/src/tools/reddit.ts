import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const getRedditSearchTool = () => {
  return new DynamicStructuredTool({
    name: "reddit_search",
    description:
      "Search Reddit for discussions, opinions, and community feedback. Input should be a search query.",
    schema: z.object({
      query: z.string().describe("The topic or question to search on Reddit"),
    }),
    func: async ({ query }: { query: string }) => {
      try {
        console.log(`[Reddit Search] Searching for: ${query}`);

        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10&type=link`;
        
        // Add User-Agent to avoid 429 errors
        const headers = {
          "User-Agent": "AIAnswerEngine/1.0 (Contact: admin@example.com)"
        };

        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`Reddit API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.data || !data.data.children || data.data.children.length === 0) {
            return "No Reddit discussions found for this query.";
        }

        const posts = data.data.children.map((child: any) => {
            const post = child.data;
            return {
                title: post.title,
                url: `https://www.reddit.com${post.permalink}`,
                subreddit: `r/${post.subreddit}`,
                score: post.score,
                comments: post.num_comments,
                text: post.selftext ? post.selftext.substring(0, 300) + "..." : "(Link post)",
                created: new Date(post.created_utc * 1000).toISOString()
            };
        });

        return JSON.stringify(posts);
      } catch (error) {
        console.error("Reddit tool error:", error);
        return `Error searching Reddit: ${(error as Error).message}`;
      }
    },
  });
};
