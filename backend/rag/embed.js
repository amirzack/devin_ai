import OpenAI from "openai";
import { ChromaClient } from "chromadb";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_DIR = path.resolve(__dirname, "rules");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.gapgpt.app/v1",
});

const chroma = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8002" });

async function embedText(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

async function main() {
  try {
    await chroma.deleteCollection({ name: "rules" });
    console.log("Cleared existing rules collection.");
  } catch {
    // Collection didn't exist yet — fine
  }

  const collection = await chroma.createCollection({ name: "rules" });

  const files = fs.readdirSync(RULES_DIR).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} rule file(s).`);

  for (const filename of files) {
    const content = fs.readFileSync(path.join(RULES_DIR, filename), "utf-8");
    const id = path.basename(filename, ".md");
    const category = id.split("-")[0];

    process.stdout.write(`Embedding ${filename}... `);
    const embedding = await embedText(content);

    await collection.add({
      ids: [id],
      embeddings: [embedding],
      documents: [content],
      metadatas: [{ filename, category }],
    });

    console.log("done");
  }

  console.log(`\nAll ${files.length} rules embedded into Chroma collection "rules".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
