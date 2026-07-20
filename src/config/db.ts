import { MongoClient } from "mongodb";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore fallback error if environment restricts custom DNS
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "new-project-server";

const client = new MongoClient(MONGODB_URI);

export const db = client.db(MONGODB_DATABASE);
export const projectCollection = db.collection("projects");

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

