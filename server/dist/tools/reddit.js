"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedditSearchTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getRedditSearchTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "reddit_search",
        description: "Search Reddit for discussions, opinions, and community feedback. Input should be a search query.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The topic or question to search on Reddit"),
        }),
        func: async ({ query }) => {
            try {
                console.log(`[Reddit Search] Searching for: ${query}`);
                const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=10&type=link`;
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
                const posts = data.data.children.map((child) => {
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
            }
            catch (error) {
                console.error("Reddit tool error:", error);
                return `Error searching Reddit: ${error.message}`;
            }
        },
    });
};
exports.getRedditSearchTool = getRedditSearchTool;
//# sourceMappingURL=reddit.js.map