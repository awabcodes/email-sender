const nodemailer = require("nodemailer");
const cors = require("cors");
const express = require("express");
const winston = require("winston");

require("dotenv").config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "email-sender.log" }),
  ],
});

const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_CLIENT_URL,
    preflightContinue: true,
  })
);

app.post("/email-sender/send", (req, res) => {
  logger.info("Email Request Received", { body: req.body });

  let emailBody = "<h2>Submission</h2>";

  Object.keys(req.body).forEach((key) => {
    emailBody += `<p><strong>${toTitleCase(key)}:</strong> ${
      req.body[key]
    }</p>`;
  });

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  let mail = {
    from: `"System" <${process.env.SMTP_FROM_EMAIL}>`,
    to: process.env.SMTP_TO_EMAIL,
    subject: process.env.EMAIL_SUBJECT,
    replyTo: req.body.email,
    html: emailBody,
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      logger.error("Email Send Error", { response: error });
      res.status(500).send({ result: "Failed" });
    }
    logger.info("Email Sent", { response: info });
    res.status(200).send({ result: "Success" });
  });
});

// Start Server
app.listen(3000, () => {
  logger.info("Server started on port 3000");
});

function toTitleCase(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}