# AECOIN Store - Deployment Guide

This guide provides step-by-step instructions for deploying the AECOIN Store e-commerce website to production using Replit's deployment platform.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Database Configuration](#database-configuration)
4. [Stripe Integration Setup](#stripe-integration-setup)
5. [Discord OAuth Setup](#discord-oauth-setup)
6. [FiveM Database Integration](#fivem-database-integration)
7. [Publishing the Application](#publishing-the-application)
8. [Post-Deployment Configuration](#post-deployment-configuration)
9. [Verification & Testing](#verification--testing)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Replit account with payment method added (required for deployments)
- [ ] Stripe account with live API keys
- [ ] Discord application credentials for OAuth
- [ ] FiveM server database access credentials
- [ ] Domain name (optional, for custom domain setup)
- [ ] Neon PostgreSQL database or Replit database
- [ ] Admin account credentials ready

---

## Environment Variables Setup

### Required Environment Variables

All environment variables must be set as **Secrets** in Replit before deployment.

#### 1. Stripe Configuration (REQUIRED)

```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

**How to get these:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Developers → API Keys
3. Copy your **Live mode** Secret key and Publishable key
4. For webhook secret: Go to Developers → Webhooks (see [Stripe Integration Setup](#stripe-integration-setup))

#### 2. Discord OAuth (OPTIONAL - gracefully fails if not configured)

```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

**How to get these:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select existing one
3. Copy Client ID from OAuth2 → General
4. Generate and copy Client Secret

#### 3. Database Configuration (REQUIRED)

The application uses Neon PostgreSQL. If you're using the built-in database:

```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

This is automatically set if you created a Neon database in development.

#### 4. FiveM Database Integration (OPTIONAL)

```
FIVEM_DB_HOST=your_fivem_mysql_host
FIVEM_DB_PORT=3306
FIVEM_DB_USER=your_fivem_db_user
FIVEM_DB_PASSWORD=your_fivem_db_password
FIVEM_DB_NAME=your_fivem_database_name
FIVEM_DB_TABLE=redemption_codes
FIVEM_DB_COLUMN_CODE=code
FIVEM_DB_COLUMN_CREDITSVALUE=credits_value
```

#### 5. ToyyibPay Integration (OPTIONAL - Malaysian payment gateway)

```
TOYYIBPAY_SECRET_KEY=your_toyyibpay_secret_key
```

### Setting Secrets in Replit

1. Open your Repl
2. Click on "Tools" in the left sidebar
3. Select "Secrets"
4. Click "New Secret"
5. Enter the key name and value
6. Click "Add Secret"
7. Repeat for all required environment variables

**Note:** Secrets are automatically available to your deployed application.

---

## Database Configuration

### Option 1: Using Existing Neon Database

If you already have a Neon database with data:

1. Ensure `DATABASE_URL` is set in Secrets
2. The database should already have all tables and data from development
3. No additional steps needed

### Option 2: Setting Up New Database for Production

1. Create a new Neon database for production:
   - Go to [Neon Console](https://console.neon.tech)
   - Create a new project
   - Copy the connection string

2. Update the `DATABASE_URL` secret with the new connection string

3. Run database migrations:
   ```bash
   npm run db:push
   ```

4. Import your data (if migrating from development):
   - Export data from development database
   - Import to production database using the provided SQL backup

### Database Backup & Migration

The project includes sample data. To import:

```bash
# Connect to your production database and run the backup SQL file
psql $DATABASE_URL < backup.sql
```

---

## Stripe Integration Setup

### Critical: Webhook Configuration

Stripe webhooks are REQUIRED for automatic order fulfillment.

#### Step 1: Create Webhook Endpoint

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   ```
   https://your-deployment-url.replit.app/api/webhooks/stripe
   ```
   (Replace with your actual deployment URL - you'll get this after publishing)

4. Select events to listen for:
   - `payment_intent.succeeded` (REQUIRED)
   - `payment_intent.payment_failed` (RECOMMENDED)

5. Click "Add endpoint"

#### Step 2: Copy Webhook Secret

1. Click on your newly created webhook
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)
4. Add it to your Replit Secrets as `STRIPE_WEBHOOK_SECRET`

#### Step 3: Test Webhook

After deployment:
1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select `payment_intent.succeeded`
5. Check your application logs for successful processing

### Important Notes

- **Development vs Production**: Always use **Live mode** keys for production
- **Security**: Never commit API keys to code - always use Secrets
- **Testing**: Test payments in Stripe's test mode before going live
- **Webhook Fallback**: The app has a fallback mechanism that checks payment status if webhooks fail

---

## Discord OAuth Setup

### Step 1: Configure OAuth Redirect URI

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 → General
4. Add redirect URI:
   ```
   https://your-deployment-url.replit.app/api/auth/discord/callback
   ```

5. Save changes

### Step 2: Configure Scopes

In Discord OAuth2 settings, ensure these scopes are enabled:
- `identify` (to get user ID and username)
- `email` (to get user email)

### Step 3: Test Login

After deployment:
1. Visit your deployed site
2. Click "Login with Discord"
3. Authorize the application
4. Verify you're redirected back and logged in

---

## FiveM Database Integration

This integration automatically inserts redemption codes into your FiveM game server's database.

### Configuration

1. Set all FiveM database environment variables in Replit Secrets
2. Ensure your FiveM MySQL database is accessible from the internet
3. The table structure should match:

```sql
CREATE TABLE redemption_codes (
    code VARCHAR(255) PRIMARY KEY,
    credits_value INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Testing FiveM Integration

After deployment:
1. Make a test purchase
2. Check your FiveM database for the new redemption codes
3. Verify codes work in-game

**Note:** FiveM integration is optional and will gracefully fail if not configured.

---

## Publishing the Application

### Step 1: Prepare for Deployment

1. Verify all secrets are set (see [Environment Variables Setup](#environment-variables-setup))
2. Test the application in development mode:
   ```bash
   npm run dev
   ```
3. Ensure there are no errors in the console

### Step 2: Configure Deployment Settings

The project is already configured for deployment:
- Deployment type: **Autoscale** (recommended for e-commerce)
- Build command: `npm run build`
- Run command: `npm run start`

These are set in `.replit` file and don't need changes.

### Step 3: Publish the Application

1. Click the "Publish" button in Replit (top right corner)
2. Or open "Publishing" tool from Tools menu
3. Replit will automatically:
   - Detect the deployment type (Autoscale)
   - Build your application
   - Deploy to production

4. Review the deployment settings:
   - Machine Type: Leave as default (recommended)
   - Environment: Production
   - Build: Automatic

5. Click "Publish" to deploy

### Step 4: Note Your Deployment URL

After publishing, you'll receive a URL like:
```
https://your-repl-name.replit.app
```

Copy this URL - you'll need it for:
- Stripe webhook configuration
- Discord OAuth redirect URI
- Sharing with customers

### Deployment Types Explained

**Autoscale (Recommended for AECOIN Store)**
- Automatically scales based on traffic
- Cost-effective (only pay for actual usage)
- Best for e-commerce with variable traffic
- Handles sudden traffic spikes

**Alternative: Reserved VM**
- Always running
- Fixed monthly cost
- Use if you need 24/7 uptime for other features
- Better for high, consistent traffic

---

## Post-Deployment Configuration

### 1. Update Stripe Webhook URL

1. Go to Stripe Dashboard → Webhooks
2. Update the endpoint URL with your deployment URL
3. Test the webhook (see [Stripe Integration Setup](#stripe-integration-setup))

### 2. Update Discord OAuth Redirect

1. Go to Discord Developer Portal
2. Update redirect URI with your deployment URL
3. Test Discord login

### 3. Create Admin Account

If you haven't already:

1. Login via Discord OAuth or create regular account
2. Access the database (via Neon Console or Replit Database tool)
3. Update a user to be admin:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';
```

4. Set admin password:
```sql
UPDATE users
SET password_hash = '$2b$10$...'  -- Use bcrypt to hash your password
WHERE email = 'your-admin-email@example.com';
```

Or use the existing admin account from development:
- Email: `admin@aeofficial.my`
- Password: (from your database backup)

### 4. Configure Custom Domain (Optional)

1. In Replit Publishing tool, go to "Domains"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update Stripe and Discord URIs with custom domain

---

## Verification & Testing

### Production Checklist

After deployment, verify:

#### Frontend
- [ ] Website loads correctly at deployment URL
- [ ] All images and assets load
- [ ] Navigation works properly
- [ ] Responsive design works on mobile

#### Authentication
- [ ] Discord login works
- [ ] Admin login works
- [ ] Session persists across pages
- [ ] Logout works correctly

#### E-commerce Flow
- [ ] Products display with correct prices
- [ ] Add to cart works
- [ ] Cart persists across pages
- [ ] Coupon codes apply correctly
- [ ] Checkout page loads

#### Stripe Payment
- [ ] Payment form displays
- [ ] Test payment succeeds (use test card: 4242 4242 4242 4242)
- [ ] Payment intent created in Stripe dashboard
- [ ] Webhook receives payment_intent.succeeded event
- [ ] Order created in database
- [ ] Redemption codes generated
- [ ] Email confirmation sent (if configured)

#### Admin Panel
- [ ] Admin can login
- [ ] Can view all orders
- [ ] Can manage packages
- [ ] Can manage coupons
- [ ] Can view redemption codes

#### Database
- [ ] Orders save correctly
- [ ] Redemption codes created
- [ ] FiveM database updated (if configured)
- [ ] User data persists

### Test Payment

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

**Important:** Switch to live mode keys for real payments.

---

## Troubleshooting

### Common Issues

#### 1. Deployment Fails to Start

**Symptoms:** Application shows error after publishing

**Solutions:**
- Check deployment logs in Replit Publishing tool
- Verify all required secrets are set
- Ensure `DATABASE_URL` is correct
- Check for build errors

#### 2. Database Connection Errors

**Symptoms:** "self-signed certificate" or "connection refused"

**Solutions:**
- Verify `DATABASE_URL` is correct
- Check Neon database is active (not suspended)
- Ensure connection string includes `?sslmode=require`
- The app already handles SSL certificate issues

#### 3. Stripe Webhooks Not Working

**Symptoms:** Payment succeeds but order not created

**Solutions:**
- Verify webhook URL is correct (use deployment URL)
- Check webhook secret is set correctly
- View webhook logs in Stripe Dashboard
- The app has a fallback that creates orders even without webhooks

#### 4. Discord Login Fails

**Symptoms:** OAuth redirect error

**Solutions:**
- Verify redirect URI matches exactly (including https://)
- Check Discord client ID and secret are correct
- Ensure scopes are configured correctly

#### 5. Orders Created but No Redemption Codes

**Symptoms:** Order shows in admin but codes missing

**Solutions:**
- Check server logs for errors
- Verify package has `codesPerPackage` set
- Check database constraints

#### 6. FiveM Integration Fails

**Symptoms:** Codes not appearing in FiveM database

**Solutions:**
- Check FiveM database credentials
- Verify FiveM database is accessible from internet
- Check table structure matches expected format
- Review server logs for connection errors

### Viewing Logs

To debug issues:

1. In Replit, open "Publishing" tool
2. Click on your deployment
3. View "Logs" tab
4. Filter by error level
5. Look for error messages and stack traces

### Getting Help

If you encounter issues:

1. Check this deployment guide
2. Review application logs
3. Check Stripe Dashboard for webhook logs
4. Verify all environment variables are set
5. Contact Replit support for platform issues

---

## Updating the Deployment

To update your deployed application:

1. Make changes in your development environment
2. Test thoroughly in development
3. Click "Publish" again
4. Replit will create a new deployment with your changes

**Note:** Redeploying creates a snapshot of your current code.

---

## Security Best Practices

1. **Never commit secrets** to code - always use Replit Secrets
2. **Use HTTPS** - Replit provides this automatically
3. **Validate webhooks** - Always verify Stripe webhook signatures
4. **Secure admin routes** - Admin authentication is required
5. **Database backups** - Regularly backup your Neon database
6. **Monitor logs** - Check for suspicious activity
7. **Update dependencies** - Keep packages up to date

---

## Cost Estimate

### Replit Autoscale Deployment

Costs based on usage:
- Compute Units (CPU/Memory usage)
- Requests served
- Data transfer

Expected costs for AECOIN Store:
- Small traffic (< 1000 orders/month): $5-15/month
- Medium traffic (1000-5000 orders/month): $15-40/month
- High traffic (> 5000 orders/month): $40+/month

### External Services

- **Stripe**: 2.9% + RM 0.50 per transaction (Malaysia pricing)
- **Neon Database**: Free tier available, paid plans from $19/month
- **Discord OAuth**: Free
- **FiveM Server**: Your existing hosting costs

---

## Maintenance & Monitoring

### Regular Tasks

**Weekly:**
- Check deployment logs for errors
- Monitor Stripe dashboard for failed payments
- Review order completion rate

**Monthly:**
- Database backup
- Review and update dependencies
- Check for security updates
- Monitor deployment costs

**As Needed:**
- Update package prices
- Create new coupon codes
- Manage user accounts
- Review redemption code usage

### Monitoring Tools

- Replit deployment logs
- Stripe Dashboard
- Neon Database metrics
- Application admin panel

---

## Support & Resources

### Documentation Links

- [Replit Deployments](https://docs.replit.com/hosting/deployments/about-deployments)
- [Stripe Documentation](https://stripe.com/docs)
- [Discord OAuth2](https://discord.com/developers/docs/topics/oauth2)
- [Neon Postgres](https://neon.tech/docs/introduction)

### Project Resources

- Source code: This Replit project
- Database schema: `shared/schema.ts`
- API routes: `server/routes.ts`
- Environment config: `.replit`

---

## Conclusion

Your AECOIN Store is now ready for production deployment! Follow this guide step-by-step to ensure a smooth deployment process.

**Remember:**
- Test thoroughly before going live
- Use production API keys (not test keys)
- Monitor your deployment after launch
- Keep secrets secure and never share them

Good luck with your deployment! 🚀
