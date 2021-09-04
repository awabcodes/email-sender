const nodemailer = require("nodemailer");
const cors = require("cors");
const express = require("express");

const app = express();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

app.post("/send", (req, res) => {
  const emailBody = "<h1>Hello World</h1>";

  let transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: "user",
      pass: "pass",
    },
  });

  let mail = {
    from: '"name" <from@example.com>',
    to: "to@example.com",
    subject: "Subject",
    text: "Hello",
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
