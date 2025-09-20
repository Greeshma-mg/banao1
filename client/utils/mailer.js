import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendResetEmail = async (email, token) => {
  try {
    // Create transporter using SendGrid SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",                  // must be "apikey"
        pass: process.env.EMAIL_PASS,    // your SendGrid API Key
      },
    });

    const resetUrl = `https://banao1-1.onrender.com/reset-password/${token}`;

    // Send email
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`, // verified sender
      to: email,
      subject: "Password Reset Link",
      html: `<p>Hello,</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    console.log(`Reset email sent to ${email}: ${info.messageId}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
