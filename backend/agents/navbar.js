import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAVBAR_FILE = path.resolve(__dirname, "../../src/components/Navbar.jsx");

export function updateNavbar(name) {
  let content = fs.readFileSync(NAVBAR_FILE, "utf-8");

  const linkLine = `      <a href="/${name.toLowerCase()}">${name}</a>`;

  if (content.includes(linkLine)) return;

  // Insert new link just before the closing </nav>
  content = content.replace("    </nav>", `${linkLine}\n    </nav>`);

  fs.writeFileSync(NAVBAR_FILE, content);
  console.log("🔗 updated navbar with:", name);
}
