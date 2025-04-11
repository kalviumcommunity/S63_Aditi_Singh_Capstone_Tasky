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