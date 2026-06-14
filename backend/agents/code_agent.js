import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { retrieveRules } from "../rag/retrieve.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.gapgpt.app/v1",
});

const BASE_PROMPT = `You are a UI development agent. When the user requests a new page, you MUST call all three tools in order:
1. create_file — generate a complete, styled React functional component. Use only React (no external libs). Export as default. The "name" must be a single PascalCase word (e.g. "Login", "Dashboard").
2. update_router — register the route using the same name.
3. update_navbar — add the nav link using the same name.

RULES:
- Use only inline styles or CSS variables from the global stylesheet
- Do NOT create or import any external CSS files
- Do NOT use any CSS modules
- All styling must be self-contained inside the JSX file
- Apply any styling adjectives (dark, glossy, minimal, etc.) inside the component code itself.`;

function buildSystemPrompt(rules) {
  if (!rules) return BASE_PROMPT;
  return `${BASE_PROMPT}\n\n## Relevant Rules (retrieved via RAG):\n${rules}`;
}

function mcpToOpenAITools(mcpTools) {
  return mcpTools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));
}

export async function runAgent(prompt, emit = () => {}) {
  const mcpUrl = new URL(
    `http://localhost:${process.env.MCP_PORT || 3001}/mcp`,
  );
  const transport = new StreamableHTTPClientTransport(mcpUrl);

  const mcpClient = new Client({ name: "devin-agent", version: "1.0.0" });
  await mcpClient.connect(transport);

  try {
    const { tools: mcpToolList } = await mcpClient.listTools();
    const tools = mcpToOpenAITools(mcpToolList);

    emit("step", {
      id: "rag",
      label: "Retrieving relevant rules",
      status: "running",
    });
    let retrievedRules = "";
    try {
      retrievedRules = await retrieveRules(prompt);
    } catch {
      // Chroma unavailable — proceed without rules
    }
    emit("step", {
      id: "rag",
      label: "Retrieving relevant rules",
      status: "done",
    });

    const messages = [
      { role: "system", content: buildSystemPrompt(retrievedRules) },
      { role: "user", content: prompt },
    ];

    let createdName = null;

    emit("step", { id: "thinking", label: "Planning...", status: "running" });

    while (true) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools,
        tool_choice: "auto",
      });

      const message = response.choices[0].message;
      messages.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        emit("step", { id: "thinking", label: "Planning...", status: "done" });
        break;
      }

      emit("step", { id: "thinking", label: "Planning...", status: "done" });

      for (const tc of message.tool_calls) {
        const toolName = tc.function.name;
        const args = JSON.parse(tc.function.arguments);

        const stepLabel =
          {
            create_file: `Creating ${args.name ?? ""} component`,
            update_router: "Updating router",
            update_navbar: "Updating navbar",
          }[toolName] ?? toolName;

        emit("step", { id: toolName, label: stepLabel, status: "running" });

        const result = await mcpClient.callTool({
          name: toolName,
          arguments: args,
        });
        const resultText = result.content?.[0]?.text ?? "done";

        if (toolName === "create_file") createdName = args.name;

        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: resultText,
        });

        emit("step", { id: toolName, label: stepLabel, status: "done" });
      }
    }

    return {
      status: "done",
      created: createdName,
      actions: mcpToolList.map((t) => t.name),
    };
  } finally {
    await mcpClient.close();
  }
}
