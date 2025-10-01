import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDiscordUserInfo } from "./discord";
import "./types";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const discordUser = await getDiscordUserInfo();
      
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
      
      // Set session
      req.session.userId = user.id;
      
      res.json({ user });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to authenticate with Discord" });
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
    res.json(items);
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
