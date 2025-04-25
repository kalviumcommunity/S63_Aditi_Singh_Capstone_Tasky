const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  occupation: String, // 👈 Add this line
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: String,
});


module.exports = mongoose.model("User", userSchema);
