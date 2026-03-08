"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const db_1 = require("./services/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
(0, db_1.connectDB)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", routes_1.chatRouter);
app.get("/", (req, res) => {
    res.send("AI Answer Engine Backend is running");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map