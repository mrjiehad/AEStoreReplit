--
-- AECOIN Store Database Dump
-- Generated: 2025-10-04
-- Database: PostgreSQL
--

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS redemption_codes CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS pending_payments CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS player_rankings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

--
-- Table: users
--
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    discord_id VARCHAR NOT NULL UNIQUE,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    avatar VARCHAR,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: packages
--
CREATE TABLE packages (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    aecoin_amount INTEGER NOT NULL,
    codes_per_package INTEGER DEFAULT 1,
    featured BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: coupons
--
CREATE TABLE coupons (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code VARCHAR NOT NULL UNIQUE,
    discount_type VARCHAR NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_purchase NUMERIC(10, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: orders
--
CREATE TABLE orders (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'created',
    payment_id VARCHAR UNIQUE,
    payment_method VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: order_items
--
CREATE TABLE order_items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id VARCHAR NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    package_id VARCHAR NOT NULL REFERENCES packages(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: redemption_codes
--
CREATE TABLE redemption_codes (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id VARCHAR NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    code VARCHAR NOT NULL UNIQUE,
    aecoin_value INTEGER NOT NULL,
    redeemed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: cart_items
--
CREATE TABLE cart_items (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id VARCHAR NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, package_id)
);

--
-- Table: pending_payments
--
CREATE TABLE pending_payments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    external_id VARCHAR NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR NOT NULL,
    payment_method VARCHAR NOT NULL,
    cart_snapshot JSONB NOT NULL,
    coupon_code VARCHAR,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Table: player_rankings
--
CREATE TABLE player_rankings (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
    player_name VARCHAR NOT NULL,
    stars INTEGER NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Sample Data: packages
--
INSERT INTO packages (id, name, description, price, original_price, aecoin_amount, codes_per_package, featured, image_url) VALUES
('02961047-a873-4f13-bd52-d1e370a4f29c', 'AECOIN 500', 'Perfect starter package for new players in Los Santos', 50.00, 60.00, 500, 1, false, NULL),
('b4aa2e90-ee6a-4b9d-a4d0-3308138874e2', 'AECOIN 1000', 'Level up your game with this popular package', 98.00, 120.00, 1000, 1, true, NULL),
('c3200cfe-b5fa-42c3-bebc-e0ea25a848c4', 'AECOIN 3000', 'Become a major player with this premium package', 295.00, 350.00, 3000, 1, true, NULL),
('9aaa5836-8d3f-4e1e-82c6-d1a7a6c427d1', 'AECOIN 5000', 'Build your empire with this powerful package', 490.00, 580.00, 5000, 1, false, NULL),
('ced4ba41-6cb5-4046-8647-f7adf78cf2ef', 'AECOIN 10000', 'The ultimate package for serious players', 980.00, 1200.00, 10000, 1, true, NULL);

--
-- Sample Data: player_rankings (for leaderboard demo)
--
INSERT INTO player_rankings (id, player_name, stars, rank) VALUES
(gen_random_uuid()::text, 'MegaGamer2024', 15420, 1),
(gen_random_uuid()::text, 'ProPlayer99', 14850, 2),
(gen_random_uuid()::text, 'EliteSniper', 13200, 3),
(gen_random_uuid()::text, 'CityKing', 11500, 4),
(gen_random_uuid()::text, 'NightRider', 10800, 5),
(gen_random_uuid()::text, 'StreetLegend', 9600, 6),
(gen_random_uuid()::text, 'DiamondAce', 8750, 7),
(gen_random_uuid()::text, 'ThunderBolt', 7900, 8),
(gen_random_uuid()::text, 'PhoenixRising', 7200, 9),
(gen_random_uuid()::text, 'ShadowMaster', 6500, 10);

-- Indexes for performance
CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_id ON orders(payment_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_redemption_codes_order_id ON redemption_codes(order_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_pending_payments_external_id ON pending_payments(external_id);
CREATE INDEX idx_player_rankings_rank ON player_rankings(rank);

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;

--
-- End of dump
--
