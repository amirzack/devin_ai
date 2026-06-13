import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROUTES_FILE = path.resolve(__dirname, "../../src/routes.jsx");

export function updateRouter(name) {
  let content = fs.readFileSync(ROUTES_FILE, "utf-8");

  const importLine = `import ${name} from "./pages/${name}.jsx";`;
  const routeLine = `  { path: "/${name.toLowerCase()}", element: <${name} /> },`;

  if (content.includes(importLine)) return;

  // Insert import before "const routes"
  content = content.replace(/^const routes/m, `${importLine}\nconst routes`);

  // Insert route into the array — handle both empty [] and existing entries
  if (content.includes("const routes = [];")) {
    content = content.replace("const routes = [];", `const routes = [\n${routeLine}\n];`);
  } else {
    content = content.replace(/(\n\];)/, `\n${routeLine}$1`);
  }

  fs.writeFileSync(ROUTES_FILE, content);
  console.log("🔗 updated router with:", name);
}
