import { Request, Response } from "express";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { Settings } from "../models/Settings";

export const getStats = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
    return;
  }
};

export const getRecentActivity = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Failed to fetch activity" });
    return;
  }
};

export const getDailyStats = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    res.status(500).json({ error: "Failed to fetch daily stats" });
    return;
  }
};

export const getAllChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    let query: any = {};
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
    return;
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
    return;
  }
};

export const getChatDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId });

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    res.json(chat);
    return;
  } catch (error) {
    console.error("Error fetching chat details:", error);
    res.status(500).json({ error: "Failed to fetch chat details" });
    return;
  }
};

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const result = await Chat.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    res.json({ message: "Chat deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
    return;
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
    return;
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Delete user
    const userResult = await User.deleteOne({ _id: userId });

    if (userResult.deletedCount === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Delete associated chats
    await Chat.deleteMany({ userId });

    res.json({ message: "User and associated chats deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
    return;
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
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
    return;
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
    return;
  }
};

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
    return;
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
    return;
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
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
    return;
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
    return;
  }
};
