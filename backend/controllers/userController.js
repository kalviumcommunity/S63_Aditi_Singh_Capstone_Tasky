const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const TeamMember = require("../models/TeamMember");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};  //get

exports.getManagerUsers = async (req, res) => {
  try {
    // Get the logged-in admin's user ID
    const adminId = req.user.id; // Use req.user.id as corrected earlier
    console.log('Fetching assignable users for adminId:', adminId); // Log admin ID

    // Find all team members associated with this admin
    const teamMembers = await TeamMember.find({ adminId });
    console.log('Found team members for admin:', teamMembers.length); // Log number of team members

    // Extract the user IDs of the team members
    const teamMemberUserIds = teamMembers.map(member => member.userId);

    // Find the users whose IDs are in the list of team member user IDs
    // Exclude the admin themselves and include users with 'user' or 'manager' roles
    const users = await User.find({
      _id: { $in: teamMemberUserIds, $ne: adminId },
      role: { $in: ['user', 'manager'] } // Include both 'user' and 'manager' roles
    }).select('name email');
    console.log('Found assignable users:', users.length); // Log number of assignable users

    res.json(users);
  } catch (error) {
    console.error('Error fetching assignable users:', error);
    res.status(500).json({ message: 'Error fetching assignable users' });
  }
};

exports.registerUser = async (req, res) => {
  console.log("Uploaded File:", req.file); // 👈 Add this line here

  const { name, email, password, role } = req.body;
  const profileImage = req.file ? req.file.path : null;

  try {
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      role,
      profileImage,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

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

  try {
    // Find user by email (include password for comparison)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000, // 1 hour
    });

    // Set user information on the session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };

    // Send user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error 500" });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found in the database" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile page" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };
    
    // Handle profile image upload functionality  
    if (req.file) {
      // Delete old profile image if it exists
      const user = await User.findById(userId);
      if (user.profileImage) {
        try {
          await fs.unlink(path.join(__dirname, '..', user.profileImage));
        } catch (error) {
          console.error('Error deleting old profile image:', error);
        }
      }

      // Update with new profile image path
      updates.profileImage = '/uploads/profiles/' + req.file.filename;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unfortunately User not found"
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error('Error updating the password:', error);
    res.status(500).json({
      success: false,
      message: "Error updating the password",
      error: error.message
    });
  }
};

exports.checkGoogleUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking user', error });
  }
};

exports.googleLoginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
    });
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };
    res.json({ message: 'Google login successful', user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Google login error', error });
  }
};


  