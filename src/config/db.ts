import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore fallback error if environment restricts custom DNS
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://typescript:rsrWbSL1Juv7zVzn@cluster0.uk4wzep.mongodb.net/?appName=Cluster0";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "new-project-server";

const client = new MongoClient(MONGODB_URI);

export const db = client.db(MONGODB_DATABASE);
export const projectCollection = db.collection("projects");

// Initialize MongoDB indexes for optimal query speeds
export async function initIndexes() {
  try {
    const users = db.collection("users");
    const items = db.collection("items");
    const bookings = db.collection("bookings");

    await Promise.all([
      users.createIndex({ email: 1 }, { unique: true, background: true }).catch(() => {}),
      items.createIndex({ category: 1, createdAt: -1 }, { background: true }).catch(() => {}),
      items.createIndex({ price: 1 }, { background: true }).catch(() => {}),
      items.createIndex({ rating: 1 }, { background: true }).catch(() => {}),
      items.createIndex({ userId: 1 }, { background: true }).catch(() => {}),
      bookings.createIndex({ userId: 1, createdAt: -1 }, { background: true }).catch(() => {}),
      bookings.createIndex({ status: 1 }, { background: true }).catch(() => {}),
    ]);
  } catch (error) {
    console.error("Index initialization error:", error);
  }
}

// Trigger index creation in background
initIndexes();

// Call this only when application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}


