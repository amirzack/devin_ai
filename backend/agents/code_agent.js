import OpenAI from "openai";
import { createPage } from "./create_page.js";
import { updateRouter } from "./router.js";
import { updateNavbar } from "./navbar.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-bDucgLWvW7BPfW2oO0Pd6R8ekXSP3i68tRJxJ7FGe1S3Ysqx",
  baseURL: "https://api.gapgpt.app/v1",
});

export const DSL_PROMPT = `
You are a UI agent.

Convert user request into JSON intent.

Rules:
- Detect if user wants: page creation
- Always assume:
  - create page file
  - update router
  - update navbar

Return ONLY valid JSON with no markdown or code blocks:

{
  "intent": "...",
  "name": "...",
  "actions": ["create_file", "update_router", "update_navbar"]
}
`;

function parseJSON(raw) {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim();
  return JSON.parse(cleaned);
}

async function generatePageCode(name, prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Generate a React functional component for a page called "${name}".
User request: ${prompt}

Rules:
- Use only React, no external libraries
- Export as default function named ${name}
- Return ONLY the JSX/JS code with no markdown, no code blocks, no explanations`,
      },
    ],
  });

  return res.choices[0].message.content
    .replace(/^```(?:jsx?|tsx?)?\s*/m, "")
    .replace(/\s*```\s*$/m, "")
    .trim();
}

async function generateDSL(prompt) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `${DSL_PROMPT}\n\nTASK:\n${prompt}`,
      },
    ],
  });

  return res.choices[0].message.content;
}

export async function runAgent(prompt, emit = () => {}) {
  emit("step", { id: "dsl", label: "Analyzing prompt", status: "running" });
  const raw = await generateDSL(prompt);
  const plan = parseJSON(raw);
  emit("step", { id: "dsl", label: "Analyzing prompt", status: "done" });

  const actions = plan.actions || [];
  const name = (plan.name || "").replace(/\s+Page$/i, "").trim();

  if (actions.includes("create_file")) {
    emit("step", { id: "code", label: `Generating ${name} component`, status: "running" });
    const code = await generatePageCode(name, prompt);
    createPage(name, code);
    emit("step", { id: "code", label: `Generating ${name} component`, status: "done" });
  }

  if (actions.includes("update_router")) {
    emit("step", { id: "router", label: "Updating router", status: "running" });
    updateRouter(name);
    emit("step", { id: "router", label: "Updating router", status: "done" });
  }

  if (actions.includes("update_navbar")) {
    emit("step", { id: "navbar", label: "Updating navbar", status: "running" });
    updateNavbar(name);
    emit("step", { id: "navbar", label: "Updating navbar", status: "done" });
  }

  return { status: "done", created: name, actions };
}
