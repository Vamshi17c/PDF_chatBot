import express from "express";
import multer from "multer";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { storeDocumentChunks } from "../langchainUtils.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const loader = new PDFLoader(req.file.path);
    const docs = await loader.load();

    if (!docs.length || !docs[0].pageContent) {
      throw new Error("No text extracted from PDF");
    }

    const text = docs.map((doc) => doc.pageContent || "").join("\n");
    console.log("Extracted text:", text.slice(0, 200));

    const chunks = await storeDocumentChunks(text);
    res.json({ message: "PDF processed and embedded", chunks });

    // Cleanup temp file
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error("PDF upload error:", err);
    res.status(500).json({ error: "Failed to process PDF", details: err.message });
  }
});

export default router;
