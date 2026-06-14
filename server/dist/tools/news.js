"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getNewsTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "news_search",
        description: "Get the latest news headlines and articles. Useful for current events, breaking news, and recent developments. Input should be a search query string.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The news topic or query"),
        }),
        func: async ({ query }) => {
            const searchQuery = query;
            if (!process.env.NEWS_API_KEY ||
                process.env.NEWS_API_KEY === "your_news_api_key") {
                console.warn("[News] API Key missing or default, using mock data.");
                return JSON.stringify([
                    {
                        title: "Tech News: AI Breakthrough",
                        url: "https://example.com/ai-news",
                        snippet: "Latest breakthrough in artificial intelligence models.",
                        content: "Latest breakthrough in artificial intelligence models allows for better reasoning.",
                    },
                    {
                        title: "Global Market Update",
                        url: "https://example.com/market-update",
                        snippet: "Stock markets show positive trends today.",
                        content: "Stock markets show positive trends today driven by tech sector growth.",
                    },
                ]);
            }
            try {
                const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${process.env.NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=5`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.status !== "ok") {
                    return `Error fetching news: ${data.message || "Unknown error"}`;
                }
                const results = data.articles.map((article) => ({
                    title: article.title,
                    url: article.url,
                    snippet: article.description || "",
                    content: article.content || article.description || "",
                }));
                return JSON.stringify(results);
            }
            catch (error) {
                console.error("News API error:", error);
                return `Error searching news: ${error.message}`;
            }
        },
    });
};
exports.getNewsTool = getNewsTool;
//# sourceMappingURL=news.js.map