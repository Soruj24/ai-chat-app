import { Router } from "express";
import { askQuestion, getHistory, getSession, deleteSession, updateSession } from "./controllers/chatController";
import { ingestDocument } from "./controllers/ingestController";
import { uploadMiddleware, handleFileUpload } from "./controllers/uploadController";
import { getStats, getRecentActivity, getDailyStats, getAllChats, getChatDetails, deleteChat, getAllUsers, deleteUser, getUserDetails, getSettings, updateSettings } from "./controllers/adminController";
import { register, login, getMe, updateMe } from "./controllers/authController";
import { authenticateToken } from "./middleware/auth";
import { listCollections, createCollection, getCollection, deleteCollection, addItem, removeItem } from "./controllers/collectionController";

export const chatRouter = Router();

// Auth Routes
chatRouter.post("/auth/register", register);
chatRouter.post("/auth/login", login);
chatRouter.get("/auth/me", authenticateToken, getMe);
chatRouter.put("/auth/me", authenticateToken, updateMe);

// Admin Routes
chatRouter.get("/admin/stats", getStats);
chatRouter.get("/admin/activity", getRecentActivity);
chatRouter.get("/admin/daily-stats", getDailyStats);
chatRouter.get("/admin/chats", getAllChats);
chatRouter.get("/admin/chats/:sessionId", getChatDetails);
chatRouter.delete("/admin/chats/:sessionId", deleteChat);
chatRouter.get("/admin/users", getAllUsers);
chatRouter.get("/admin/users/:userId", getUserDetails);
chatRouter.delete("/admin/users/:userId", deleteUser);
chatRouter.get("/admin/settings", getSettings);
chatRouter.put("/admin/settings", updateSettings);



chatRouter.post("/ask", authenticateToken, askQuestion);

chatRouter.get("/history", authenticateToken, getHistory);
chatRouter.get("/history/:sessionId", authenticateToken, getSession);
chatRouter.delete("/history/:sessionId", authenticateToken, deleteSession);
chatRouter.put("/history/:sessionId", authenticateToken, updateSession);
chatRouter.post("/ingest", ingestDocument);
chatRouter.post("/upload", uploadMiddleware, handleFileUpload);

// Collections
chatRouter.get("/collections", authenticateToken, listCollections);
chatRouter.post("/collections", authenticateToken, createCollection);
chatRouter.get("/collections/:id", authenticateToken, getCollection);
chatRouter.delete("/collections/:id", authenticateToken, deleteCollection);
chatRouter.post("/collections/:id/items", authenticateToken, addItem);
chatRouter.delete("/collections/:id/items/:itemId", authenticateToken, removeItem);

// Admin Routes
chatRouter.get("/admin/stats", getStats);
chatRouter.get("/admin/activity", getRecentActivity);
chatRouter.get("/admin/daily-stats", getDailyStats);
