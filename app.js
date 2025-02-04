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

app.post("/send", (req, res) => {
  const emailBody = "<h1>Hello World</h1>";

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
