import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite.js";
import { createStorage } from "./storage.js";
import { generatePalmReading } from "./palm-analysis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Initialize storage
const storage = createStorage();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyObj, ...args) {
    capturedJsonResponse = bodyObj;
    return originalResJson.apply(res, [bodyObj, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// API Routes
app.post("/api/upload", upload.single('palm'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to base64
    const imageData = req.file.buffer.toString('base64');
    
    // Create analysis record
    const analysis = await storage.createPalmAnalysis({
      imageData,
      status: 'processing',
      progress: 0,
    });

    // Start analysis in background
    generatePalmReading(analysis.id, imageData, storage).catch(console.error);

    res.json({ id: analysis.id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: "Failed to process upload" });
  }
});

app.get("/api/analysis/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await storage.getPalmAnalysis(id);
    
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    // Don't send image data back to client
    const { imageData, ...responseData } = analysis;
    res.json(responseData);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: "Failed to get analysis" });
  }
});

// Setup Vite or static serving
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  log(`Server running on port ${PORT}`);
});