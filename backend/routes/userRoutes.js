const express = require("express");
const router = express.Router();
const { registerUser, getAllUsers } = require("../controllers/userController");


router.get("/", getAllUsers);

module.exports = router;
