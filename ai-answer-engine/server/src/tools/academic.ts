import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

export const getAcademicSearchTool = () => {
  return new DynamicStructuredTool({
    name: "academic_search",
    description:
      "Useful for finding academic papers and research articles. Searches ArXiv for scientific papers. Input should be a search query string.",
    schema: z.object({
      query: z.string().describe("The search query for academic papers"),
    }),
    func: async ({ query }: { query: string }) => {
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
        
        const results: any[] = [];
        
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
      } catch (error) {
        console.error("Academic search error:", error);
        return `Error searching academic papers: ${(error as Error).message}`;
      }
    },
  });
};
