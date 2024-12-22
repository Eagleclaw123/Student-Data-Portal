const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3001;

let sentOtp;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static("."));

// Endpoint to receive OTP request
app.post("/send-otp", (req, res) => {
  // Generate a random OTP (6-digit number)
  const otp = Math.floor(100000 + Math.random() * 900000);
  sentOtp = otp;

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "teambkmsr4@gmail.com",
      pass: "xuos zovu vvnf kkpu",
    },
  });

  const mailOptions = {
    from: "teambkmsr4@gmail.com",
    to: req.body.email,
    subject: "OTP for Login",
    text: `Your OTP is: ${otp}`,
  };

  // Send email with OTP
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send OTP");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("OTP sent successfully");
    }
  });
});

// for otp verification
app.post("/check-otp", (req, res) => {
  // check the otp
  let receivedOtp = Number(req.body.otp);

  if (receivedOtp === sentOtp) {
    console.log("successfully logged in!");
    // res.status(201).send("successfully logged in!");
    res.status(201).send("correct");
  } else {
    console.log("OTP is incorrect, please check and try again!");
    // res.status(401).send("OTP is incorrect, please check and try again!");
    res.status(401).send("incorrect");
  }
});

// Serve the HTML file
// preventing the static pages from loading with error
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.sendFile(__dirname + "/login-page.html");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
