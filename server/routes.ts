import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDiscordAuthUrl, exchangeCodeForToken, getDiscordUserInfo } from "./discord";
import { sendOrderConfirmationEmail } from "./email";
import "./types";
import crypto from "crypto";
import Stripe from "stripe";

// Initialize Stripe (from blueprint:javascript_stripe)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

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

  // Get redemption codes for an order
  app.get("/api/orders/:id/codes", requireAuth, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    
    if (!order || order.userId !== req.session.userId) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const codes = await storage.getOrderRedemptionCodes(req.params.id);
    res.json(codes);
  });

  // Coupon routes
  app.get("/api/coupons/:code", async (req, res) => {
    const coupon = await storage.getCoupon(req.params.code.toUpperCase());
    const subtotal = req.query.subtotal ? parseFloat(req.query.subtotal as string) : 0;
    
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    
    // Validate coupon
    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is no longer active" });
    }
    
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }
    
    // Validate minimum purchase requirement
    if (coupon.minPurchase && parseFloat(coupon.minPurchase) > subtotal) {
      return res.status(400).json({ 
        message: `Minimum purchase of RM${coupon.minPurchase} required` 
      });
    }
    
    res.json(coupon);
  });

  // Helper function to generate unique AECOIN redemption codes
  function generateRedemptionCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters
    const segments = 4;
    const segmentLength = 4;
    const code = [];
    
    for (let i = 0; i < segments; i++) {
      let segment = '';
      for (let j = 0; j < segmentLength; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      code.push(segment);
    }
    
    return code.join('-'); // Format: XXXX-XXXX-XXXX-XXXX
  }

  // Stripe payment success handler - Create order and redemption codes
  app.post("/api/orders/complete", requireAuth, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      const userId = req.session.userId!;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }

      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Check if order already exists for this payment
      const existingOrder = await storage.getOrderByPaymentId(paymentIntent.id);
      if (existingOrder) {
        return res.json({ order: existingOrder, success: true });
      }

      // Get cart items
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Extract metadata from payment intent
      const metadata = paymentIntent.metadata;
      const subtotal = parseFloat(metadata.subtotal || "0");
      const discount = parseFloat(metadata.discount || "0");
      const total = parseFloat(metadata.total || "0");
      const couponCode = metadata.couponCode || null;

      // Create order
      const order = await storage.createOrder({
        userId,
        totalAmount: subtotal.toFixed(2),
        discountAmount: discount.toFixed(2),
        finalAmount: total.toFixed(2),
        status: "completed",
        paymentMethod: "stripe",
        paymentId: paymentIntent.id,
        couponCode,
      });

      // Create order items and redemption codes
      for (const cartItem of cartItems) {
        const pkg = await storage.getPackage(cartItem.packageId);
        if (!pkg) continue;

        // Create order item
        await storage.createOrderItem({
          orderId: order.id,
          packageId: pkg.id,
          quantity: cartItem.quantity,
          priceAtPurchase: pkg.price,
        });

        // Generate redemption codes (one per quantity)
        for (let i = 0; i < cartItem.quantity; i++) {
          const code = generateRedemptionCode();
          await storage.createRedemptionCode({
            code,
            packageId: pkg.id,
            orderId: order.id,
            status: "active",
          });
        }
      }

      // Increment coupon usage if used
      if (couponCode) {
        const coupon = await storage.getCoupon(couponCode);
        if (coupon) {
          await storage.incrementCouponUse(coupon.id);
        }
      }

      // Clear user's cart
      await storage.clearCart(userId);

      // Send order confirmation email with redemption codes
      try {
        const user = await storage.getUser(userId);
        if (user?.email) {
          const redemptionCodes = await storage.getOrderRedemptionCodes(order.id);
          const codesWithPackageNames = await Promise.all(
            redemptionCodes.map(async (code) => {
              const pkg = await storage.getPackage(code.packageId);
              return {
                code: code.code,
                packageName: pkg?.name || 'AECOIN Package'
              };
            })
          );
          
          await sendOrderConfirmationEmail(
            user.email,
            order.id,
            order.finalAmount,
            codesWithPackageNames
          );
        }
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }

      res.json({ order, success: true });
    } catch (error: any) {
      console.error("Order completion error:", error);
      res.status(500).json({ 
        message: "Failed to complete order: " + error.message 
      });
    }
  });

  // Stripe payment intent endpoint - Server-side amount calculation (security fix)
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      const { couponCode } = req.body;
      const userId = req.session.userId!;

      // Get cart items and calculate total SERVER-SIDE (security: never trust client amounts)
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate subtotal from server-side cart data
      let subtotal = 0;
      for (const item of cartItems) {
        const pkg = await storage.getPackage(item.packageId);
        if (pkg) {
          subtotal += parseFloat(pkg.price) * item.quantity;
        }
      }

      // Apply coupon discount if provided
      let discount = 0;
      let validatedCoupon = null;
      if (couponCode) {
        const coupon = await storage.getCoupon(couponCode.toUpperCase());
        
        // Validate coupon server-side
        if (coupon && coupon.isActive) {
          const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
          const isOverUsed = coupon.maxUses && coupon.currentUses >= coupon.maxUses;
          const belowMinPurchase = coupon.minPurchase && parseFloat(coupon.minPurchase) > subtotal;

          if (!isExpired && !isOverUsed && !belowMinPurchase) {
            validatedCoupon = coupon;
            if (coupon.discountType === 'percentage') {
              discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
            } else {
              discount = parseFloat(coupon.discountValue);
            }
          }
        }
      }

      const total = Math.max(0, subtotal - discount);

      if (total <= 0) {
        return res.status(400).json({ message: "Invalid order total" });
      }

      // Create payment intent with server-calculated amount (from blueprint:javascript_stripe)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "myr",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId,
          couponCode: validatedCoupon?.code || "",
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          total: total.toFixed(2),
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: total,
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
