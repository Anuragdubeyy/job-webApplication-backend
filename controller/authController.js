const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../model/User');
require('dotenv').config();

// Register Admin
// const registerAdmin = async (req, res) => {
//   const { name, email, password, company_name, work, mobile } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       mobile,
//       company_name,
//       work,
//       role: 'employer',
//     });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '30d',
//     });

//     res.status(201).json({ token });
//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Register User
const registerUser = async (req, res) => {
  const { name, email, password, mobile, role, company_name } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const userData = {
      name,
      email,
      password,
      mobile,
      role: role || 'jobseeker',
    };

    // Add company_name only if role is employer
    if (role === 'employer') {
      userData.company_name = company_name;
    }

    const user = await User.create(userData);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    user.access_token = token;
    await user.save();
    res.status(201).json({ message: 'Registration successful', token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password'); // Find the user

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password.trim());  // Check password match

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    user.access_token = token;
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {  registerUser, loginUser };