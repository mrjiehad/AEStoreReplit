import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

// Configure WebSocket for Neon - disable SSL verification for self-signed certs
class WebSocketWithoutSSLVerification extends ws {
  constructor(address: string, protocols?: string | string[]) {
    super(address, protocols, {
      rejectUnauthorized: false
    });
  }
}

neonConfig.webSocketConstructor = WebSocketWithoutSSLVerification as any;

console.log("Attempting to connect to database with URL:", process.env.DATABASE_URL?.substring(0, 50) + "...");

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

// Test the database connection
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Add a method to test the connection
pool.query('SELECT 1').then(() => {
  console.log('Database connection test successful');
}).catch((err) => {
  console.error('Database connection test failed:', err);
});

export const db = drizzle(pool, { schema });