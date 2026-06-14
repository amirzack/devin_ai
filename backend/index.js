import express from "express";
import cors from "cors";
import { runAgent } from "./agents/code_agent.js";
import { retrieveRules } from "./rag/retrieve.js";
import { ChromaClient } from "chromadb";
import bodyParser from "body-parser";

const chroma = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8002" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { prompt } = req.body;
  const result = await runAgent(prompt);
  res.json(result);
});

app.post("/run-stream", async (req, res) => {
  const { prompt } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const emit = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const result = await runAgent(prompt, emit);
    emit("done", result);
  } catch (err) {
    emit("error", { message: err.message });
  }

  res.end();
});

app.get("/rag-docs", async (_req, res) => {
  try {
    const collection = await chroma.getCollection({ name: "rules" });
    const data = await collection.get({ include: ["documents", "metadatas"] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/rag-search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "query is required" });
  try {
    const results = await retrieveRules(query);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => {
  console.log("Agent running on port 8000");
});
