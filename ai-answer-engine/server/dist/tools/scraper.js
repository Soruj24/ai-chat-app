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
exports.WebScraperTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const cheerio = __importStar(require("cheerio"));
class WebScraperTool extends tools_1.DynamicStructuredTool {
    constructor() {
        super({
            name: "web_scraper",
            description: "Useful for scraping content from a webpage. Input should be a valid URL string.",
            schema: zod_1.z.object({
                url: zod_1.z.any().describe("The URL to scrape")
            }),
            func: async ({ url }) => {
                const targetUrl = typeof url === 'object' && url.value ? url.value : (typeof url === 'string' ? url : String(url));
                try {
                    console.log(`[WebScraper] Scraping: ${targetUrl}`);
                    const response = await fetch(targetUrl);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    $('script, style').remove();
                    const title = $('title').text().trim() || "No Title";
                    const text = $('body').text().replace(/\s+/g, ' ').trim();
                    const content = text.substring(0, 5000);
                    const snippet = text.substring(0, 200) + "...";
                    return JSON.stringify([{
                            title,
                            url: targetUrl,
                            snippet,
                            content
                        }]);
                }
                catch (error) {
                    console.error(`[WebScraper] Error scraping ${targetUrl}:`, error);
                    return `Error scraping ${targetUrl}: ${error.message}`;
                }
            }
        });
    }
}
exports.WebScraperTool = WebScraperTool;
//# sourceMappingURL=scraper.js.map