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
import { getVisionTool } from "../tools/vision";

export const createChatAgent = async (
  sessionId: string,
  isResearchMode: boolean = false,
  modelName: string = "gemini/gemma-4-31b-it",
  tone: string = "Neutral",
  focusMode: string = "web",
  images?: string[],
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
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    } as any);
  }

  const mcpTools = await getMCPTools();

  // Add vision tool if images are provided
  const visionTool = images && images.length > 0 ? [getVisionTool()] : [];

  // Tools available in all modes
  const commonTools = [getCalculatorTool(), getWeatherTool(), ...mcpTools, ...visionTool];

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
  } else if (focusMode === "future") {
    tools = [
      getSerperTool(),
      getSearchTool({
        maxResults: 10,
        searchDepth: "advanced",
        includeImages: true,
      }),
      getNewsTool(),
      getWikipediaTool(),
      getVectorSearchTool(),
      new WebScraperTool(),
      ...commonTools,
    ];
  } else {
    // Default "web" mode - include everything
    tools = [
      // Prefer Google (Serper) first for web answers
      getSerperTool(),
      getSearchTool({
        maxResults: isResearchMode ? 10 : 5,
        searchDepth: isResearchMode ? "advanced" : "basic",
        includeImages: true,
      }),
      getNewsTool(),
      getVectorSearchTool(),
      new WebScraperTool(),
      getAcademicSearchTool(),
      getYouTubeSearchTool(),
      getRedditSearchTool(),
      getWikipediaTool(),
      getImageGenerationTool(),
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
  } else if (focusMode === "future") {
    focusInstruction =
      "Emphasize forward-looking analysis: roadmaps, timelines, risks, and scenarios. Clearly separate facts from projections and cite sources for assumptions.";
  } else {
    focusInstruction =
      "Use a balanced approach, searching the web for comprehensive information.";
  }

  let systemPrompt = `You are an advanced AI Answer Engine, designed to provide comprehensive, accurate, and well-cited answers like Perplexity.
Current Date: ${currentDate}
TONE INSTRUCTION: ${toneInstruction}
FOCUS MODE: ${focusMode} (${focusInstruction})

CORE INSTRUCTIONS:
1. **Search First (Google‑priority)**: Use 'serper_search' (Google results) as your PRIMARY web search for factual questions. Use 'tavily_search_results_json' or 'news_search' to supplement only if needed.
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

If the user asks about specific documents or uploaded content, USE the 'vector_search' tool.
LANGUAGE: Write your answer in the same language the user used. If the user writes in Bengali, answer in Bengali.`;

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

  if (focusMode === "future") {
    const futureAddendum = `
OUTPUT SECTIONS:
- Executive Summary
- Key Drivers and Signals
- Scenarios (Optimistic, Baseline, Risk)
- Timeline (near-term, mid-term, long-term)
- Risks and Mitigations
- What to Watch (leading indicators)
RULES:
- Separate facts from projections and mark projections clearly.
- Cite sources for assumptions and data with [x].
`;
    systemPrompt = `${systemPrompt}\n${futureAddendum}`;
  }

  const agent = createAgent({
    model: llm,
    tools,
    systemPrompt,
  });

  return { agent };
};

export const createDeepAgent = async (
  sessionId: string,
  modelName: string = "gemini/gemma-4-31b-it",
  tone: string = "Neutral",
  focusMode: string = "deep",
) => {
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
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    } as any);
  }

  const mcpTools = await getMCPTools();
  const tools = [
    getSerperTool(),
    getSearchTool({
      maxResults: 10,
      searchDepth: "advanced",
      includeImages: true,
    }),
    getAcademicSearchTool(),
    getNewsTool(),
    getWikipediaTool(),
    getVectorSearchTool(),
    new WebScraperTool(),
    getYouTubeSearchTool(),
    getRedditSearchTool(),
    getCalculatorTool(),
    getWeatherTool(),
    getImageGenerationTool(),
    ...mcpTools,
  ];

  const currentDate = new Date().toISOString().split("T")[0];
  let systemPrompt = [
    `You are a Deep Research Agent.`,
    `Plan, search broadly, read sources, and synthesize a rigorous answer.`,
    `Use multiple tool calls when needed (search, scrape, academic).`,
    `Cite sources inline like [1], [2].`,
    `Separate facts from speculation; include timelines and forward-looking analysis if requested.`,
    `Date: ${currentDate}`,
    `Tone: ${tone}`,
  ].join("\n");

  if (String(focusMode).toLowerCase() === "future") {
    systemPrompt = `${systemPrompt}
OUTPUT SECTIONS:
- Executive Summary
- Key Drivers and Signals
- Scenarios (Optimistic, Baseline, Risk)
- Timeline (near-term, mid-term, long-term)
- Risks and Mitigations
- What to Watch (leading indicators)
RULES:
- Separate facts from projections and mark projections clearly.
- Cite sources for assumptions and data with [x].`;
  }

  try {
    const dynImport: any = new Function("m", "return import(m)");
    const lg = await dynImport("@langchain/langgraph");
    const pre = await dynImport("@langchain/langgraph/prebuilt");
    const StateGraph: any = lg.StateGraph;
    const START: any = lg.START;
    const END: any = lg.END;
    const MessagesAnnotation: any = lg.MessagesAnnotation;
    const ToolNode: any = pre.ToolNode;
    const toolNode = new ToolNode(tools as any);
    const agentNode = async (state: any) => {
      return await llm.invoke([
        { role: "system", content: systemPrompt } as any,
        ...state.messages,
      ]);
    };
    const shouldCallTools = (state: any) => {
      const last: any = state.messages[state.messages.length - 1];
      const has =
        last &&
        (Array.isArray(last.tool_calls) ||
          Array.isArray(last.toolCalls) ||
          (last.additional_kwargs &&
            Array.isArray(last.additional_kwargs.tool_calls)));
      return has ? "tools" : END;
    };
    const graph = new StateGraph(MessagesAnnotation)
      .addNode("agent", agentNode as any)
      .addNode("tools", toolNode as any)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", shouldCallTools as any, {
        tools: "tools",
        [END]: END,
      })
      .addEdge("tools", "agent")
      .compile();
    return { agent: graph };
  } catch {
    const agent = createAgent({
      model: llm,
      tools,
      systemPrompt,
    });
    return { agent };
  }
};

export const generateFollowUpQuestions = async (
  chatHistory: string,
  lastAnswer: string,
  modelName: string = "gemini/gemma-4-31b-it",
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
      baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    } as any);
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
    const content = (response as any).content;
    const text = typeof content === "string" ? content : JSON.stringify(content);
    return text
      .split("\n")
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 3);
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    return [];
  }
};
