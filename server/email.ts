import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

export async function sendOrderConfirmationEmail(
  toEmail: string,
  orderId: string,
  orderTotal: string,
  redemptionCodes: { code: string; packageName: string }[]
) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();

    const codesHtml = redemptionCodes.map(({ code, packageName }) => `
      <div style="background-color: #1a2942; border: 2px solid #FFD700; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
        <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">${packageName}</p>
        <code style="color: #FFD700; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${code}</code>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - AECOIN Store</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0f1e;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a2942 0%, #0d1d35 100%); border: 3px solid #FFD700; border-radius: 24px; padding: 40px; text-align: center;">
              <h1 style="color: #FFD700; font-size: 48px; margin: 0 0 16px 0; font-family: 'Bebas Neue', sans-serif; letter-spacing: 3px; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                AECOIN STORE
              </h1>
              <div style="width: 60px; height: 4px; background-color: #FFD700; margin: 0 auto 32px auto;"></div>
              
              <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 24px 0;">
                Order Confirmed!
              </h2>
              
              <div style="background-color: #0a0f1e; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">Order ID</p>
                <p style="color: #ffffff; margin: 0 0 16px 0; font-size: 16px;">#${orderId.slice(0, 8)}</p>
                
                <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 14px;">Total Paid</p>
                <p style="color: #FFD700; margin: 0; font-size: 32px; font-weight: bold;">RM${orderTotal}</p>
              </div>
              
              <h3 style="color: #FFD700; font-size: 24px; margin: 0 0 20px 0;">
                Your Redemption Codes
              </h3>
              
              <p style="color: #9ca3af; margin: 0 0 24px 0; font-size: 14px;">
                Use these codes in GTA 5 to redeem your AECOIN
              </p>
              
              ${codesHtml}
              
              <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255, 215, 0, 0.2);">
                <p style="color: #9ca3af; font-size: 14px; margin: 0 0 16px 0;">
                  Thank you for your purchase! If you have any questions, please contact our support team.
                </p>
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This is an automated email. Please do not reply to this message.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Order Confirmation #${orderId.slice(0, 8)} - AECOIN Store`,
      html: html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    console.log('Order confirmation email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}
