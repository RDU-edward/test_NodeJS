const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

//Reservation routes

router.post("/create_reservation", reservationController.createReservation);
router.get("/:id", reservationController.getReservationById);
router.get("/manager/:id", reservationController.getReservationByManagerId);

module.exports = router;
