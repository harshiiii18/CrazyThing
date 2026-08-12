const nodemailer = require("nodemailer");

const hasEmailCreds = process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

const transporter = hasEmailCreds
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
    })
  : null;

// Sends real email when EMAIL_* env vars are configured. Otherwise logs to the
// console so auth/order flows are still testable in local development without
// SMTP credentials. Never silently pretend an email was delivered in prod.
exports.sendEmail = async ({ to, subject, text }) => {
  if (!transporter) {
    console.log(`[email:mock] to=${to} subject="${subject}" — ${text}`);
    return { mocked: true };
  }
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
