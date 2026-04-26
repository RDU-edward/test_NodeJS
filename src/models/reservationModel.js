const db = require("../config/db");
const Reservation = {
  createReservation: async (
    property_id,
    manager_id,
    tenant_id,
    fullname,
    contact_number,
    email,
    movein_date,
    total_occupants,
    amount_paid,
  ) => {
    const [result] = await db.execute(
      "Call createReservation(?,?,?,?,?,?,?,?,?)",
      [
        property_id,
        manager_id,
        tenant_id,
        fullname,
        contact_number,
        email,
        movein_date,
        total_occupants,
        amount_paid,
      ],
    );
    return { success: true, message: "Reservation Inserted" };
  },

  getReservationById: async (id) => {
    const [rows] = await db.execute("Call getReservationById(?)", [id]);
    return rows[0];
  },
  getReservationMananagerById: async (id) => {
    const [rows] = await db.execute("Call getReservationByManagerId(?)", [id]);
    return rows[0];
  },
};
module.exports = Reservation;
