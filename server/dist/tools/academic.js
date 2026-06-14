"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcademicSearchTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const cheerio = __importStar(require("cheerio"));
const getAcademicSearchTool = () => {
    return new tools_1.DynamicStructuredTool({
        name: "academic_search",
        description: "Useful for finding academic papers and research articles. Searches ArXiv for scientific papers. Input should be a search query string.",
        schema: zod_1.z.object({
            query: zod_1.z.string().describe("The search query for academic papers"),
        }),
        func: async ({ query }) => {
            try {
                console.log(`[Academic Search] Searching ArXiv for: ${query}`);
                const maxResults = 5;
                const apiUrl = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`ArXiv API returned status: ${response.status}`);
                }
                const xmlText = await response.text();
                const $ = cheerio.load(xmlText, { xmlMode: true });
                const results = [];
                $('entry').each((_, element) => {
                    const title = $(element).find('title').text().trim();
                    const summary = $(element).find('summary').text().trim().replace(/\n/g, ' ');
                    const authors = $(element).find('author name').map((_, el) => $(el).text()).get().join(', ');
                    const link = $(element).find('id').text().trim();
                    const published = $(element).find('published').text().trim();
                    results.push({
                        title,
                        url: link,
                        content: `Abstract: ${summary}\nAuthors: ${authors}\nPublished: ${published}`,
                        source: "ArXiv"
                    });
                });
                if (results.length === 0) {
                    return "No academic papers found for this query.";
                }
                return JSON.stringify(results);
            }
            catch (error) {
                console.error("Academic search error:", error);
                return `Error searching academic papers: ${error.message}`;
            }
        },
    });
};
exports.getAcademicSearchTool = getAcademicSearchTool;
//# sourceMappingURL=academic.js.map