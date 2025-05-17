const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
// Public routes

router.post("/register", upload.single("profileImage"), userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post("/check-google", userController.checkGoogleUser);
router.post("/google-login", userController.googleLoginUser);

// Protected routes
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, upload.single("profileImage"), userController.updateProfile);
router.put("/profile/password", authenticate, userController.updatePassword);
router.get("/users", authenticate, authorizeRoles("admin"), userController.getAllUsers);
router.put("/users/:id", authenticate, authorizeRoles("admin"), userController.updateUser);

module.exports = router;


