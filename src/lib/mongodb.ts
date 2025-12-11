import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cargomatters";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API route usage.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any)._mongo || { conn: null, promise: null };

if (!cached.promise) {
  const opts = {
    bufferCommands: false,
  } as any;
  cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  (global as any)._mongo = cached;
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
