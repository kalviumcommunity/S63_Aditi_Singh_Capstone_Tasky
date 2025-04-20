const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// Protected routes
router.get("/users", authenticate, authorizeRoles("admin"), userController.getAllUsers);
router.put("/users/:id", authenticate, authorizeRoles("admin"), userController.updateUser);

// Example: Protected profile
router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
