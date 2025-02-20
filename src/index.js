import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import {
  fetchFixtures,
  processAndSendData,
} from "./controllers/sports.controller.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API route to manually fetch sports fixtures
app.get("/", async (req, res) => {
  const data = await fetchFixtures();
  res.json(data);
});

// Serve Telex Integration JSON
app.get("/integration.json", (req, res) => {
  res.sendFile(path.join(__dirname, "telex-integration-config.json"));
});

// Telex tick endpoint
app.post("/tick", async (req, res) => {
  try {
    const { return_url } = req.body;

    if (!return_url) {
      return res.status(400).json({ error: "Missingreturn_url" });
    }

    // Fetch and send fixtures to Telex
    await processAndSendData(return_url);

    res.status(200).json({ message: "Fixtures sent successfully" });
  } catch (error) {
    console.error("Error processing tick:", error);
    res.status(500).json({ error: "Failed to process tick" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
