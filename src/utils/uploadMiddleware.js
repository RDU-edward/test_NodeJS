const multer = require("multer");
const path = require("path");

// Configure multer to store files in a specific directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/"); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    // Use original file name and add a timestamp to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create the multer upload instance for multiple file uploads
const upload = multer({ storage: storage });

module.exports = upload;
