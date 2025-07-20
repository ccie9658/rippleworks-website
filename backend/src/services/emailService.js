const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.isProduction = process.env.EMAIL_SERVICE === 'elasticmail';
    this.transporter = null;
    
    if (this.isProduction) {
      this.setupElasticMailTransporter();
    }
  }

  setupElasticMailTransporter() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    console.log('📧 Email service initialized with ElasticMail SMTP');
  }

  async sendEmail({ to, subject, text, html }) {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html
    };

    if (this.isProduction) {
      try {
        const result = await this.transporter.sendMail(mailOptions);
        console.log(`📧 Email sent successfully to ${to}: ${subject}`);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        console.error('📧 Email send failed:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }
    } else {
      // Development mode - log to console
      console.log('\n📧 === EMAIL DEVELOPMENT MODE ===');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`From: ${mailOptions.from}`);
      console.log('--- Text Content ---');
      console.log(text);
      if (html) {
        console.log('--- HTML Content ---');
        console.log(html);
      }
      console.log('=== END EMAIL ===\n');
      
      return { success: true, messageId: 'dev-mode-' + Date.now() };
    }
  }

  // Email verification
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const subject = 'Welcome to RippleWorks - Please verify your email';
    
    const text = `
Welcome to RippleWorks, ${user.firstName}!

Thank you for creating your account. To complete your registration, please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
The RippleWorks Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2C144D; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .button { background: #FF6A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to RippleWorks!</h1>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>Thank you for creating your RippleWorks account. To complete your registration and start exploring our services, please verify your email address.</p>
      
      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </p>
      
      <p>This link will expire in 24 hours for security purposes.</p>
      
      <p>If you didn't create this account, please ignore this email.</p>
      
      <p>Welcome aboard!<br>
      The RippleWorks Team</p>
    </div>
    <div class="footer">
      <p>RippleWorks - Small Business Technology Modernization</p>
      <p>Creating ripples of positive change in your business technology.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return await this.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  }

  // Password reset
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const subject = 'Reset your RippleWorks password';
    
    const text = `
Hi ${user.firstName},

You recently requested to reset your password for your RippleWorks account. Click the link below to reset it:

${resetUrl}

This link will expire in 1 hour for security purposes.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
The RippleWorks Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2C144D; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .button { background: #FF6A00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hi ${user.firstName},</h2>
      <p>You recently requested to reset your password for your RippleWorks account.</p>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </p>
      
      <div class="warning">
        <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
      </div>
      
      <p>If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
      
      <p>Best regards,<br>
      The RippleWorks Team</p>
    </div>
    <div class="footer">
      <p>RippleWorks - Small Business Technology Modernization</p>
      <p>If you're having trouble with the button above, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return await this.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  }

  // Test email functionality
  async sendTestEmail(to) {
    const subject = 'RippleWorks Email Service Test';
    const text = 'This is a test email from the RippleWorks email service.';
    const html = '<p>This is a <strong>test email</strong> from the RippleWorks email service.</p>';

    return await this.sendEmail({ to, subject, text, html });
  }
}

// Export singleton instance
module.exports = new EmailService();