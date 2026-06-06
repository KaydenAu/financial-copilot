import dotenv from 'dotenv';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';

dotenv.config();

export const sendPasswordResetEmail = async (toEmail: string, token: string): Promise<void> => {
  // Configuration variables  
  const frontendUrl = process.env.FRONTEND_URL as string;
  const emailHost = process.env.SMTP_HOST as string;
  const emailPort = process.env.SMTP_PORT as string;
  const emailSecure = process.env.SMTP_SECURE as string;
  const emailUser = process.env.SMTP_USER as string;
  const emailPass = process.env.SMTP_PASSWORD as string;
  const emailFrom = process.env.SMTP_FROM as string;

  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;
  const templateLocation = 'integrations_google/google-password-reset.html'
  const templatePath = path.join(__dirname, templateLocation);

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort, 10),
    secure: emailSecure === 'true',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  let htmlContent='';  
  try {
    htmlContent = fs.readFileSync(templatePath, 'utf8');
    htmlContent = htmlContent.replace(/{{RESET_LINK}}/g, resetLink);
  } catch (fileError) {
    console.error('Failed to load HTML email template, falling back to clean text wrapper:', fileError);
    htmlContent = `<p>You requested a password reset. Please click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`;
  }

  const mailOptions = {
      from: `"Financial Copilot Support Team" <${emailFrom || 'noreply@yourdomain.com'}>`,
      to: toEmail,
      subject: 'Reset Your Password',
      text: `You requested a password reset. Please click the link to reset your password: ${resetLink}`,
      html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
