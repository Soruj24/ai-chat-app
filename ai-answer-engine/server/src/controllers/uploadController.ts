import { Request, Response } from "express";
import multer from "multer";
import pdfMod from "pdf-parse";
const pdf: any = (pdfMod as any).default ?? (pdfMod as any);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadMiddleware = upload.single("file");

export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    let text = "";
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    if (mimeType === "application/pdf") {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else if (
      mimeType.startsWith("text/") ||
      mimeType === "application/json" ||
      mimeType.includes("javascript") ||
      mimeType.includes("typescript")
    ) {
      text = fileBuffer.toString("utf-8");
    } else {
      res.status(400).json({
        error:
          "File type not supported for text extraction. Please upload PDF or text files.",
      });
      return;
    }

    text = text.replace(/\n\s*\n/g, "\n").trim();

    res.json({
      success: true,
      filename: req.file.originalname,
      content: text,
    });
    return;
  } catch (error: unknown) {
    console.error("File processing error:", error);
    res.status(500).json({
      error: "Failed to process file: " + (error as Error).message,
    });
    return;
  }
};
