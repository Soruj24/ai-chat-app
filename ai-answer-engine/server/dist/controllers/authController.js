"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.User({
            email,
            password: hashedPassword,
            name,
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const user = await User_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        console.error("GetMe error:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map