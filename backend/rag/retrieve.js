import OpenAI from "openai";
import { ChromaClient } from "chromadb";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.gapgpt.app/v1",
});

const chroma = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8002" });

export async function retrieveRules(prompt, topK = 3) {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: prompt,
  });
  const embedding = embeddingRes.data[0].embedding;

  const collection = await chroma.getCollection({ name: "rules" });

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: topK,
    include: ["documents"],
  });

  const docs = results.documents[0] ?? [];
  return docs.join("\n\n---\n\n");
}
