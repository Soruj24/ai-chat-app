import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

export class WebScraperTool extends DynamicStructuredTool {
    constructor() {
        super({
            name: "web_scraper",
            description: "Useful for scraping content from a webpage. Input should be a valid URL string.",
            schema: z.object({
                url: z.any().describe("The URL to scrape")
            }),
            func: async ({ url }) => {
                const targetUrl = typeof url === 'object' && url.value ? url.value : (typeof url === 'string' ? url : String(url));
                
                try {
                    console.log(`[WebScraper] Scraping: ${targetUrl}`);
                    const response = await fetch(targetUrl);
                    const html = await response.text();
                    const $ = cheerio.load(html);
                    
                    // Remove script and style elements
                    $('script, style').remove();
                    
                    // Extract title
                    const title = $('title').text().trim() || "No Title";
                    
                    // Extract text
                    const text = $('body').text().replace(/\s+/g, ' ').trim();
                    const content = text.substring(0, 5000); // Limit context
                    const snippet = text.substring(0, 200) + "...";
                    
                    return JSON.stringify([{
                        title,
                        url: targetUrl,
                        snippet,
                        content
                    }]);
                } catch (error: unknown) {
                    console.error(`[WebScraper] Error scraping ${targetUrl}:`, error);
                    return `Error scraping ${targetUrl}: ${(error as Error).message}`;
                }
            }
        });
    }
}
