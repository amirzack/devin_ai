import express from "express";
import cors from "cors";
import { runAgent } from "./agents/code_agent.js";
import bodyParser from "body-parser";

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

app.listen(8000, () => {
  console.log("Agent running on port 8000");
});
