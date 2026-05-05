const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, getAllUsers } = require("../controllers/userControllers");
const { response } = require("express");
const sendEmail = require("../utils/mailer");

const User = {
  createUser: async (
    firstname,
    lastname,
    email,
    password,
    contact_number,
    address,
    role,
    files, // Expect an array of file paths
  ) => {
    try {
      // Convert files array to JSON string
      const filesData = files ? JSON.stringify(files) : null;

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert the new user
      const [result] = await db.execute(
        "CALL createUser(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          firstname,
          lastname,
          email,
          hashedPassword,
          contact_number,
          address,
          role,
          filesData,
        ],
      );

      // If insertion is successful
      if (result.affectedRows > 0 || result.insertId) {
        // Query all admin users
        const [admins] = await db.execute(
          "SELECT email, firstname FROM node_user WHERE role = 'admin'",
        );

        // Send notification email to each admin
        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: "New Manager Account Pending Approval",
            text: `Hello ${admin.firstname},
                    A new Manager account (${firstname} ${lastname}) has been registered and is pending your approval.

                    Please review and approve the account at: https://www.ihomes.com/admin

                    Thank you,
                    iHomes Team`,
            html: `<h2>New Manager Account Pending Approval</h2>
                    <p>Hello ${admin.firstname},</p>

                    <p>A new Manager account (<strong>${firstname} ${lastname}</strong>) has been registered and is <strong>pending your approval</strong>.</p>

                    <p>Please review and approve the account by clicking the link below:</p>

                    <p><a href="https://www.ihomes.com/admin">Approve Account</a></p>

                    <p>Thank you for your attention.</p>

                    <p>Best regards,<br>
                    <i>iHomes Team</i></p>`,
          });
        }

        return { success: true, message: "User created and admins notified" };
      } else {
        return { success: false, message: "Failed to create user" };
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, message: "Error creating user" };
    }
  },

  loginUser: async (email, password) => {
    try {
      // Fetch the user from DB
      const [rows] = await db.execute(
        "SELECT * FROM node_user  WHERE email = ?",
        [email],
      );

      if (rows.length === 0) {
        return { success: false, message: "User not found" };
      }

      console.log(password);

      const user = rows[0];
      console.log(user.password);

      console.log(user.status);

      // Compare passwords
      const match = await bcrypt.compare(password, user.password);

      if (user.status === "pending") {
        return {
          success: false,
          message: "Oops! Login failed. Account pending approval",
        };
      }

      if (!match) {
        return { success: false, message: "Invalid password" };
      }

      // Optionally, remove password from returned user object
      //   delete user.password;
      const { password: _, ...responseWithoutPassword } = user;

      return {
        success: true,
        message: "Login successful",
        user: responseWithoutPassword,
      };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Login failed" };
    }
  },

  findAllUsers: async () => {
    // const [rows] = await db.execute("CALL GetAllUsers()");
    try {
      const [rows] = await db.execute("Select * from node_user");
      return rows; // stored procedure returns array of arrays
    } catch (error) {
      console.log(error);
    }
  },

  update: async (id, status) => {
    const [result] = await db.execute("CALL UpdateUser(?, ?)", [id, status]);
    if (result.affectedRows == 1) {
      return { success: true, message: "User Updated Successfully" };
    } else {
      return { success: false, message: "Error in updating user" };
    }
  },

  delete: async (id) => {
    await db.execute("CALL DeleteUser(?)", [id]);
    return;
  },
};

module.exports = User;

// // Function to hash a password
// async function hashPassword(password) {
//   try {
//     const salt = await bcrypt.genSalt(10); // generates a salt
//     const hashedPassword = await bcrypt.hash(password, salt); // hashes the password with the salt
//     return hashedPassword;
//   } catch (error) {
//     console.error("Error hashing password: ", error);
//   }
// }

// // Function to compare password with hash
// async function comparePassword(plainPassword, hashedPassword) {
//   try {
//     const match = await bcrypt.compare(plainPassword, hashedPassword);
//     return match; // returns true if passwords match, false otherwise
//   } catch (error) {
//     console.error("Error comparing password: ", error);
//   }
// }

// // Example usage
// async function testHashing() {
//   const password = "admin54321";

//   // Hash the password
//   const hashed = await hashPassword(password);
//   console.log("Hashed password:", hashed);

//   // Compare correct password
//   const isMatch = await comparePassword("admin54321", hashed);
//   console.log("Do they match? (correct password):", isMatch);

//   //   // Compare incorrect password
//   //   const isMatchWrong = await comparePassword("wrongPassword", hashed);
//   //   console.log("Do they match? (wrong password):", isMatchWrong);
// }

// // Run the test
// testHashing();
