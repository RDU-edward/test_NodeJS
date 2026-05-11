const db = require("../config/db");
const sendEmail = require("../utils/mailer");
const Reservation = {
  createReservation: async (
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
  ) => {
    const [result] = await db.execute(
      "Call createReservation(?,?,?,?,?,?,?,?,?,?)",
      [
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
      ],
    );

    await sendEmail({
      to: manager_email,
      subject: "New Reservation Created",
      text: `Hello, Good day!

A new reservation has been created for your property.

Reservation Details:
- Full Name: ${fullname}
- Contact Number: ${contact_number}
- Email: ${email}
- Move-in Date: ${movein_date}
- Total Occupants: ${total_occupants}
- Amount Paid: ${amount_paid}

You can view the reservation details in your dashboard: http://localhost:3000/

Thank you,
iHomes Team`,
      html: `<p>Hello, Good day!</p>

<p>A new reservation has been created for your property.</p>

<h3>Reservation Details:</h3>
<ul>
  <li><strong>Full Name:</strong> ${fullname}</li>
  <li><strong>Contact Number:</strong> ${contact_number}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Move-in Date:</strong> ${movein_date}</li>
  <li><strong>Total Occupants:</strong> ${total_occupants}</li>
  <li><strong>Amount Paid:</strong> ${amount_paid}</li>
</ul>

<p>You can view the reservation details in your dashboard:</p>
<p><a href="http://localhost:3000" style="background-color:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">View Reservation</a></p>

<p>Thank you,<br/>iHomes Team</p>`,
    });

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
