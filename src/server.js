require("dotenv").config();
const Stripe = require("stripe");

const fs = require("fs");

const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const candidateRoutes = require("./routes/candidateRoutes");
// const votersRoutes = require("./routes/votersRoutes");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const cors = require("cors");
const sendEmail = require("./utils/mailer");
const app = express();

app.use(cors()); // Enable CORS for all routes and origins
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/reservation", reservationRoutes);
// Serve files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Serve files from the "uploads" folder

// Endpoint to handle file operations (e.g., check if file exists and read it)
app.get("/read-file/:filename", (req, res) => {
  const filedata = req.params.filename; // Get the filename from the URL parameter
  const filePath = path.join(__dirname, "uploads", filedata);

  // Check if the file exists before trying to read it
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", err);
      return res.status(404).send("File not found.");
    }

    // Read the file if it exists
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Error reading file.");
      }

      // Send the file data as a response
      res.send(data);
    });
  });
});

// Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // in cents (e.g., 1000 = $10)
      currency: "php",

      // 👇 Store extra info
      metadata: {
        client_name: "Edward Doe",
        client_email: "testemail.com",
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Test function only runs if this file is executed directly

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// async function test() {
//   await sendEmail({
//     to: "jezmacoy1998@gmail.com",
//     subject: "New Manager Account Pending Approval",
//     text: `Hello Admin,

// A new Manager account has been registered and is pending your approval.

// Please review and approve the account at: https://www.ihomes.com/admin

// Thank you for your attention.

// Best regards,
// iHomes Team`,
//     html: `<h2>New Manager Account Pending For Approval</h2>
// <p>Hello Admin,</p>

// <p>A new Manager account has been registered and is <strong>pending for your approval</strong>.</p>

// <p>Please review and approve the account by clicking the link below:</p>

// <p><a href="https://www.ihomes.com/admin">Approve Account</a></p>

// <p>Thank you for your attention.</p>

// <p>Best regards,<br>
// <i>iHomes Team</i></p>`,
//   });
// }

// test();

// # DB_HOST=loacalhost
// # DB_USER=root
// # DB_PASS=root
// # DB_NAME=test

// # Node Mailer Credentials
// # EMAIL_USER = "edwardcatapan@gmail.com"
// # EMAIL_PASS = "scah xnqy fhcc retl",
// STRIPE_SECRET_KEY = sk_test_eqXnJVeXFUmkfE7b3FZkogGo00bG3wOC02;
