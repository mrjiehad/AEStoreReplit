import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import ws from "ws";

// Configure WebSocket for Neon with SSL support
neonConfig.webSocketConstructor = ws;
neonConfig.wsProxy = (host) => `wss://${host}/v2`;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
