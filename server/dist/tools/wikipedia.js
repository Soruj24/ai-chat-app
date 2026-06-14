"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWikipediaTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const getWikipediaTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "wikipedia",
        description: "Get summaries and facts from Wikipedia. Input should be a search term or topic.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The topic to search on Wikipedia"),
        }),
        func: async ({ query }) => {
            var _a, _b, _c;
            try {
                console.log(`[Wikipedia] Searching for: ${query}`);
                const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
                const searchRes = await fetch(searchUrl);
                const searchData = await searchRes.json();
                if (!((_b = (_a = searchData.query) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.length)) {
                    return "No Wikipedia articles found.";
                }
                const pageTitle = searchData.query.search[0].title;
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
                    thumbnail: (_c = summaryData.thumbnail) === null || _c === void 0 ? void 0 : _c.source
                });
            }
            catch (error) {
                console.error("Wikipedia tool error:", error);
                return `Error searching Wikipedia: ${error.message}`;
            }
        },
    });
};
exports.getWikipediaTool = getWikipediaTool;
//# sourceMappingURL=wikipedia.js.map