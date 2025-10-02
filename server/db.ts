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

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });
