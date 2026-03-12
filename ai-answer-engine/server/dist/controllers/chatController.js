"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askQuestion = exports.updateSession = exports.deleteSession = exports.getSession = exports.getHistory = void 0;
const agent_1 = require("../services/agent");
const documents_1 = require("@langchain/core/documents");
const Chat_1 = require("../models/Chat");
const Conversation_1 = require("../models/Conversation");
const pinecone_1 = require("../services/pinecone");
const ollama_1 = require("@langchain/ollama");
const pinecone_2 = require("@langchain/pinecone");
const messages_1 = require("@langchain/core/messages");
function rankAndDedupSources(list) {
    const seen = new Set();
    const score = (s) => {
        const url = s.url || "";
        let host = "";
        try {
            host = url ? new URL(url).hostname : "";
        }
        catch (_a) {
            host = "";
        }
        let sc = 0;
        if (/(\.gov|\.edu|\.ac\.)/i.test(host))
            sc += 5;
        if (/wikipedia\.org$/i.test(host))
            sc += 4;
        if (/docs|developer|support|help|api/i.test(url))
            sc += 3;
        if (/nytimes|bbc|reuters|apnews|nature|science|arxiv/i.test(url))
            sc += 3;
        if ((s.content || "").length > 140)
            sc += 1;
        return sc;
    };
    const normKey = (s) => (s.url || "").replace(/\/+$/, "") +
        "|" +
        (s.title || "").toLowerCase().trim();
    const dedup = list.filter((s) => {
        const k = normKey(s);
        if (seen.has(k))
            return false;
        seen.add(k);
        return true;
    });
    return dedup.sort((a, b) => score(b) - score(a)).slice(0, 5);
}
function curateSuggestions(sugs) {
    const uniq = Array.from(new Set(sugs.map((s) => String(s).trim()))).filter((s) => s.length >= 8);
    const seenStart = new Set();
    const result = [];
    for (const s of uniq) {
        const start = s.split(/\s+/)[0].toLowerCase();
        if (seenStart.has(start))
            continue;
        seenStart.add(start);
        result.push(s);
        if (result.length >= 3)
            break;
    }
    for (const s of uniq) {
        if (result.length >= 3)
            break;
        if (!result.includes(s))
            result.push(s);
    }
    return result.slice(0, 3);
}
const getHistory = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const chats = await Chat_1.Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .select("sessionId title updatedAt");
        res.json(chats);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.getHistory = getHistory;
const getSession = async (req, res) => {
    var _a;
    const { sessionId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const chat = await Chat_1.Chat.findOne({ sessionId, userId });
        if (!chat) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json(chat);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.getSession = getSession;
const deleteSession = async (req, res) => {
    var _a;
    const { sessionId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const deletedChat = await Chat_1.Chat.findOneAndDelete({ sessionId, userId });
        if (!deletedChat) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        await Conversation_1.Conversation.deleteMany({ sessionId });
        res.json({ message: "Session deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.deleteSession = deleteSession;
const updateSession = async (req, res) => {
    var _a;
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if (!title) {
        res.status(400).json({ error: "Title is required" });
        return;
    }
    try {
        const chat = await Chat_1.Chat.findOneAndUpdate({ sessionId, userId }, { title }, { new: true });
        if (!chat) {
            res.status(404).json({ error: "Session not found" });
            return;
        }
        res.json(chat);
    }
    catch (error) {
        res
            .status(500)
            .json({ error: error instanceof Error ? error.message : String(error) });
    }
};
exports.updateSession = updateSession;
const askQuestion = async (req, res) => {
    var _a, _b, _c;
    const { message, query, input, sessionId, isResearchMode, model, tone, focusMode, } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const userMessage = message || query || input;
    const selectedModel = model || "llama3.2";
    if (!userMessage) {
        res.status(400).json({ error: "Message, query or input is required" });
        return;
    }
    const title = userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "");
    const currentSessionId = sessionId || `session_${Date.now()}`;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    try {
        const useDeep = String(focusMode || "").toLowerCase() === "deep" ||
            String(focusMode || "").toLowerCase() === "research" ||
            Boolean(isResearchMode);
        const { agent } = useDeep
            ? await (0, agent_1.createDeepAgent)(currentSessionId, selectedModel, tone, String(focusMode || "deep"))
            : await (0, agent_1.createChatAgent)(currentSessionId, isResearchMode, selectedModel, tone, focusMode);
        let sanitizedHistory = [];
        if (userId) {
            try {
                const chatSession = await Chat_1.Chat.findOne({
                    sessionId: currentSessionId,
                    userId,
                });
                if (chatSession && chatSession.messages) {
                    sanitizedHistory = chatSession.messages.map((m) => {
                        if (m.role === "user" || m.role === "human") {
                            return new messages_1.HumanMessage(m.content);
                        }
                        else if (m.role === "assistant" || m.role === "ai") {
                            return new messages_1.AIMessage(m.content);
                        }
                        else if (m.role === "system") {
                            return new messages_1.SystemMessage(m.content);
                        }
                        else {
                            return new messages_1.HumanMessage(m.content);
                        }
                    });
                }
            }
            catch (err) {
                console.warn("Failed to load history from DB:", err);
            }
        }
        if (selectedModel.startsWith("groq/")) {
            if (sanitizedHistory.length > 10) {
                sanitizedHistory = sanitizedHistory.slice(-10);
            }
        }
        const inputs = {
            messages: [...sanitizedHistory, new messages_1.HumanMessage(userMessage)],
        };
        const stream = await agent.streamEvents(inputs, { version: "v2" });
        let finalAnswer = "";
        let sources = [];
        let images = [];
        const steps = [];
        for await (const event of stream) {
            const eventType = event.event;
            console.log(`[Event] ${eventType}`, event.name || "");
            if (eventType === "on_chain_start") {
            }
            else if (eventType === "on_tool_start") {
                let message = `Using tool: ${event.name}`;
                try {
                    const input = (_b = event.data) === null || _b === void 0 ? void 0 : _b.input;
                    if (input) {
                        let query = "";
                        if (typeof input === "string") {
                            query = input;
                        }
                        else if (typeof input === "object") {
                            query =
                                input.query ||
                                    input.input ||
                                    input.url ||
                                    input.location ||
                                    "";
                            if (!query && Object.keys(input).length > 0) {
                                const values = Object.values(input).filter((v) => typeof v === "string");
                                if (values.length > 0) {
                                    query = values[0];
                                }
                            }
                        }
                        if (query) {
                            const displayQuery = query.length > 50 ? query.substring(0, 50) + "..." : query;
                            if (event.name === "academic_search") {
                                message = `Researching academic papers for "${displayQuery}"`;
                            }
                            else if (event.name === "youtube_search") {
                                message = `Searching YouTube for "${displayQuery}"`;
                            }
                            else if (event.name === "weather") {
                                message = `Checking weather for "${displayQuery}"`;
                            }
                            else if (event.name === "reddit_search") {
                                message = `Searching Reddit for "${displayQuery}"`;
                            }
                            else if (event.name === "wikipedia") {
                                message = `Reading Wikipedia article "${displayQuery}"`;
                            }
                            else if (event.name.includes("search")) {
                                message = `Searching for "${displayQuery}"`;
                            }
                            else if (event.name.includes("scraper") ||
                                event.name.includes("fetch")) {
                                message = `Reading ${displayQuery}`;
                            }
                            else if (event.name.includes("calculator")) {
                                message = `Calculating ${displayQuery}`;
                            }
                            else {
                                message = `Using ${event.name}: ${displayQuery}`;
                            }
                        }
                    }
                }
                catch (e) {
                    console.error("Error parsing tool input for step display:", e);
                }
                steps.push(message);
                res.write(`data: ${JSON.stringify({ type: "step", content: message, tool: event.name })}\n\n`);
            }
            else if (eventType === "on_tool_end") {
                const toolNames = [
                    "tavily_search_results_json",
                    "web_scraper",
                    "serper_search",
                    "news_search",
                    "vector_search",
                    "calculator",
                    "academic_search",
                    "youtube_search",
                    "weather",
                    "reddit_search",
                    "wikipedia",
                ];
                if (toolNames.includes(event.name) || event.name.startsWith("mcp_")) {
                    try {
                        const outputStr = event.data.output;
                        let output;
                        if (typeof outputStr === "string") {
                            try {
                                output = JSON.parse(outputStr);
                            }
                            catch (_d) {
                                output = [
                                    { title: "Search Result", url: "#", content: outputStr },
                                ];
                            }
                        }
                        else {
                            output = outputStr;
                        }
                        if (output) {
                            let resultsToProcess = [];
                            if (Array.isArray(output)) {
                                resultsToProcess = output;
                            }
                            else if (typeof output === "object" && output !== null) {
                                if (Array.isArray(output.results)) {
                                    resultsToProcess = output.results;
                                }
                                if (Array.isArray(output.images)) {
                                    const newImages = output.images
                                        .filter((img) => typeof img === "string")
                                        .map((img) => img);
                                    images = [...images, ...newImages];
                                }
                            }
                            if (resultsToProcess.length > 0) {
                                const newSources = resultsToProcess.map((r) => {
                                    const url = r.url || "#";
                                    let domain = "";
                                    try {
                                        if (url && url !== "#") {
                                            domain = new URL(url).hostname;
                                        }
                                    }
                                    catch (_a) {
                                    }
                                    return {
                                        title: r.title || "Source",
                                        url: url,
                                        content: r.content || r.snippet || "",
                                        domain: domain,
                                    };
                                });
                                sources = [...sources, ...newSources];
                            }
                            else if (typeof output === "string") {
                                sources.push({
                                    title: "Tool Output",
                                    url: "#",
                                    content: output,
                                    domain: "",
                                });
                            }
                        }
                    }
                    catch (e) {
                        console.error("Error processing tool output:", e);
                    }
                }
                steps.push(`Completed: ${event.name}`);
                const ranked = rankAndDedupSources(sources);
                res.write(`data: ${JSON.stringify({ type: "step", content: `Completed: ${event.name}`, sources: ranked, images, tool: event.name })}\n\n`);
            }
            else if (eventType === "on_chat_model_stream") {
                const content = (_c = event.data.chunk) === null || _c === void 0 ? void 0 : _c.content;
                if (content) {
                    finalAnswer += content;
                    res.write(`data: ${JSON.stringify({ type: "answer", content })}\n\n`);
                }
            }
            else {
            }
        }
        let suggestions = [];
        try {
            const historyArray = sanitizedHistory || [];
            const historyStr = historyArray
                .map((m) => `${m._getType()}: ${m.content}`)
                .join("\n");
            const fullHistory = `${historyStr}\nhuman: ${userMessage}`;
            suggestions = await (0, agent_1.generateFollowUpQuestions)(fullHistory, finalAnswer, selectedModel);
        }
        catch (e) {
            console.error("Error generating suggestions:", e);
        }
        const rankedDone = rankAndDedupSources(sources);
        const curated = curateSuggestions(suggestions);
        res.write(`data: ${JSON.stringify({ type: "done", sources: rankedDone, images, suggestions: curated })}\n\n`);
        res.end();
        const saveToMongo = async () => {
            try {
                await Conversation_1.Conversation.create({
                    userId: userId || "anonymous",
                    sessionId: currentSessionId,
                    query: userMessage,
                    answer: finalAnswer,
                    sources: sources,
                    createdAt: new Date(),
                });
                if (userId) {
                    await Chat_1.Chat.findOneAndUpdate({ sessionId: currentSessionId, userId: userId }, {
                        $push: {
                            messages: [
                                { role: "user", content: userMessage },
                                { role: "assistant", content: finalAnswer },
                            ],
                        },
                        $setOnInsert: {
                            sessionId: currentSessionId,
                            title: title,
                            userId: userId,
                        },
                    }, { upsert: true, new: true });
                }
                console.log("Saved conversation to MongoDB");
            }
            catch (dbError) {
                console.error("Error saving to MongoDB:", dbError);
            }
        };
        saveToMongo().catch((e) => console.error("Error in saveToMongo:", e));
        const saveToPinecone = async () => {
            try {
                const pineconeClient = (0, pinecone_1.getPineconeClient)();
                if (pineconeClient) {
                    const indexName = process.env.PINECONE_INDEX || "ai-chat";
                    const pineconeIndex = pineconeClient.Index(indexName);
                    const embeddings = new ollama_1.OllamaEmbeddings({
                        model: "llama3.2",
                        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
                    });
                    await pinecone_2.PineconeStore.fromDocuments([
                        new documents_1.Document({
                            pageContent: userMessage,
                            metadata: {
                                sessionId: currentSessionId,
                                role: "user",
                                type: "message",
                            },
                        }),
                        new documents_1.Document({
                            pageContent: finalAnswer,
                            metadata: {
                                sessionId: currentSessionId,
                                role: "assistant",
                                type: "message",
                            },
                        }),
                    ], embeddings, { pineconeIndex: pineconeIndex });
                }
            }
            catch (vecError) {
                if (vecError.name === "PineconeNotFoundError" ||
                    (vecError.message &&
                        vecError.message.includes("404"))) {
                    console.warn(`Pinecone index not found. Skipping vector storage. Ensure index '${process.env.PINECONE_INDEX || "ai-chat"}' exists.`);
                }
                else {
                    console.error("Error saving to Pinecone:", vecError);
                }
            }
        };
        saveToPinecone().catch((e) => console.error("Error in saveToPinecone:", e));
    }
    catch (error) {
        console.error("Error in streamEvents:", error);
        res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
        res.end();
    }
};
exports.askQuestion = askQuestion;
//# sourceMappingURL=chatController.js.map