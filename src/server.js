require("dotenv").config();
// const Stripe = require("stripe");

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
