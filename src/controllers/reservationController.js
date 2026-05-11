const Reservation = require("../models/reservationModel");

exports.createReservation = async (req, res) => {
  try {
    const {
      property_id,
      manager_id,
      manager_email,
      tenant_id,
      fullname,
      contact_number,
      email,
      movein_date,
      total_occupants,
      amount_paid,
    } = req.body;
    const reservation = await Reservation.createReservation(
      property_id,
      manager_id,
      manager_email,
      tenant_id,
      fullname,
      contact_number,
      email,
      movein_date,
      total_occupants,
      amount_paid,
    );
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getReservationById(req.params.id);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
exports.getReservationByManagerId = async (req, res) => {
  try {
    const reservation = await Reservation.getReservationMananagerById(
      req.params.id,
    );
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
