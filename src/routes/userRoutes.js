const express = require("express");
const router = express.Router();

const userController = require("../controllers/userControllers");

//User routes
router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/all-users", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
