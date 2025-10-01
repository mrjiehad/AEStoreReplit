import { 
  type User, type InsertUser,
  type Package, type InsertPackage,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type RedemptionCode, type InsertRedemptionCode,
  type Coupon, type InsertCoupon,
  type PendingPayment, type InsertPendingPayment,
  type PlayerRanking, type InsertPlayerRanking,
  users, packages, cartItems, orders, orderItems, redemptionCodes, coupons, pendingPayments, playerRankings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Package operations
  getAllPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByPaymentId(paymentId: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string, paymentId?: string): Promise<Order | undefined>;
  
  // Order items operations
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  
  // Redemption code operations
  createRedemptionCode(code: InsertRedemptionCode): Promise<RedemptionCode>;
  getOrderRedemptionCodes(orderId: string): Promise<RedemptionCode[]>;
  redeemCode(code: string): Promise<RedemptionCode | undefined>;
  
  // Coupon operations
  getCoupon(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  incrementCouponUse(id: string): Promise<boolean>;
  
  // Pending payment operations
  createPendingPayment(payment: InsertPendingPayment): Promise<PendingPayment>;
  getPendingPaymentByExternalId(externalId: string): Promise<PendingPayment | undefined>;
  updatePendingPaymentStatus(externalId: string, status: string): Promise<PendingPayment | undefined>;
  
  // Player rankings operations
  getAllPlayerRankings(): Promise<PlayerRanking[]>;
  getPlayerRanking(userId: string): Promise<PlayerRanking | undefined>;
  createOrUpdatePlayerRanking(ranking: InsertPlayerRanking): Promise<PlayerRanking>;
  getTopPlayers(limit: number): Promise<PlayerRanking[]>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.discordId, discordId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return result[0];
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const result = await db.insert(packages).values(pkg).returning();
    return result[0];
  }

  async updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const result = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
    return result[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    const result = await db.delete(packages).where(eq(packages.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await db.select().from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId),
        eq(cartItems.packageId, item.packageId)
      ))
      .limit(1);

    if (existing[0]) {
      // Update quantity
      const updated = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + item.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated[0];
    } else {
      // Insert new
      const result = await db.insert(cartItems).values(item).returning();
      return result[0];
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrderByPaymentId(paymentId: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.paymentId, paymentId)).limit(1);
    return result[0];
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(sql`${orders.createdAt} DESC`);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrderStatus(id: string, status: string, paymentId?: string): Promise<Order | undefined> {
    const updateData: any = { status };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    if (status === 'fulfilled' || status === 'completed') {
      updateData.completedAt = new Date();
    }
    const result = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Order items operations
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(orderItem).returning();
    return result[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Redemption code operations
  async createRedemptionCode(code: InsertRedemptionCode): Promise<RedemptionCode> {
    const result = await db.insert(redemptionCodes).values(code).returning();
    return result[0];
  }

  async getOrderRedemptionCodes(orderId: string): Promise<RedemptionCode[]> {
    return await db.select().from(redemptionCodes).where(eq(redemptionCodes.orderId, orderId));
  }

  async redeemCode(code: string): Promise<RedemptionCode | undefined> {
    const result = await db.update(redemptionCodes)
      .set({ status: 'redeemed', redeemedAt: new Date() })
      .where(and(
        eq(redemptionCodes.code, code),
        eq(redemptionCodes.status, 'active')
      ))
      .returning();
    return result[0];
  }

  // Coupon operations
  async getCoupon(code: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return result[0];
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const result = await db.insert(coupons).values(coupon).returning();
    return result[0];
  }

  async incrementCouponUse(id: string): Promise<boolean> {
    const result = await db.update(coupons)
      .set({ currentUses: sql`${coupons.currentUses} + 1` })
      .where(eq(coupons.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Pending payment operations
  async createPendingPayment(payment: InsertPendingPayment): Promise<PendingPayment> {
    const result = await db.insert(pendingPayments).values(payment).returning();
    return result[0];
  }

  async getPendingPaymentByExternalId(externalId: string): Promise<PendingPayment | undefined> {
    const result = await db.select().from(pendingPayments).where(eq(pendingPayments.externalId, externalId)).limit(1);
    return result[0];
  }

  async updatePendingPaymentStatus(externalId: string, status: string): Promise<PendingPayment | undefined> {
    const result = await db.update(pendingPayments)
      .set({ status, updatedAt: new Date() })
      .where(eq(pendingPayments.externalId, externalId))
      .returning();
    return result[0];
  }

  // Player rankings operations
  async getAllPlayerRankings(): Promise<PlayerRanking[]> {
    return await db.select().from(playerRankings).orderBy(sql`${playerRankings.rank} ASC`);
  }

  async getPlayerRanking(userId: string): Promise<PlayerRanking | undefined> {
    const result = await db.select().from(playerRankings).where(eq(playerRankings.userId, userId)).limit(1);
    return result[0];
  }

  async createOrUpdatePlayerRanking(ranking: InsertPlayerRanking): Promise<PlayerRanking> {
    const existing = await this.getPlayerRanking(ranking.userId);
    
    if (existing) {
      const result = await db.update(playerRankings)
        .set({ ...ranking, updatedAt: new Date() })
        .where(eq(playerRankings.userId, ranking.userId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(playerRankings).values(ranking).returning();
      return result[0];
    }
  }

  async getTopPlayers(limit: number = 100): Promise<PlayerRanking[]> {
    return await db.select()
      .from(playerRankings)
      .orderBy(sql`${playerRankings.rank} ASC`)
      .limit(limit);
  }
}

export const storage = new DbStorage();
