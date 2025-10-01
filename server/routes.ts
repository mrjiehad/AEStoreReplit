import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { getDiscordAuthUrl, exchangeCodeForToken, getDiscordUserInfo } from "./discord";
import { sendOrderConfirmationEmail } from "./email";
import { insertRedemptionCodeToFiveM } from "./fivem-db";
import { createBill, getPaymentUrl, getBillTransactions } from "./toyyibpay";
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

// Stripe webhook secret (optional but recommended for production)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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

  // Stripe webhook handler - Raw body middleware applied in index.ts
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig || typeof sig !== 'string') {
      return res.status(400).send('No signature');
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured - rejecting webhook');
      return res.status(500).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        const existingOrder = await storage.getOrderByPaymentId(paymentIntent.id);
        if (existingOrder) {
          console.log(`Order already exists for payment ${paymentIntent.id}`);
          return res.json({ received: true, orderId: existingOrder.id });
        }

        const pendingPayment = await storage.getPendingPaymentByExternalId(paymentIntent.id);
        if (!pendingPayment) {
          console.error(`No pending payment found for ${paymentIntent.id}`);
          return res.status(400).send('Pending payment not found');
        }

        // Verify amount in minor units (cents) to avoid floating point issues
        const paidAmountCents = paymentIntent.amount;
        const expectedAmountCents = Math.round(parseFloat(pendingPayment.amount) * 100);
        if (paidAmountCents !== expectedAmountCents) {
          console.error(`Amount mismatch: paid ${paidAmountCents} cents, expected ${expectedAmountCents} cents`);
          await storage.updatePendingPaymentStatus(paymentIntent.id, 'failed');
          return res.status(400).send('Amount mismatch');
        }

        // Verify currency matches
        if (paymentIntent.currency.toUpperCase() !== pendingPayment.currency.toUpperCase()) {
          console.error(`Currency mismatch: paid ${paymentIntent.currency}, expected ${pendingPayment.currency}`);
          await storage.updatePendingPaymentStatus(paymentIntent.id, 'failed');
          return res.status(400).send('Currency mismatch');
        }

        const cartSnapshot = JSON.parse(pendingPayment.cartSnapshot);
        const metadata = pendingPayment.metadata ? JSON.parse(pendingPayment.metadata) : {};

        const order = await storage.createOrder({
          userId: pendingPayment.userId,
          totalAmount: metadata.subtotal || pendingPayment.amount,
          discountAmount: metadata.discount || '0',
          finalAmount: pendingPayment.amount,
          status: "paid",
          paymentMethod: "stripe",
          paymentId: paymentIntent.id,
          couponCode: pendingPayment.couponCode,
        });

        for (const item of cartSnapshot) {
          await storage.createOrderItem({
            orderId: order.id,
            packageId: item.packageId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          });

          for (let i = 0; i < item.quantity; i++) {
            const code = crypto.randomBytes(8).toString('hex').toUpperCase().match(/.{1,4}/g)!.join('-');
            await storage.createRedemptionCode({
              code,
              packageId: item.packageId,
              orderId: order.id,
              status: "active",
            });

            try {
              await insertRedemptionCodeToFiveM(code, item.aecoinAmount);
            } catch (fivemError) {
              console.error(`Failed to insert code ${code} into FiveM:`, fivemError);
            }
          }
        }

        await storage.updateOrderStatus(order.id, 'fulfilled');

        if (pendingPayment.couponCode) {
          const coupon = await storage.getCoupon(pendingPayment.couponCode);
          if (coupon) {
            await storage.incrementCouponUse(coupon.id);
          }
        }

        await storage.clearCart(pendingPayment.userId);
        await storage.updatePendingPaymentStatus(paymentIntent.id, 'succeeded');

        try {
          const user = await storage.getUser(pendingPayment.userId);
          if (user?.email) {
            const redemptionCodes = await storage.getOrderRedemptionCodes(order.id);
            const codesWithPackageNames = redemptionCodes.map((code, idx) => ({
              code: code.code,
              packageName: cartSnapshot[idx]?.packageName || 'AECOIN Package'
            }));
            
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

        console.log(`✓ Order ${order.id} fulfilled via Stripe webhook`);
        return res.json({ received: true, orderId: order.id });
      } 
      else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await storage.updatePendingPaymentStatus(paymentIntent.id, 'failed');
        console.log(`Payment failed for ${paymentIntent.id}`);
        return res.json({ received: true });
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook handler error:', error);
      res.status(500).send(`Webhook Error: ${error.message}`);
    }
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

  // Player rankings routes
  app.get("/api/rankings", async (_req, res) => {
    const rankings = await storage.getAllPlayerRankings();
    res.json(rankings);
  });

  app.get("/api/rankings/top/:limit?", async (req, res) => {
    const limit = parseInt(req.params.limit || "100");
    const rankings = await storage.getTopPlayers(limit);
    res.json(rankings);
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

  // Stripe payment status checker - READ-ONLY (webhook fulfills orders)
  app.post("/api/orders/complete", requireAuth, async (req, res) => {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID required" });
      }

      // Check if order already exists (webhook should create it)
      const existingOrder = await storage.getOrderByPaymentId(paymentIntentId);
      if (existingOrder) {
        return res.json({ order: existingOrder, success: true });
      }

      // Check pending payment status
      const pendingPayment = await storage.getPendingPaymentByExternalId(paymentIntentId);
      if (!pendingPayment) {
        return res.status(404).json({ 
          message: "Payment not found",
          status: "not_found"
        });
      }

      // Return pending payment status
      return res.json({ 
        success: false,
        status: pendingPayment.status,
        message: pendingPayment.status === 'created' 
          ? 'Payment is being processed. Please wait...'
          : pendingPayment.status === 'succeeded'
          ? 'Payment succeeded. Order will be ready shortly.'
          : 'Payment processing...'
      });
    } catch (error: any) {
      console.error("Order status check error:", error);
      res.status(500).json({ 
        message: "Failed to check order status: " + error.message 
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

      // Create PendingPayment record for security and tracking
      const cartSnapshot = await Promise.all(
        cartItems.map(async (item) => {
          const pkg = await storage.getPackage(item.packageId);
          return {
            packageId: item.packageId,
            packageName: pkg?.name || '',
            quantity: item.quantity,
            price: pkg?.price || '0',
            aecoinAmount: pkg?.aecoinAmount || 0,
          };
        })
      );

      await storage.createPendingPayment({
        userId,
        provider: 'stripe',
        externalId: paymentIntent.id,
        amount: total.toFixed(2),
        currency: 'MYR',
        status: 'created',
        cartSnapshot: JSON.stringify(cartSnapshot),
        couponCode: validatedCoupon?.code || null,
        metadata: JSON.stringify({
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
        }),
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

  // ToyyibPay payment intent endpoint - With PendingPayment security
  app.post("/api/create-toyyibpay-bill", requireAuth, async (req, res) => {
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

      // Validate coupon if provided
      let discount = 0;
      let validatedCoupon = null;
      if (couponCode) {
        const coupon = await storage.getCoupon(couponCode.toUpperCase());
        
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

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : `http://localhost:5000`;

      // Generate unique external reference ID for ToyyibPay
      const externalReferenceNo = crypto.randomUUID();

      // Create ToyyibPay bill
      const billCode = await createBill({
        billName: `AECOIN Order #${externalReferenceNo.substring(0, 8)}`,
        billDescription: `AECOIN Package Purchase`,
        billAmount: total,
        billTo: user.username,
        billEmail: user.email,
        billPhone: '0000000000',
        billExternalReferenceNo: externalReferenceNo,
        billReturnUrl: `${baseUrl}/api/toyyibpay/return`,
        billCallbackUrl: `${baseUrl}/api/toyyibpay/callback`,
      });

      // Create cart snapshot for security verification
      const cartSnapshot = await Promise.all(
        cartItems.map(async (item) => {
          const pkg = await storage.getPackage(item.packageId);
          return {
            packageId: item.packageId,
            packageName: pkg?.name || '',
            quantity: item.quantity,
            price: pkg?.price || '0',
            aecoinAmount: pkg?.aecoinAmount || 0,
          };
        })
      );

      // Create PendingPayment record for security and tracking (CRITICAL SECURITY)
      await storage.createPendingPayment({
        userId,
        provider: 'toyyibpay',
        externalId: billCode,
        amount: total.toFixed(2),
        currency: 'MYR',
        status: 'created',
        cartSnapshot: JSON.stringify(cartSnapshot),
        couponCode: validatedCoupon?.code || null,
        metadata: JSON.stringify({
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          externalReferenceNo,
        }),
      });

      const paymentUrl = getPaymentUrl(billCode);

      res.json({
        billCode,
        paymentUrl,
        amount: total,
        metadata: {
          couponCode: validatedCoupon?.code || "",
          subtotal: Math.round(subtotal),
          discount: Math.round(discount),
          total: Math.round(total),
        }
      });
    } catch (error: any) {
      console.error("ToyyibPay bill creation error:", error);
      res.status(500).json({ 
        message: "Error creating ToyyibPay bill: " + error.message 
      });
    }
  });

  // ToyyibPay callback handler (called by ToyyibPay when payment completes)
  app.get("/api/toyyibpay/callback", async (req, res) => {
    try {
      const { status_id, billcode } = req.query;

      console.log("ToyyibPay callback received:", { status_id, billcode });

      if (!billcode) {
        return res.status(200).send('OK');
      }

      // Check if payment already processed (idempotency)
      const existingOrder = await storage.getOrderByPaymentId(billcode as string);
      if (existingOrder) {
        console.log(`Order already exists for ToyyibPay bill ${billcode}`);
        return res.status(200).send('OK');
      }

      // Verify payment succeeded
      if (status_id === '1') {
        // Server-side verification: Query ToyyibPay to confirm payment
        const transactions = await getBillTransactions(billcode as string);
        
        if (transactions && transactions.length > 0 && transactions[0].billpaymentStatus === '1') {
          console.log("✓ ToyyibPay payment verified:", billcode);
          // Actual order fulfillment happens in return handler with session context
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error("ToyyibPay callback error:", error);
      res.status(200).send('OK');
    }
  });

  // ToyyibPay return handler (user redirected here after payment) - SECURE VERSION
  app.get("/api/toyyibpay/return", async (req, res) => {
    try {
      const { status_id, billcode } = req.query;

      console.log("ToyyibPay return:", { status_id, billcode });

      if (!billcode || status_id !== '1') {
        return res.redirect(`/payment/failed?reason=invalid_status`);
      }

      // Check if order already exists (idempotency)
      const existingOrder = await storage.getOrderByPaymentId(billcode as string);
      if (existingOrder) {
        console.log(`Order already fulfilled for ToyyibPay bill ${billcode}`);
        return res.redirect(`/orders?payment=success&provider=toyyibpay`);
      }

      // Get PendingPayment record - CRITICAL SECURITY CHECK
      const pendingPayment = await storage.getPendingPaymentByExternalId(billcode as string);
      if (!pendingPayment) {
        console.error(`No pending payment found for ToyyibPay bill ${billcode}`);
        return res.redirect(`/payment/failed?reason=pending_not_found`);
      }

      // Server-side transaction verification - NEVER trust URL params
      const transactions = await getBillTransactions(billcode as string);
      
      if (!transactions || transactions.length === 0 || transactions[0].billpaymentStatus !== '1') {
        console.error(`ToyyibPay transaction verification failed for ${billcode}`);
        await storage.updatePendingPaymentStatus(billcode as string, 'failed');
        return res.redirect(`/payment/failed?reason=verification_failed`);
      }

      const transaction = transactions[0];

      // Verify amount matches (ToyyibPay returns cents)
      const paidAmountMYR = parseFloat(transaction.billpaymentAmount) / 100;
      const expectedAmountMYR = parseFloat(pendingPayment.amount);
      
      if (Math.abs(paidAmountMYR - expectedAmountMYR) > 0.01) {
        console.error(`ToyyibPay amount mismatch: paid RM${paidAmountMYR}, expected RM${expectedAmountMYR}`);
        await storage.updatePendingPaymentStatus(billcode as string, 'failed');
        return res.redirect(`/payment/failed?reason=amount_mismatch`);
      }

      // Reconstruct order from cart snapshot (prevents cart tampering)
      const cartSnapshot = JSON.parse(pendingPayment.cartSnapshot);
      const metadata = pendingPayment.metadata ? JSON.parse(pendingPayment.metadata) : {};

      // Create order with verified data
      const order = await storage.createOrder({
        userId: pendingPayment.userId,
        totalAmount: metadata.subtotal || pendingPayment.amount,
        discountAmount: metadata.discount || '0',
        finalAmount: pendingPayment.amount,
        status: "paid",
        paymentMethod: "toyyibpay",
        paymentId: billcode as string,
        couponCode: pendingPayment.couponCode,
      });

      // Generate redemption codes from snapshot
      for (const item of cartSnapshot) {
        await storage.createOrderItem({
          orderId: order.id,
          packageId: item.packageId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        });

        for (let i = 0; i < item.quantity; i++) {
          const code = crypto.randomBytes(8).toString('hex').toUpperCase().match(/.{1,4}/g)!.join('-');
          await storage.createRedemptionCode({
            code,
            packageId: item.packageId,
            orderId: order.id,
            status: "active",
          });

          try {
            await insertRedemptionCodeToFiveM(code, item.aecoinAmount);
          } catch (fivemError) {
            console.error(`Failed to insert code ${code} into FiveM:`, fivemError);
          }
        }
      }

      // Update order status to fulfilled
      await storage.updateOrderStatus(order.id, 'fulfilled');

      // Increment coupon usage if applied
      if (pendingPayment.couponCode) {
        const coupon = await storage.getCoupon(pendingPayment.couponCode);
        if (coupon) {
          await storage.incrementCouponUse(coupon.id);
        }
      }

      // Clear cart and mark payment succeeded
      await storage.clearCart(pendingPayment.userId);
      await storage.updatePendingPaymentStatus(billcode as string, 'succeeded');

      // Send email confirmation (soft fail)
      try {
        const user = await storage.getUser(pendingPayment.userId);
        if (user?.email) {
          const redemptionCodes = await storage.getOrderRedemptionCodes(order.id);
          const codesWithPackageNames = redemptionCodes.map((code, idx) => ({
            code: code.code,
            packageName: cartSnapshot[idx]?.packageName || 'AECOIN Package'
          }));
          
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

      console.log(`✓ Order ${order.id} fulfilled via ToyyibPay`);
      res.redirect(`/orders?payment=success&provider=toyyibpay`);
    } catch (error) {
      console.error("ToyyibPay return error:", error);
      res.redirect(`/payment/failed?reason=server_error`);
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
