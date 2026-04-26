const bcrypt = require("bcrypt");
const db = require("../config/db");
const { createUser, getAllUsers } = require("../controllers/userControllers");

const User = {
  createUser: async (
    firstname,
    lastname,
    email,
    password,
    contact_number,
    address,
    role,
    files, // Expect an array of file path
  ) => {
    // You can store the file paths as a JSON array or as a comma-separated string
    const filesData = files ? JSON.stringify(files) : null;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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
        filesData, // Store files as a JSON string (or adjust based on your database schema)
      ],
    );
    return { success: true, message: "Successfully inserted" };
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

  // findById: async (id) => {
  //   const [rows] = await db.execute("CALL GetUserById(?)", [id]);
  //   return rows[0][0]; // stored procedure returns array of arrays
  // },

  update: async (id, firstname, lastname) => {
    const [result] = await db.execute("CALL UpdateUser(?, ?, ?)", [
      id,
      firstname,
      lastname,
    ]);
    return { id, firstname, lastname };
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
