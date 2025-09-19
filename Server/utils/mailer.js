import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,           
  auth: {
    user: "apikey",        
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER, 
    to,
    subject: "Password Reset Link",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
