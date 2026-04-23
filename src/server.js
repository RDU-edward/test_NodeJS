require("dotenv").config();
const Stripe = require("stripe");

const fs = require("fs");

const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const candidateRoutes = require("./routes/candidateRoutes");
// const votersRoutes = require("./routes/votersRoutes");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all routes and origins
app.use(bodyParser.json());
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
// Serve files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body; // Amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Payment Intent creation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
