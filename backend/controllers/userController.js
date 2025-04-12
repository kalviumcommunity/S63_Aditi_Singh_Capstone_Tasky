const User = require("../models/User");


exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};  //get

exports.registerUser = async (req, res) => {
    const { name, email, role } = req.body;
    const user = new User({ name, email, role });
    await user.save();
    res.status(201).json(user);
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