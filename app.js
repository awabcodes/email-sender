const nodemailer = require("nodemailer");
const cors = require("cors");
const express = require("express");

const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.post("/email-sender/send", (req, res) => {
  let emailBody = "<h2>Submission</h2>";

  Object.keys(req.body).forEach((key) => {
    emailBody += `<p><strong>${toTitleCase(key)}:</strong> ${
      req.body[key]
    }</p>`;
  });

  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  let mail = {
    from: `"System" <${process.env.FROM_EMAIL}>`,
    to: process.env.TO_EMAIL,
    subject: process.env.EMAIL_SUBJECT,
    replyTo: req.body.email,
    html: emailBody,
  };

  transporter.sendMail(mail, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ result: "Failed" });
    }
    console.log("The message was sent!");
    console.log(info);
    res.status(200).send({ result: "Success" });
  });
});

// Start Server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

function toTitleCase(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}