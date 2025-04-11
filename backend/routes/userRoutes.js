const express = require("express");
const router = express.Router();
const { registerUser, getAllUsers,  updateUser } = require("../controllers/userController");


router.get("/", getAllUsers);
router.post("/register", registerUser);
router.put("/:id", updateUser); 
module.exports = router;
