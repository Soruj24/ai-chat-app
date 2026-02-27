import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { getSearchTool } from "../tools/search";
import { WebScraperTool } from "../tools/scraper";
import { getSerperTool } from "../tools/serper";
import { getNewsTool } from "../tools/news";
import { getVectorSearchTool } from "../tools/vector";
import { getMCPTools } from "../tools/mcp";
import { getCalculatorTool } from "../tools/calculator";
import { getAcademicSearchTool } from "../tools/academic";
import { getYouTubeSearchTool } from "../tools/youtube";
import { getWeatherTool } from "../tools/weather";
import { getRedditSearchTool } from "../tools/reddit";
import { getWikipediaTool } from "../tools/wikipedia";
import { getImageGenerationTool } from "../tools/image";
import { getGoogleSheetTool } from "../tools/google_sheets";

export const createChatAgent = async (
  sessionId: string,
  isResearchMode: boolean = false,
  modelName: string = "llama3.2",
  tone: string = "Neutral",
  focusMode: string = "web",
) => {
  console.log(
    `Initializing Chat Agent with model: ${modelName}, tone: ${tone}, focusMode: ${focusMode}`,
  );
  // 1. Initialize Chat Model
  let llm;
  if (modelName.startsWith("groq/")) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is not set in environment variables. Please add it to your .env file.",
      );
    }
    const groqModel = modelName.replace("groq/", "");
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: groqModel,
      temperature: 0,
    });
  } else if (modelName.startsWith("gemini/")) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error(
        "GOOGLE_API_KEY is not set in environment variables. Please add it to your .env file.",
      );
    }
    const geminiModel = modelName.replace("gemini/", "");
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: geminiModel,
      temperature: 0,
    });
  } else {
    llm = new ChatOllama({
      model: modelName,
      temperature: 0,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
  }

  const mcpTools = await getMCPTools();

  // Tools available in all modes
  const commonTools = [getCalculatorTool(), getWeatherTool(), ...mcpTools];

  let tools: Record<string, any>[] = [];

  if (focusMode === "academic") {
    tools = [
      getAcademicSearchTool(),
      getVectorSearchTool(),
      new WebScraperTool(),
      getWikipediaTool(),
      ...commonTools,
    ];
  } else if (focusMode === "writing") {
    tools = [...commonTools];
  } else if (focusMode === "youtube") {
    tools = [getYouTubeSearchTool(), new WebScraperTool(), ...commonTools];
  } else if (focusMode === "reddit") {
    tools = [getRedditSearchTool(), new WebScraperTool(), ...commonTools];
  } else {
    // Default "web" mode - include everything
    tools = [
      getSearchTool({
        maxResults: isResearchMode ? 10 : 5,
        searchDepth: isResearchMode ? "advanced" : "basic",
        includeImages: true,
      }),
      getSerperTool(),
      getNewsTool(),
      getVectorSearchTool(),
      new WebScraperTool(),
      getAcademicSearchTool(),
      getYouTubeSearchTool(),
      getRedditSearchTool(),
      getWikipediaTool(),
      getImageGenerationTool(),
      getGoogleSheetTool(),
      ...commonTools,
    ];
  }

  const currentDate = new Date().toISOString().split("T")[0];

  let toneInstruction = "Use clear, neutral, and helpful language.";
  switch (tone) {
    case "Professional":
      toneInstruction =
        "Use professional, formal language. Focus on accuracy and clarity. Avoid slang.";
      break;
    case "Creative":
      toneInstruction =
        "Be creative, engaging, and expressive. Use analogies and vivid language.";
      break;
    case "Academic":
      toneInstruction =
        "Use academic, scholarly language. Focus on citations, methodology, and theoretical frameworks. Use technical terms where appropriate.";
      break;
    case "Simplified":
      toneInstruction =
        "Explain like I'm 5. Use simple words and analogies. Avoid jargon. Break down complex concepts.";
      break;
    case "Concise":
      toneInstruction =
        "Be extremely concise. Bullet points preferred. No fluff. Get straight to the point.";
      break;
  }

  let focusInstruction = "";
  if (focusMode === "academic") {
    focusInstruction =
      "Focus on academic sources, papers, and journals. Prioritize using 'academic_search' tool and citing peer-reviewed research.";
  } else if (focusMode === "writing") {
    focusInstruction =
      "Focus on creative and structured writing. Do not use search tools unless absolutely necessary for checking facts.";
  } else if (focusMode === "youtube") {
    focusInstruction =
      "Focus on video content. Prioritize using 'youtube_search' tool and summarizing video information.";
  } else if (focusMode === "reddit") {
    focusInstruction =
      "Focus on social discussions and community opinions. Prioritize using 'reddit_search' tool.";
  } else {
    focusInstruction =
      "Use a balanced approach, searching the web for comprehensive information.";
  }

  let systemPrompt = `You are an advanced AI Answer Engine, designed to provide comprehensive, accurate, and well-cited answers like Perplexity.
Current Date: ${currentDate}
TONE INSTRUCTION: ${toneInstruction}
FOCUS MODE: ${focusMode} (${focusInstruction})

CORE INSTRUCTIONS:
1. **Search First**: You MUST search the web using the available tools before answering any question that requires factual knowledge.
    - Exception: If the user is just greeting (e.g., "hi", "hello") or asking about your identity, you can answer directly without searching.
2. **Multi-Step Reasoning**: If a query is complex, break it down and use multiple search queries to gather full context.
3. **Citations**: You must cite your sources. Use [number] format inline (e.g., "According to recent reports[1], ...").
    - **Prioritize authoritative sources**: Official documentation, academic papers, reputable news outlets, and verified data sources.
    - Avoid citing low-quality blogs or SEO spam unless necessary.
4. **Tool Usage**: Do NOT output tool definitions or schemas. Call tools directly with concrete arguments.
    - Example: To search for 'latest AI news', call 'news_search' with argument {{"query": "latest AI news"}}.
    - Use 'calculator' for math/computations.
    - Use 'academic_search' for scientific papers.
    - Use 'youtube_search' for videos.
    - Use 'weather' for weather forecasts.
    - Use 'reddit_search' for discussions/opinions.
    - Use 'wikipedia' for summaries/definitions.
    - Use 'image_generation' for creating images/drawings.
    - Use 'google_sheets_search' to answer questions using my private data.
      IMPORTANT: If the user asks about data in the Google Sheet and the tool returns no matches, explicitly state that the information was not found in the sheet. Do NOT use outside knowledge to answer questions about private data.
    - Use 'vector_search' to answer questions about specific documents or uploaded content.
    - **Uploaded Content**: If the user provides context from an uploaded file (text/PDF), you MUST prioritize that information over web search results. Use web search only to supplement or verify the uploaded content if needed.
 5. **No Hallucinations**: If you cannot find information, admit it. Do not invent facts.
 6. **Formatting**: Use Markdown for clear structure (headers, bullet points, bold text, tables).
    - Use Markdown Tables for structured data comparisons.

RESPONSE FORMAT:
- Start with a direct answer to the user's question.
- Provide detailed explanation with inline citations [1], [2], etc.
- Do NOT list the sources again at the end (the UI will display them).
- If you need to visualize data (e.g., comparison, trends, distribution), output a JSON code block with language 'chart'.
  Allowed types: "bar", "line", "area", "pie".
  Format:
  \`\`\`chart
  {{
    "type": "bar",
    "title": "Chart Title",
    "xAxisKey": "category",
    "data": [{{ "category": "A", "value": 10 }}, {{ "category": "B", "value": 20 }}],
    "series": [{{ "key": "value", "color": "#8884d8", "name": "Label" }}]
  }}
  \`\`\`

If the user asks about specific documents or uploaded content, USE the 'vector_search' tool.`;

  if (isResearchMode) {
    systemPrompt = `You are an expert AI Research Assistant.
Current Date: ${currentDate}
TONE INSTRUCTION: ${toneInstruction}

Your goal is to provide a deep, exhaustive, and academic-quality answer.
1. **Deep Dive**: Perform multiple searches to cover all angles (history, current state, future, controversies).
2. **Synthesis**: Synthesize information from various sources into a coherent narrative.
3. **Strict Citation**: Every factual claim must be backed by a citation [x].
4. **Source Quality**: Prioritize peer-reviewed papers, official reports, and primary sources.
5. **Tool Usage**: Do NOT output schemas. Call tools directly.
   - Example: {{"query": "detailed analysis of quantum computing"}}
   - **MANDATORY**: Use 'academic_search' for any scientific, medical, or technical queries to find papers.
   - Use 'tavily_search_results_json' for broad context and current events.
   - Use 'youtube_search' if the user specifically asks for videos or visual explanations.
6. **Structure**: Use clear headings, subheadings, and bullet points.
   - Start with an Executive Summary.
   - Use Markdown tables for comparisons.

After searching, provide a detailed report with inline citations. Do NOT list the sources at the end.
If data visualization helps, use the 'chart' code block format described above.`;
  }

  const agent = createAgent({
    model: llm,
    tools,
    systemPrompt,
  });

  return { agent };
};

export const generateFollowUpQuestions = async (
  chatHistory: string,
  lastAnswer: string,
  modelName: string = "llama3.2",
) => {
  let llm;

  if (modelName.startsWith("groq/")) {
    const groqModel = modelName.replace("groq/", "");
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: groqModel,
      temperature: 0.7,
    });
  } else if (modelName.startsWith("gemini/")) {
    const geminiModel = modelName.replace("gemini/", "");
    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: geminiModel,
      temperature: 0.7,
    });
  } else {
    // Default to Ollama or fallback if not available
    llm = new ChatOllama({
      model: modelName === "llama3.2" ? "llama3.2" : modelName,
      temperature: 0.7,
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    });
  }

  const prompt = `Based on the following conversation and the last answer, suggest 3 short, highly relevant, and interesting follow-up questions the user might want to ask next.
    
    The questions should:
    1. Dive deeper into the topic just discussed.
    2. Explore related aspects or implications (e.g., future trends, comparisons, specific details).
    3. Be concise (under 10 words).
    4. Be phrased naturally as if the user is asking them.
    5. Avoid generic questions like "Tell me more".

    Chat History:
    ${chatHistory}

    Last Answer:
    ${lastAnswer}

    Return ONLY the 3 questions, one per line. Do not include numbering, bullet points, or any introductory text.`;

  try {
    // For Groq/Gemini, the invoke might return something different
    const response = await llm.invoke(prompt);
    const content =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    return content
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 3);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [];
  }
};
