import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { Settings } from "../models/Settings";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalChats = await Chat.countDocuments();

    // Aggregate to count total messages across all chats
    const totalMessagesResult = await Chat.aggregate([
      { $project: { messageCount: { $size: "$messages" } } },
      { $group: { _id: null, total: { $sum: "$messageCount" } } },
    ]);

    const totalMessages =
      totalMessagesResult.length > 0 ? totalMessagesResult[0].total : 0;

    // Get count of recent chats (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentChats = await Chat.countDocuments({
      updatedAt: { $gte: oneDayAgo },
    });

    res.json({
      totalChats,
      totalMessages,
      recentChats,
      systemStatus: "Healthy",
      version: "1.0.0",
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("title updatedAt messages sessionId");

    const activity = chats.map((chat) => ({
      id: chat.sessionId,
      title: chat.title || "Untitled Chat",
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
      lastMessage:
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].content.substring(0, 50) +
            "..."
          : "No messages",
    }));

    res.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

export const getDailyStats = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Chat.aggregate([
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
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    res.status(500).json({ error: "Failed to fetch daily stats" });
  }
};

export const getAllChats = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: Record<string, any> = {};
    if (search) {
      query = {
        title: { $regex: search, $options: "i" },
      };
    }

    const chats = await Chat.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("sessionId title updatedAt messages");

    const total = await Chat.countDocuments(query);

    res.json({
      chats: chats.map((chat) => ({
        sessionId: chat.sessionId,
        title: chat.title || "Untitled Chat",
        updatedAt: chat.updatedAt,
        messageCount: chat.messages.length,
        lastMessage:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].content.substring(
                0,
                100,
              ) + "..."
            : "No messages",
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getChatDetails = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat details:", error);
    res.status(500).json({ error: "Failed to fetch chat details" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const result = await Chat.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Delete user
    const userResult = await User.deleteOne({ _id: userId });

    if (userResult.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete associated chats
    await Chat.deleteMany({ userId });

    res.json({ message: "User and associated chats deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chats = await Chat.find({ userId })
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
        lastMessage:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].content.substring(
                0,
                100,
              ) + "..."
            : "No messages",
      })),
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
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
    ] as const;

    const updates: Record<string, unknown> = {};
    fields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        updates[key] = (payload as Record<string, unknown>)[key];
      }
    });
    settings.set(updates);
    settings.updatedAt = new Date();
    await settings.save();
    res.json({ message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};
