import { Request, Response } from "express";
import { Collection } from "../models/Collection";

export const listCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const collections = await Collection.find({ userId }).sort({ updatedAt: -1 });
    res.json({ collections });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch collections" });
    return;
  }
};

export const createCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { name, description } = req.body as { name: string; description?: string };
    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }
    const c = new Collection({ userId, name, description: description || "" });
    await c.save();
    res.status(201).json({ collection: c });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to create collection" });
    return;
  }
};

export const getCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const c = await Collection.findOne({ _id: id, userId });
    if (!c) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ collection: c });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch collection" });
    return;
  }
};

export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const r = await Collection.findOneAndDelete({ _id: id, userId });
    if (!r) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ok: true });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to delete collection" });
    return;
  }
};

export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { id } = req.params;
    const { sessionId, messageId, role, content, sources } = req.body as {
      sessionId: string;
      messageId?: string;
      role: string;
      content: string;
      sources?: unknown[];
    };
    if (!sessionId || !role || !content) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }
    const c = await Collection.findOne({ _id: id, userId });
    if (!c) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    c.items.push({ sessionId, messageId, role, content, sources: sources || [] });
    c.updatedAt = new Date();
    await c.save();
    res.status(201).json({ collection: c });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to add item" });
    return;
  }
};

export const removeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId as string;
    const { id, itemId } = req.params;
    const c = await Collection.findOne({ _id: id, userId });
    if (!c) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const before = c.items.length;
    const filtered = (c.items as any[]).filter((it: any) => it._id.toString() !== itemId);
    (c as any).set("items", filtered);
    if (c.items.length === before) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    c.updatedAt = new Date();
    await c.save();
    res.json({ collection: c });
    return;
  } catch (e) {
    res.status(500).json({ error: "Failed to remove item" });
    return;
  }
};
