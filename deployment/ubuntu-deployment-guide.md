# AECOIN Store - Ubuntu VPS Deployment Guide

This guide provides step-by-step instructions for deploying the AECOIN Store e-commerce website to a production Ubuntu VPS.

## Prerequisites

1. Ubuntu 20.04 or later VPS with SSH access
2. Domain name (optional but recommended)
3. SSL certificate (Let's Encrypt or similar)
4. All required API keys and credentials (Stripe, Discord, etc.)

## Step 1: Update System and Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install nginx (for reverse proxy)
sudo apt install -y nginx

# Install certbot for SSL certificates
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Create Application User

```bash
# Create a dedicated user for the application
sudo adduser --system --group --shell /bin/bash aecoin

# Create application directory
sudo mkdir -p /var/www/aecoin
sudo chown aecoin:aecoin /var/www/aecoin
```

## Step 3: Deploy Application Code

You can deploy the code in several ways:

### Option A: Git Clone (if repository is public)
```bash
# Switch to application user
sudo su - aecoin

# Clone repository (replace with your actual repository URL)
cd /var/www/aecoin
git clone <your-repository-url> .

# Exit back to root
exit
```

### Option B: Upload via SCP
```bash
# From your local machine, upload the project files
scp -r /path/to/local/project/* user@your-vps-ip:/var/www/aecoin/

# Set proper ownership
sudo chown -R aecoin:aecoin /var/www/aecoin
```

## Step 4: Install Application Dependencies

```bash
# Switch to application user
sudo su - aecoin

# Navigate to application directory
cd /var/www/aecoin

# Install Node.js dependencies
npm install

# Exit back to root
exit
```

## Step 5: Configure Environment Variables

Create a `.env` file with your production configuration:

```bash
# Create .env file
sudo nano /var/www/aecoin/.env
```

Add the following content (replace with your actual values):

```env
# Environment variables for AECOIN Store

# Session secret - required for express-session
SESSION_SECRET=your-very-secure-session-secret-here

# Node environment
NODE_ENV=production

# Port
PORT=3000

# Database URL for PostgreSQL (using NeonDB or your own PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Discord App
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/auth/discord/callback

# FiveM Database
FIVEM_DB_HOST=your_fivem_mysql_host
FIVEM_DB_PORT=3306
FIVEM_DB_NAME=your_fivem_database_name
FIVEM_DB_USER=your_fivem_db_user
FIVEM_DB_PASSWORD=your_fivem_db_password
FIVEM_DB_TABLE=ak4y_donatesystem_codes
FIVEM_DB_COLUMN_CODE=code
FIVEM_DB_COLUMN_CREDITSVALUE=credit

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# ToyyibPay
TOYYIBPAY_SECRET_KEY=your_toyyibpay_secret_key

# Resend (for email)
RESEND_API_KEY=your_resend_api_key
```

Set proper permissions for the .env file:

```bash
sudo chown aecoin:aecoin /var/www/aecoin/.env
sudo chmod 600 /var/www/aecoin/.env
```

## Step 6: Build the Application

```bash
# Switch to application user
sudo su - aecoin

# Navigate to application directory
cd /var/www/aecoin

# Build the application
npm run build

# Exit back to root
exit
```

## Step 7: Set Up Database

If you're using a local PostgreSQL database:

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE aecoin_store;"
sudo -u postgres psql -c "CREATE USER aecoin_user WITH ENCRYPTED PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aecoin_store TO aecoin_user;"

# Update DATABASE_URL in .env file
# DATABASE_URL=postgresql://aecoin_user:your_secure_password@localhost:5432/aecoin_store
```

Run database migrations:

```bash
# Switch to application user
sudo su - aecoin

# Navigate to application directory
cd /var/www/aecoin

# Run database migrations
npm run db:push

# Seed the database with initial data
npx tsx server/seed.ts

# Exit back to root
exit
```

## Step 8: Configure PM2 for Process Management

Create a PM2 ecosystem file:

```bash
sudo nano /var/www/aecoin/ecosystem.config.cjs
```

Add the following content:

```javascript
module.exports = {
  apps: [{
    name: 'aecoin-store',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/aecoin/error.log',
    out_file: '/var/log/aecoin/out.log',
    log_file: '/var/log/aecoin/combined.log',
    time: true
  }]
};
```

Set up PM2:

```bash
# Create log directory
sudo mkdir -p /var/log/aecoin
sudo chown aecoin:aecoin /var/log/aecoin

# Switch to application user
sudo su - aecoin

# Navigate to application directory
cd /var/www/aecoin

# Start application with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Exit back to root
exit

# Set PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u aecoin --hp /home/aecoin
```

## Step 9: Configure Nginx as Reverse Proxy

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/aecoin
```

Add the following content (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/aecoin /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 10: Set Up SSL Certificate (Optional but Recommended)

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Step 11: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable
```

## Step 12: Set Up Monitoring and Logging

```bash
# Create log rotation configuration
sudo nano /etc/logrotate.d/aecoin
```

Add the following content:

```conf
/var/log/aecoin/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 aecoin aecoin
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Step 13: Final Testing

1. Check if the application is running:
   ```bash
   sudo su - aecoin
   pm2 list
   pm2 logs
   exit
   ```

2. Test the application:
   ```bash
   curl -I http://localhost:3000
   ```

3. Visit your domain in a web browser

## Step 14: Set Up Automatic Backups (Optional)

Create a backup script:

```bash
sudo nano /usr/local/bin/backup-aecoin.sh
```

Add the following content:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/aecoin"
DB_NAME="aecoin_store"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/aecoin

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make it executable and set up a cron job:

```bash
sudo chmod +x /usr/local/bin/backup-aecoin.sh

# Add to crontab to run daily at 2 AM
echo "0 2 * * * /usr/local/bin/backup-aecoin.sh" | sudo crontab -
```

## Useful PM2 Commands

```bash
# Switch to application user
sudo su - aecoin

# Check application status
pm2 list

# View logs
pm2 logs

# Restart application
pm2 restart aecoin-store

# Stop application
pm2 stop aecoin-store

# Start application
pm2 start aecoin-store

# Monitor application
pm2 monit

# Exit back to root
exit
```

## Troubleshooting

### Common Issues

1. **Application not starting**:
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check database connection

2. **Nginx not serving content**:
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
   - Test configuration: `sudo nginx -t`
   - Restart Nginx: `sudo systemctl restart nginx`

3. **Database connection issues**:
   - Verify DATABASE_URL in .env file
   - Check PostgreSQL service: `sudo systemctl status postgresql`
   - Test database connection manually

4. **SSL certificate issues**:
   - Check certificate status: `sudo certbot certificates`
   - Renew manually: `sudo certbot renew`

## Updating the Application

To update your deployed application:

1. Upload new code to `/var/www/aecoin`
2. Install any new dependencies: `npm install`
3. Build the application: `npm run build`
4. Restart the application: `pm2 restart aecoin-store`

## Security Best Practices

1. Keep system and packages updated
2. Use strong passwords and SSH keys
3. Regular backups
4. Monitor logs for suspicious activity
5. Use SSL certificates
6. Regular security audits
7. Limit file permissions on sensitive files

## Conclusion

Your AECOIN Store is now deployed on your Ubuntu VPS! Make sure to:

1. Test all functionality thoroughly
2. Monitor the application logs
3. Set up monitoring and alerting
4. Regularly update dependencies
5. Maintain backups

For any issues, check the logs and refer to this guide for troubleshooting steps.