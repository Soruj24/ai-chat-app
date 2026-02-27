import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { chatRouter } from "./routes";
import { connectDB } from "./services/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to Databases
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", chatRouter);

app.get("/", (req, res) => {
  res.send("AI Answer Engine Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
