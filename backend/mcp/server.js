import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../../src");

function createServer() {
  const server = new McpServer({
    name: "azki-tools",
    version: "1.0.0",
    DANGEROUSLY_OMIT_AUTH: true,
  });

  server.tool(
    "create_file",
    "Create a new React page component file in src/pages/",
    {
      name: z.string().describe("PascalCase page name, e.g. Login"),
      code: z.string().describe("Full React component source code"),
    },
    async ({ name, code }) => {
      const filePath = path.join(SRC_DIR, "pages", `${name}.jsx`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, code);
      return { content: [{ type: "text", text: `Created ${filePath}` }] };
    },
  );

  server.tool(
    "update_router",
    "Add a route entry for a page in src/routes.jsx",
    {
      name: z
        .string()
        .describe("PascalCase page name matching the created component"),
    },
    async ({ name }) => {
      const ROUTES_FILE = path.resolve(SRC_DIR, "routes.jsx");
      let content = fs.readFileSync(ROUTES_FILE, "utf-8");

      const importLine = `import ${name} from "./pages/${name}.jsx";`;
      const routeLine = `  { path: "/${name.toLowerCase()}", element: <${name} /> },`;

      if (content.includes(importLine)) {
        return {
          content: [{ type: "text", text: `Route for ${name} already exists` }],
        };
      }

      content = content.replace(/^const routes/m, `${importLine}\nconst routes`);

      if (content.includes("const routes = [];")) {
        content = content.replace(
          "const routes = [];",
          `const routes = [\n${routeLine}\n];`,
        );
      } else {
        content = content.replace(/(\n\];)/, `\n${routeLine}$1`);
      }

      fs.writeFileSync(ROUTES_FILE, content);
      return {
        content: [
          {
            type: "text",
            text: `Added route /${name.toLowerCase()} for ${name}`,
          },
        ],
      };
    },
  );

  server.tool(
    "update_navbar",
    "Add a navigation link for a page in src/components/Navbar.jsx",
    {
      name: z
        .string()
        .describe("PascalCase page name matching the created component"),
    },
    async ({ name }) => {
      const NAVBAR_FILE = path.resolve(SRC_DIR, "components/Navbar.jsx");
      let content = fs.readFileSync(NAVBAR_FILE, "utf-8");

      const linkLine = `      <a href="/${name.toLowerCase()}">${name}</a>`;

      if (content.includes(linkLine)) {
        return {
          content: [
            { type: "text", text: `Navbar link for ${name} already exists` },
          ],
        };
      }

      content = content.replace("    </nav>", `${linkLine}\n    </nav>`);
      fs.writeFileSync(NAVBAR_FILE, content);
      return {
        content: [{ type: "text", text: `Added navbar link for ${name}` }],
      };
    },
  );

  return server;
}

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res);
});

const PORT = process.env.MCP_PORT || 3001;
app.listen(PORT, () => console.log(`MCP server running on http://localhost:${PORT}/mcp`));
