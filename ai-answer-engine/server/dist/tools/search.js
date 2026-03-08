"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchTool = void 0;
const tavily_1 = require("@langchain/tavily");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getSearchTool = (options = {}) => {
    const { maxResults = 5, includeImages = false, searchDepth = "basic" } = options;
    if (!process.env.TAVILY_API_KEY ||
        process.env.TAVILY_API_KEY === "your_tavily_api_key") {
        console.warn("TAVILY_API_KEY not found or invalid. Using mock search.");
        return new tools_1.DynamicStructuredTool({
            name: "tavily_search_results_json",
            description: "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query string.",
            schema: zod_1.z.object({
                input: zod_1.z.any().describe("The search query string"),
            }),
            func: async (input) => {
                console.log(`[Mock Search] Raw input:`, JSON.stringify(input));
                let query = "";
                if (typeof input === "string") {
                    query = input;
                }
                else if (typeof input === "object" && input !== null) {
                    if ("input" in input &&
                        typeof input.input === "string")
                        query = input.input;
                    else if ("input" in input &&
                        typeof input.input === "object" &&
                        input.input !== null &&
                        "value" in
                            input.input &&
                        typeof input.input.value === "string")
                        query = input.input.value;
                    else if ("query" in input &&
                        typeof input.query === "string")
                        query = input.query;
                    else if ("value" in input &&
                        typeof input.value === "string")
                        query = input.value;
                    else
                        query = JSON.stringify(input);
                }
                if (typeof query === "object") {
                    query = JSON.stringify(query);
                }
                console.log(`[Mock Search] Searching for: ${query}`);
                return JSON.stringify([
                    {
                        title: "Paris - Wikipedia",
                        url: "https://en.wikipedia.org/wiki/Paris",
                        content: "Paris is the capital and most populous city of France. It is located in the north-central part of the country.",
                    },
                    {
                        title: "France - Wikipedia",
                        url: "https://en.wikipedia.org/wiki/France",
                        content: "France, officially the French Republic, is a country located primarily in Western Europe. Its capital is Paris.",
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
    const tavily = new tavily_1.TavilySearch({
        maxResults: maxResults,
        searchDepth: searchDepth,
        includeImages: includeImages,
    });
    return new tools_1.DynamicStructuredTool({
        name: "tavily_search_results_json",
        description: "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events. Input should be a search query string.",
        schema: zod_1.z.object({
            input: zod_1.z.string().describe("The search query string"),
        }),
        func: async ({ input }) => {
            try {
                const result = await tavily.invoke({ query: input });
                return JSON.stringify(result);
            }
            catch (error) {
                return `Error searching: ${error.message}`;
            }
        },
    });
};
exports.getSearchTool = getSearchTool;
//# sourceMappingURL=search.js.map