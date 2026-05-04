const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");

// User routes
router.post("/add_property", propertyController.createProperty);
router.post("/update_property/:id", propertyController.updateProperty); // <-- New update route
router.get("/manager/:id", propertyController.getAllPropertyManagerId);
router.get("/available", propertyController.getAllAvailableProperties);
router.get("/:id", propertyController.getPropertyById);

module.exports = router;
