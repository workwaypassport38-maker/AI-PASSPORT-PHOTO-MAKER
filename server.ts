import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up large JSON body limit for base64 image transfers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize the Gemini API client securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  console.log("Server: Gemini API client successfully initialized.");
} else {
  console.warn("Server: GEMINI_API_KEY is missing. AI features will run with high-quality local simulators.");
}

// REST Endpoint: AI Face and Landmark Detection
app.post("/api/face-detection", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing image parameter" });
    }

    // Check if Gemini is initialized
    if (!ai) {
      return res.json({
        success: false,
        message: "Gemini API key is not configured. Simulating detection.",
        data: getSimulatedLandmarks(),
      });
    }

    // Parse base64 parts
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const promptText = "You are an AI face analysis assistant specialized in passport photo alignment. " +
      "Analyze the person in this photo. Detect their face box, left eye, right eye, nose, chin, and shoulders. " +
      "Provide normalized floating point coordinates (0.0 to 1.0, where 0,0 is top-left and 1,1 is bottom-right of the image).";

    console.log("Server: Calling Gemini for face detection analysis...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceRect: {
              type: Type.OBJECT,
              properties: {
                top: { type: Type.NUMBER, description: "Top edge coordinate (0.0 to 1.0)" },
                left: { type: Type.NUMBER, description: "Left edge coordinate (0.0 to 1.0)" },
                width: { type: Type.NUMBER, description: "Width scale (0.0 to 1.0)" },
                height: { type: Type.NUMBER, description: "Height scale (0.0 to 1.0)" },
              },
              required: ["top", "left", "width", "height"],
            },
            leftEye: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
              },
              required: ["x", "y"],
            },
            rightEye: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
              },
              required: ["x", "y"],
            },
            nose: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
              },
              required: ["x", "y"],
            },
            chin: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
              },
              required: ["x", "y"],
            },
            shoulders: {
              type: Type.OBJECT,
              properties: {
                left: {
                  type: Type.OBJECT,
                  properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
                  required: ["x", "y"],
                },
                right: {
                  type: Type.OBJECT,
                  properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
                  required: ["x", "y"],
                },
              },
              required: ["left", "right"],
            },
          },
          required: ["faceRect", "leftEye", "rightEye", "nose", "chin", "shoulders"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(resultText);
    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("Server: Face detection error:", err.message);
    return res.json({
      success: false,
      message: err.message || "Failed to analyze photo.",
      data: getSimulatedLandmarks(),
    });
  }
});

// Helper: fallback simulated landmarks if Gemini fails or is unconfigured
function getSimulatedLandmarks() {
  return {
    faceRect: { top: 0.22, left: 0.35, width: 0.3, height: 0.4 },
    leftEye: { x: 0.44, y: 0.36 },
    rightEye: { x: 0.56, y: 0.36 },
    nose: { x: 0.5, y: 0.43 },
    chin: { x: 0.5, y: 0.58 },
    shoulders: {
      left: { x: 0.25, y: 0.72 },
      right: { x: 0.75, y: 0.72 },
    },
  };
}

// REST Endpoint: AI Clothing Template Analysis
app.post("/api/clothing-replacement", async (req, res) => {
  try {
    const { image, clothingType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing image parameter" });
    }

    // Use Gemini to detect where to perfectly anchor the selected clothing overlay
    if (!ai) {
      return res.json({
        success: false,
        message: "Gemini API key is not configured. Simulating alignment.",
        anchor: { neckY: 0.62, shoulderLeftX: 0.28, shoulderRightX: 0.72 },
      });
    }

    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const promptText = `Analyze this person for fitting a ${clothingType || "black blazer"}. We need to find the base of the neck, and the standard shoulder points.
    Return a JSON object containing the normalized coordinates (0.0 to 1.0) for:
    - neckY: the vertical point representing the base of the chin/neck intersection
    - shoulderLeft: { x, y }
    - shoulderRight: { x, y }
    - faceScale: width multiplier of the head`;

    console.log("Server: Analyzing body structure for clothing fit...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            neckY: { type: Type.NUMBER },
            shoulderLeft: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
              required: ["x", "y"],
            },
            shoulderRight: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER } },
              required: ["x", "y"],
            },
            faceScale: { type: Type.NUMBER },
          },
          required: ["neckY", "shoulderLeft", "shoulderRight", "faceScale"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const anchor = JSON.parse(resultText);
    return res.json({
      success: true,
      anchor,
    });
  } catch (err: any) {
    console.error("Server: Clothing mapping error:", err.message);
    return res.json({
      success: false,
      message: err.message || "Failed to fit outfit.",
      anchor: {
        neckY: 0.62,
        shoulderLeft: { x: 0.28, y: 0.72 },
        shoulderRight: { x: 0.72, y: 0.72 },
        faceScale: 0.32,
      },
    });
  }
});

// Vite Middleware & Static Asset Hosting Pipeline
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, load Vite as a middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Server: Vite dev middleware mounted.");
  } else {
    // In production mode, serve compiled build assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Server: Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server: Running on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
