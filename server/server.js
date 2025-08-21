import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { storeDocumentChunks, answerQuestion } from "./langchainUtils.js";
import uploadRouter from "./routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;   // ✅ use Render’s PORT
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());

// Multer setup for PDF upload
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

// Helper: Load data.json
function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return raw ? JSON.parse(raw) : { pdfText: "", history: [] };
  } catch {
    return { pdfText: "", history: [] };
  }
}

// Helper: Save to data.json
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.use("/upload", uploadRouter);

app.post("/store", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });
  try {
    const chunks = await storeDocumentChunks(text);
    res.json({ chunks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question)
    return res.status(400).json({ error: "No question provided" });
  try {
    const answer = await answerQuestion(question);
    if (!answer || typeof answer !== "string" || answer.trim() === "") {
      throw new Error("No document uploaded yet. Please upload a PDF first.");
    }
    res.json({ answer });
  } catch (e) {
    res.status(400).json({
      error: "No document uploaded yet. Please upload a PDF first.",
    });
  }
});

app.get("/history", (req, res) => {
  const data = loadData();
  res.json(data.history || []);
});

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

