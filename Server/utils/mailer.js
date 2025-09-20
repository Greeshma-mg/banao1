import nodemailer from "nodemailer";

export const sendResetEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetUrl = `https://banao1-1.onrender.com/reset-password/${token}`;
await transporter.sendMail({
  from: '"Your App" <greeshmascotwin12@gmail.com>', 
  to: email,
  subject: "Password Reset Link",
  html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
});


    console.log(`Reset email sent to ${email}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
