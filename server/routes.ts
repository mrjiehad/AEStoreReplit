import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDiscordAuthUrl, exchangeCodeForToken, getDiscordUserInfo } from "./discord";
import "./types";
import crypto from "crypto";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Discord OAuth flow - Step 1: Redirect to Discord
  app.get("/api/auth/discord", (req, res) => {
    // Generate and store state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;
    
    const authUrl = getDiscordAuthUrl(state);
    res.redirect(authUrl);
  });

  // Discord OAuth flow - Step 2: Handle callback
  app.get("/api/auth/discord/callback", async (req, res) => {
    const { code, state } = req.query;

    // Verify state for CSRF protection
    if (!state || state !== req.session.oauthState) {
      return res.status(403).send("Invalid state parameter");
    }

    // Clear state after use
    delete req.session.oauthState;

    if (!code || typeof code !== 'string') {
      return res.status(400).send("No code provided");
    }

    try {
      // Exchange code for access token
      const tokenData = await exchangeCodeForToken(code);
      
      // Get user info from Discord
      const discordUser = await getDiscordUserInfo(tokenData.access_token);
      
      // Check if user exists
      let user = await storage.getUserByDiscordId(discordUser.discordId);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          discordId: discordUser.discordId,
          username: discordUser.username,
          email: discordUser.email || "",
          avatar: discordUser.avatar,
        });
      }
      
      // Regenerate session to prevent session fixation attacks
      const oldSession = req.session;
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).send("Authentication failed");
        }
        
        // Set user ID in new session
        req.session.userId = user.id;
        
        // Save session and redirect
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).send("Authentication failed");
          }
          res.redirect('/');
        });
      });
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ user });
  });

  // Package routes
  app.get("/api/packages", async (_req, res) => {
    const packages = await storage.getAllPackages();
    res.json(packages);
  });

  app.get("/api/packages/:id", async (req, res) => {
    const pkg = await storage.getPackage(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(pkg);
  });

  // Cart routes (require authentication)
  app.get("/api/cart", requireAuth, async (req, res) => {
    const items = await storage.getCartItems(req.session.userId!);
    
    // Join package data for each cart item
    const itemsWithPackages = await Promise.all(
      items.map(async (item) => {
        const pkg = await storage.getPackage(item.packageId);
        return {
          ...item,
          package: pkg,
        };
      })
    );
    
    res.json(itemsWithPackages);
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    const { packageId, quantity } = req.body;
    
    const item = await storage.addToCart({
      userId: req.session.userId!,
      packageId,
      quantity: quantity || 1,
    });
    
    res.json(item);
  });

  app.patch("/api/cart/:id", requireAuth, async (req, res) => {
    const { quantity } = req.body;
    const item = await storage.updateCartItemQuantity(req.params.id, quantity);
    
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json(item);
  });

  app.delete("/api/cart/:id", requireAuth, async (req, res) => {
    const success = await storage.removeFromCart(req.params.id);
    
    if (!success) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    
    res.json({ message: "Item removed from cart" });
  });

  app.delete("/api/cart", requireAuth, async (req, res) => {
    await storage.clearCart(req.session.userId!);
    res.json({ message: "Cart cleared" });
  });

  // Order routes (require authentication)
  app.get("/api/orders", requireAuth, async (req, res) => {
    const orders = await storage.getUserOrders(req.session.userId!);
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    
    if (!order || order.userId !== req.session.userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });

  const httpServer = createServer(app);

  return httpServer;
}
