# AECOIN Store

## Overview

AECOIN Store is a gaming e-commerce platform for selling virtual GTA Online currency (AECOIN packages). The application features a cyberpunk/neon-themed dark interface, Discord OAuth authentication, Stripe payment processing, and automated code delivery via email and FiveM database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type safety and component development
- Vite for fast development builds and hot module replacement
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching
- shadcn/ui component library with Radix UI primitives for accessible UI components
- Tailwind CSS for utility-first styling with custom cyberpunk/neon design tokens

**Design System**
- Dark mode with cyberpunk aesthetic (deep black backgrounds, neon yellow/cyan accents)
- Custom fonts: Bebas Neue, Rajdhani, Teko for headers; sans-serif for body text
- Neon glow effects and hover animations throughout
- Mobile-first responsive grid layouts

**Key Pages & Components**
- Home page with hero slider, package cards, gallery, FAQ, and "how it works" sections
- Checkout page with Stripe Elements integration for payment processing
- Orders page for viewing purchase history and redemption codes
- Reusable components: Header with cart, PackageCard, CartDrawer, Footer

### Backend Architecture

**Server Framework**
- Express.js server with TypeScript
- Session-based authentication using express-session
- Middleware for JSON parsing, URL encoding, and CORS handling

**API Structure**
- RESTful endpoints under `/api` namespace
- Authentication routes: `/api/auth/discord`, `/api/auth/discord/callback`, `/api/auth/me`, `/api/auth/logout`
- Resource routes: packages, cart, orders, coupons, checkout
- All routes require authentication via session middleware except OAuth flow

**Business Logic Flow**
1. User authenticates via Discord OAuth
2. Browses and adds AECOIN packages to cart
3. Proceeds to checkout with optional coupon codes
4. Stripe creates payment intent and processes payment
5. Upon successful payment, system generates unique redemption codes
6. Codes are inserted into FiveM MySQL database for in-game redemption
7. Order confirmation email sent with redemption codes via Resend

### Data Storage

**Primary Database (PostgreSQL via Neon)**
- Drizzle ORM for type-safe database queries
- Schema includes: users, packages, cart_items, orders, order_items, redemption_codes, coupons
- UUID primary keys with automatic generation
- Foreign key constraints with cascade deletes for data integrity

**FiveM Database (MySQL)**
- Separate MySQL connection pool for external FiveM game server
- Inserts redemption codes with credit values into `ak4y_donatesystem_codes` table
- Configurable table/column names via environment variables

### Authentication & Authorization

**Discord OAuth 2.0**
- PKCE flow with state parameter for CSRF protection
- Scopes: `identify`, `email`
- Stores Discord ID, username, email, and avatar in user table
- Session-based authentication with secure HTTP-only cookies
- 7-day session expiration

**Session Management**
- PostgreSQL session store via connect-pg-simple (if configured)
- In-memory store fallback for development
- Secure cookies in production with SameSite and HTTPS enforcement

### Payment Processing (Stripe)

**Integration Pattern**
- Stripe Elements for PCI-compliant card input
- Server-side payment intent creation
- Client-side confirmation with 3D Secure support
- Webhook handling for payment completion
- Automatic order status updates upon successful payment

**Flow**
1. Frontend requests payment intent with order total and optional coupon
2. Backend creates Stripe payment intent and returns client secret
3. Frontend renders Stripe Elements with client secret
4. User submits payment, Stripe processes and confirms
5. Backend receives confirmation, creates order, generates codes
6. Codes inserted into FiveM database and emailed to user

## External Dependencies

### Third-Party Services

**Stripe** - Payment gateway for credit card processing
- Required environment variables: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`
- API version: 2025-09-30.clover

**Discord** - OAuth authentication provider
- Required environment variables: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
- OAuth scopes: identify, email

**Resend** - Transactional email service for order confirmations
- Uses Replit Connectors API to fetch credentials dynamically
- Sends HTML emails with redemption codes and order details

**Neon** - Serverless PostgreSQL database
- Required environment variable: `DATABASE_URL`
- WebSocket-based connection pooling

**FiveM** - Game server database integration (MySQL)
- Required environment variables: `FIVEM_DB_HOST`, `FIVEM_DB_USER`, `FIVEM_DB_PASSWORD`, `FIVEM_DB_NAME`, `FIVEM_DB_PORT`
- Optional: `FIVEM_DB_TABLE`, `FIVEM_DB_COLUMN_CODE`, `FIVEM_DB_COLUMN_CREDITSVALUE`

### Key NPM Packages

**UI & Styling**
- `@radix-ui/*` - Headless UI primitives (dialogs, dropdowns, tooltips, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe component variants
- `lucide-react` - Icon library

**State & Data Fetching**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form validation
- `zod` - Schema validation

**Database & ORM**
- `drizzle-orm` - TypeScript ORM
- `@neondatabase/serverless` - Neon database driver
- `mysql2` - MySQL client for FiveM database

**Authentication & Payments**
- `@stripe/stripe-js`, `@stripe/react-stripe-js` - Stripe integration
- `express-session` - Session middleware
- `connect-pg-simple` - PostgreSQL session store

**Email**
- `resend` - Email API client