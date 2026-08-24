import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
      return true;
    }
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Nature's Mud"}" <${process.env.MAIL_FROM || 'admin@naturesmud.com'}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOTP = async (to: string, otp: string): Promise<boolean> => {
  const subject = "Your Verification Code - Nature's Mud";
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #2D5A27 0%, #1E3D1A 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Nature's Mud</h1>
        <p style="color: #A3E635; margin: 6px 0 0 0; font-size: 14px;">Pure. Organic. Handcrafted.</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin-top: 0;">Email Verification</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin-bottom: 24px;">Please use the following 6-digit verification code to verify your account or complete your action:</p>
        <div style="background-color: #F8F4EC; border: 2px dashed #2D5A27; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2D5A27; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin: 0;">⏱️ This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Nature's Mud Nepal. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to: string, otp: string, resetLink?: string): Promise<boolean> => {
  const subject = "Password Reset Request - Nature's Mud";
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #2D5A27 0%, #1E3D1A 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nature's Mud Security</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Reset Your Password</h2>
        <p style="color: #4b5563; font-size: 15px;">We received a request to reset your password. Use the verification code below:</p>
        <div style="background-color: #F8F4EC; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2D5A27;">${otp}</span>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This OTP will expire in 15 minutes. If you did not make this request, please change your password immediately.</p>
      </div>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendStaffWelcomeEmail = async (to: string, name: string, roleName: string, tempPass: string): Promise<boolean> => {
  const subject = "Welcome to Nature's Mud Staff Portal";
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: linear-gradient(135deg, #2D5A27 0%, #1E3D1A 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nature's Mud Admin Portal</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Welcome, ${name}!</h2>
        <p style="color: #4b5563; font-size: 15px;">You have been granted access to the Nature's Mud Administrative Portal with the role: <strong>${roleName}</strong>.</p>
        <div style="background-color: #f3f4f6; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${to}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${tempPass}</code></p>
        </div>
        <p style="color: #4b5563; font-size: 14px;">Please log in at the admin portal and change your password upon your first sign in.</p>
      </div>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendOrderConfirmation = async (to: string, orderId: string, totalAmount: number): Promise<boolean> => {
  const subject = `Order Confirmation - #${orderId}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
      <h2 style="color: #2D5A27;">Thank you for your order!</h2>
      <p style="color: #374151;">We've received your order <strong>#${orderId}</strong> for <strong>Rs. ${totalAmount.toLocaleString()}</strong>.</p>
      <p style="color: #4b5563;">We are currently preparing your package and will notify you as soon as it is dispatched.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};
