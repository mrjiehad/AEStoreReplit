#!/bin/bash

# AECOIN Store Ubuntu Deployment Script
# This script automates the deployment process to an Ubuntu VPS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Check for required parameters
if [ $# -lt 2 ]; then
    echo "Usage: $0 <VPS_IP> <DOMAIN_NAME>"
    echo "Example: $0 192.168.1.100 yourdomain.com"
    exit 1
fi

VPS_IP=$1
DOMAIN_NAME=$2

print_status "Starting AECOIN Store deployment to Ubuntu VPS at $VPS_IP"

# Check SSH connection
print_status "Testing SSH connection to $VPS_IP..."
if ! ssh -o BatchMode=yes -o ConnectTimeout=10 ubuntu@$VPS_IP 'echo "SSH connection successful"'; then
    print_error "Cannot establish SSH connection to $VPS_IP. Please ensure:"
    echo "  1. The VPS is running and accessible"
    echo "  2. SSH is enabled and accessible from your IP"
    echo "  3. You have SSH key access or password authentication enabled"
    exit 1
fi

print_status "SSH connection successful"

# Upload application files
print_status "Uploading application files..."
scp -r . ubuntu@$VPS_IP:/tmp/aecoin-store

# Run deployment commands on remote server
print_status "Running deployment commands on remote server..."

ssh ubuntu@$VPS_IP << 'EOF'
    set -e
    
    # Update system
    echo "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    
    # Install dependencies
    echo "Installing required packages..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs postgresql-client nginx certbot python3-certbot-nginx
    
    # Install PM2
    echo "Installing PM2..."
    sudo npm install -g pm2
    
    # Create application user
    echo "Creating application user..."
    sudo adduser --system --group --shell /bin/bash aecoin
    sudo mkdir -p /var/www/aecoin
    sudo chown aecoin:aecoin /var/www/aecoin
    
    # Move application files
    echo "Moving application files..."
    sudo mv /tmp/aecoin-store/* /var/www/aecoin/
    sudo chown -R aecoin:aecoin /var/www/aecoin
    
    # Install application dependencies
    echo "Installing Node.js dependencies..."
    sudo su - aecoin -c "cd /var/www/aecoin && npm install"
    
    # Create .env file template
    echo "Creating .env file template..."
    sudo tee /var/www/aecoin/.env > /dev/null << 'ENV_END'
# Environment variables for AECOIN Store
# Please update these with your actual values

SESSION_SECRET=your-very-secure-session-secret-here
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/aecoin_store

# Discord App
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://yourdomain.com/api/auth/discord/callback

# FiveM Database
FIVEM_DB_HOST=localhost
FIVEM_DB_PORT=3306
FIVEM_DB_NAME=fivem_db
FIVEM_DB_USER=fivem_user
FIVEM_DB_PASSWORD=secure_password
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
ENV_END
    
    sudo chown aecoin:aecoin /var/www/aecoin/.env
    sudo chmod 600 /var/www/aecoin/.env
    
    # Build application
    echo "Building application..."
    sudo su - aecoin -c "cd /var/www/aecoin && npm run build"
    
    # Set up database
    echo "Setting up PostgreSQL database..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database and user (you'll need to update these credentials)
    sudo -u postgres psql -c "CREATE DATABASE aecoin_store;" || true
    sudo -u postgres psql -c "CREATE USER aecoin_user WITH ENCRYPTED PASSWORD 'secure_password';" || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE aecoin_store TO aecoin_user;" || true
    
    # Run database migrations
    echo "Running database migrations..."
    sudo su - aecoin -c "cd /var/www/aecoin && npm run db:push"
    
    # Seed database
    echo "Seeding database..."
    sudo su - aecoin -c "cd /var/www/aecoin && npx tsx server/seed.ts"
    
    # Create PM2 configuration
    echo "Creating PM2 configuration..."
    sudo tee /var/www/aecoin/ecosystem.config.cjs > /dev/null << 'PM2_END'
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
PM2_END
    
    # Set up PM2
    echo "Setting up PM2..."
    sudo mkdir -p /var/log/aecoin
    sudo chown aecoin:aecoin /var/log/aecoin
    sudo su - aecoin -c "cd /var/www/aecoin && pm2 start ecosystem.config.cjs"
    sudo su - aecoin -c "cd /var/www/aecoin && pm2 save"
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u aecoin --hp /home/aecoin
    
    # Configure Nginx
    echo "Configuring Nginx..."
    sudo tee /etc/nginx/sites-available/aecoin > /dev/null << 'NGINX_END'
server {
    listen 80;
    server_name YOUR_DOMAIN_NAME www.YOUR_DOMAIN_NAME;

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

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
NGINX_END
    
    # Replace domain name in Nginx config
    sudo sed -i "s/YOUR_DOMAIN_NAME/$DOMAIN_NAME/g" /etc/nginx/sites-available/aecoin
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/aecoin /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    
    echo "Deployment completed successfully!"
EOF

print_status "Deployment script executed. Please complete the following manual steps:"

echo "
${YELLOW}IMPORTANT MANUAL STEPS REQUIRED:${NC}

1. ${GREEN}Update Environment Variables:${NC}
   - SSH into your VPS: ssh ubuntu@$VPS_IP
   - Edit the .env file: sudo nano /var/www/aecoin/.env
   - Update all placeholder values with your actual credentials
   - Save and exit

2. ${GREEN}Set Up SSL Certificate:${NC}
   - Run: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME

3. ${GREEN}Configure Database (if using remote database):${NC}
   - Update DATABASE_URL in .env if using a remote database

4. ${GREEN}Restart Application:${NC}
   - SSH into your VPS
   - Switch to application user: sudo su - aecoin
   - Navigate to app directory: cd /var/www/aecoin
   - Restart with PM2: pm2 restart aecoin-store

5. ${GREEN}Test Your Deployment:${NC}
   - Visit http://$VPS_IP in your browser
   - Or visit https://$DOMAIN_NAME if SSL is configured

${YELLOW}Security Recommendations:${NC}
- Change default database passwords
- Set up firewall rules
- Regular backups
- Monitor application logs
"

print_status "Deployment process completed. Please follow the manual steps above to complete your setup."