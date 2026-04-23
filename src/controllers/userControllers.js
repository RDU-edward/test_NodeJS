const User = require("../models/userModel");
const upload = require("../utils/uploadMiddleware"); // Import the multer upload instance

// Create user controller
exports.createUser = [
  upload.array("files"), // Handle multiple file uploads from the 'files' field
  async (req, res) => {
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        contact_number,
        address,
        role,
      } = req.body;

      // Get the file paths from the uploaded files, if any
      const filePaths = req.files ? req.files.map((file) => file.path) : []; // Get all file paths

      //   const created_at = new Date().toISOString(); // Set the current timestamp

      // Call the User model to create the user
      const user = await User.createUser(
        firstname,
        lastname,
        email,
        password,
        contact_number,
        address,
        role,
        filePaths, // Passing an array of file paths to your model
      );

      // Respond with the created user data
      res.status(201).json(user);
    } catch (err) {
      console.log(err);

      res.status(500).json({ error: err.message });
    }
  },
];

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await User.loginUser(email, password);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.update(req.params.id, name, email);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
