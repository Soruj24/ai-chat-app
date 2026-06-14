"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItem = exports.addItem = exports.deleteCollection = exports.getCollection = exports.createCollection = exports.listCollections = void 0;
const Collection_1 = require("../models/Collection");
const listCollections = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const collections = await Collection_1.Collection.find({ userId }).sort({
            updatedAt: -1,
        });
        res.json({ collections });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to fetch collections" });
        return;
    }
};
exports.listCollections = listCollections;
const createCollection = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }
        const c = new Collection_1.Collection({ userId, name, description: description || "" });
        await c.save();
        res.status(201).json({ collection: c });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to create collection" });
        return;
    }
};
exports.createCollection = createCollection;
const getCollection = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        const c = await Collection_1.Collection.findOne({ _id: id, userId });
        if (!c) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json({ collection: c });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to fetch collection" });
        return;
    }
};
exports.getCollection = getCollection;
const deleteCollection = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        const r = await Collection_1.Collection.findOneAndDelete({ _id: id, userId });
        if (!r) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json({ ok: true });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to delete collection" });
        return;
    }
};
exports.deleteCollection = deleteCollection;
const addItem = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        const { sessionId, messageId, role, content, sources } = req.body;
        if (!sessionId || !role || !content) {
            res.status(400).json({ error: "Missing fields" });
            return;
        }
        const c = await Collection_1.Collection.findOne({ _id: id, userId });
        if (!c) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        c.items.push({
            sessionId,
            messageId,
            role,
            content,
            sources: sources || [],
        });
        c.updatedAt = new Date();
        await c.save();
        res.status(201).json({ collection: c });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to add item" });
        return;
    }
};
exports.addItem = addItem;
const removeItem = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { id, itemId } = req.params;
        const c = await Collection_1.Collection.findOne({ _id: id, userId });
        if (!c) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        const before = c.items.length;
        const filtered = c.items.filter((it) => it._id.toString() !== itemId);
        c.set("items", filtered);
        if (c.items.length === before) {
            res.status(404).json({ error: "Item not found" });
            return;
        }
        c.updatedAt = new Date();
        await c.save();
        res.json({ collection: c });
        return;
    }
    catch (_b) {
        res.status(500).json({ error: "Failed to remove item" });
        return;
    }
};
exports.removeItem = removeItem;
//# sourceMappingURL=collectionController.js.map