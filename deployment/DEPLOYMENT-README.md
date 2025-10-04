# AECOIN Store Deployment Instructions

This repository contains all the necessary files and instructions to deploy the AECOIN Store to a production Ubuntu VPS.

## Deployment Files

1. **[ubuntu-deployment-guide.md](file://c:\Users\jihadullahhamid\Desktop\PixelPalladin\AEStoreReplit\ubuntu-deployment-guide.md)** - Comprehensive step-by-step deployment guide for Ubuntu VPS
2. **[deploy-to-ubuntu.bat](file://c:\Users\jihadullahhamid\Desktop\PixelPalladin\AEStoreReplit\deploy-to-ubuntu.bat)** - Windows batch script to upload files to your Ubuntu VPS
3. **[deploy-to-ubuntu.sh](file://c:\Users\jihadullahhamid\Desktop\PixelPalladin\AEStoreReplit\deploy-to-ubuntu.sh)** - Linux/Mac deployment script (for future use)

## Deployment Process

### Step 1: Prepare Your Ubuntu VPS

Ensure your Ubuntu VPS meets the following requirements:
- Ubuntu 20.04 or later
- SSH access with sudo privileges
- Public IP address
- Domain name (recommended)
- Firewall configured to allow SSH, HTTP, and HTTPS

### Step 2: Run the Deployment Script

On Windows, run the batch file:
```
deploy-to-ubuntu.bat <VPS_IP> <DOMAIN_NAME>
```

Example:
```
deploy-to-ubuntu.bat 192.168.1.100 store.yourdomain.com
```

This will:
1. Test SSH connectivity to your VPS
2. Upload all application files to `/tmp/aecoin-store` on your VPS

### Step 3: Complete Manual Configuration

After the script completes, you'll need to SSH into your VPS and complete the following steps:

1. **Update Environment Variables**
   ```bash
   sudo nano /var/www/aecoin/.env
   ```
   Replace all placeholder values with your actual credentials:
   - Database connection details
   - Stripe API keys
   - Discord OAuth credentials
   - FiveM database credentials
   - Other service keys

2. **Set Up SSL Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Configure Database (if needed)**
   Update the `DATABASE_URL` in the `.env` file if you're using a remote database.

4. **Restart the Application**
   ```bash
   sudo su - aecoin
   cd /var/www/aecoin
   pm2 restart aecoin-store
   ```

### Step 4: Test Your Deployment

Visit your domain in a web browser to verify the deployment was successful.

## Required Credentials

Before deployment, gather the following credentials:

1. **Stripe**
   - Secret Key (sk_live_...)
   - Publishable Key (pk_live_...)
   - Webhook Secret (whsec_...)

2. **Discord OAuth**
   - Client ID
   - Client Secret
   - Redirect URI: https://yourdomain.com/api/auth/discord/callback

3. **Database**
   - Connection URL for PostgreSQL database

4. **FiveM Integration** (optional)
   - Database host, port, name, user, password

5. **ToyyibPay** (optional, for Malaysian payments)
   - Secret Key

6. **Resend** (for email notifications)
   - API Key

## Post-Deployment Tasks

1. **Create Admin Account**
   After deployment, you may need to create an admin account in the database:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'your-admin-email@example.com';
   ```

2. **Set Up Monitoring**
   - Configure log rotation
   - Set up uptime monitoring
   - Configure alerts for critical errors

3. **Regular Maintenance**
   - Keep dependencies updated
   - Monitor application performance
   - Regular database backups

## Troubleshooting

If you encounter issues:

1. **Check Application Logs**
   ```bash
   sudo su - aecoin
   pm2 logs
   ```

2. **Check Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Verify Environment Variables**
   ```bash
   sudo cat /var/www/aecoin/.env
   ```

4. **Test Database Connection**
   ```bash
   psql $DATABASE_URL
   ```

## Security Recommendations

1. Use strong passwords and SSH keys
2. Keep system and application packages updated
3. Regular security audits
4. Implement proper firewall rules
5. Regular backups
6. Monitor logs for suspicious activity

## Support

For deployment issues, refer to:
- [ubuntu-deployment-guide.md](file://c:\Users\jihadullahhamid\Desktop\PixelPalladin\AEStoreReplit\ubuntu-deployment-guide.md) for detailed instructions
- Application logs for error messages
- Project documentation for configuration details

For application-specific issues, check:
- Server logs
- Database connectivity
- API key configurations