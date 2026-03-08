"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = exports.getUserDetails = exports.deleteUser = exports.getAllUsers = exports.deleteChat = exports.getChatDetails = exports.getAllChats = exports.getDailyStats = exports.getRecentActivity = exports.getStats = void 0;
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const Settings_1 = require("../models/Settings");
const getStats = async (req, res) => {
    try {
        const totalChats = await Chat_1.Chat.countDocuments();
        const totalMessagesResult = await Chat_1.Chat.aggregate([
            { $project: { messageCount: { $size: "$messages" } } },
            { $group: { _id: null, total: { $sum: "$messageCount" } } },
        ]);
        const totalMessages = totalMessagesResult.length > 0 ? totalMessagesResult[0].total : 0;
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const recentChats = await Chat_1.Chat.countDocuments({
            updatedAt: { $gte: oneDayAgo },
        });
        res.json({
            totalChats,
            totalMessages,
            recentChats,
            systemStatus: "Healthy",
            version: "1.0.0",
        });
        return;
    }
    catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
        return;
    }
};
exports.getStats = getStats;
const getRecentActivity = async (req, res) => {
    try {
        const chats = await Chat_1.Chat.find()
            .sort({ updatedAt: -1 })
            .limit(10)
            .select("title updatedAt messages sessionId");
        const activity = chats.map((chat) => ({
            id: chat.sessionId,
            title: chat.title || "Untitled Chat",
            updatedAt: chat.updatedAt,
            messageCount: chat.messages.length,
            lastMessage: chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].content.substring(0, 50) +
                    "..."
                : "No messages",
        }));
        res.json(activity);
        return;
    }
    catch (error) {
        console.error("Error fetching activity:", error);
        res.status(500).json({ error: "Failed to fetch activity" });
        return;
    }
};
exports.getRecentActivity = getRecentActivity;
const getDailyStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const dailyStats = await Chat_1.Chat.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json(dailyStats);
        return;
    }
    catch (error) {
        console.error("Error fetching daily stats:", error);
        res.status(500).json({ error: "Failed to fetch daily stats" });
        return;
    }
};
exports.getDailyStats = getDailyStats;
const getAllChats = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        let query = {};
        if (search) {
            query = {
                title: { $regex: search, $options: "i" },
            };
        }
        const chats = await Chat_1.Chat.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("sessionId title updatedAt messages");
        const total = await Chat_1.Chat.countDocuments(query);
        res.json({
            chats: chats.map((chat) => ({
                sessionId: chat.sessionId,
                title: chat.title || "Untitled Chat",
                updatedAt: chat.updatedAt,
                messageCount: chat.messages.length,
                lastMessage: chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].content.substring(0, 100) + "..."
                    : "No messages",
            })),
            total,
            page,
            pages: Math.ceil(total / limit),
        });
        return;
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Failed to fetch chats" });
        return;
    }
};
exports.getAllChats = getAllChats;
const getChatDetails = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chat = await Chat_1.Chat.findOne({ sessionId });
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        res.json(chat);
        return;
    }
    catch (error) {
        console.error("Error fetching chat details:", error);
        res.status(500).json({ error: "Failed to fetch chat details" });
        return;
    }
};
exports.getChatDetails = getChatDetails;
const deleteChat = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await Chat_1.Chat.deleteOne({ sessionId });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        res.json({ message: "Chat deleted successfully" });
        return;
    }
    catch (error) {
        console.error("Error deleting chat:", error);
        res.status(500).json({ error: "Failed to delete chat" });
        return;
    }
};
exports.deleteChat = deleteChat;
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
        }
        const users = await User_1.User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-password");
        const total = await User_1.User.countDocuments(query);
        res.json({
            users,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
        return;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
        return;
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const userResult = await User_1.User.deleteOne({ _id: userId });
        if (userResult.deletedCount === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        await Chat_1.Chat.deleteMany({ userId });
        res.json({ message: "User and associated chats deleted successfully" });
        return;
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
        return;
    }
};
exports.deleteUser = deleteUser;
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const chats = await Chat_1.Chat.find({ userId })
            .sort({ updatedAt: -1 })
            .select("sessionId title updatedAt messages");
        const chatStats = {
            totalChats: chats.length,
            totalMessages: chats.reduce((acc, chat) => acc + chat.messages.length, 0),
            lastActive: chats.length > 0 ? chats[0].updatedAt : null,
        };
        res.json({
            user,
            stats: chatStats,
            chats: chats.map((chat) => ({
                sessionId: chat.sessionId,
                title: chat.title || "Untitled Chat",
                updatedAt: chat.updatedAt,
                messageCount: chat.messages.length,
                lastMessage: chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].content.substring(0, 100) + "..."
                    : "No messages",
            })),
        });
        return;
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
        return;
    }
};
exports.getUserDetails = getUserDetails;
const getSettings = async (req, res) => {
    try {
        let settings = await Settings_1.Settings.findOne();
        if (!settings) {
            settings = await Settings_1.Settings.create({});
        }
        res.json(settings);
        return;
    }
    catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
        return;
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const payload = req.body || {};
        let settings = await Settings_1.Settings.findOne();
        if (!settings) {
            settings = new Settings_1.Settings({});
        }
        const fields = [
            "siteName",
            "supportEmail",
            "defaultModel",
            "groqApiKey",
            "openaiApiKey",
            "anthropicApiKey",
            "temperature",
            "maxTokens",
            "systemPrompt",
            "allowRegistration",
            "requireEmailVerification",
            "maintenanceMode",
        ];
        const updates = {};
        fields.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                updates[key] = payload[key];
            }
        });
        settings.set(updates);
        settings.updatedAt = new Date();
        await settings.save();
        res.json({ message: "Settings updated successfully", settings });
        return;
    }
    catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
        return;
    }
};
exports.updateSettings = updateSettings;
//# sourceMappingURL=adminController.js.map