const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};  //get


exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = new User({ name, email, password, role });
  await user.save();

  res.status(201).json({ message: "User registered successfully" });
};  //post


  exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true }
      );
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  
    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });
  
    res.json({ message: "Login successful", role: user.role });
  };