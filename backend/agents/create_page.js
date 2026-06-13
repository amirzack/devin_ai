import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../../src");

export function createPage(name, code) {
  const filePath = path.join(SRC_DIR, "pages", `${name}.jsx`);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, code);

  console.log("📄 created page:", filePath);
}
