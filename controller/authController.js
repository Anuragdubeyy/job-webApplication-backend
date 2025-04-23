const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Employer, JobSeeker } = require('../model/User');
require('dotenv').config();


// Register User
const registerUser = async (req, res) => {
  const { name, email, password, mobile, role, company_name, ...otherFields } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Common user data
    const userData = {
      name,
      email,
      password,
      mobile,
      role
    };

    let user;

    // Handle registration based on role
    if (role === 'employer') {
      // Validate employer specific fields
      if (!company_name) {
        return res.status(400).json({ message: 'Company name is required for employers' });
      }

      // Create employer
      user = await Employer.create({
        ...userData,
        company_name,
        ...otherFields
      });
    } else if (role === 'jobseeker') {
      // Validate jobseeker specific fields
      if (company_name) {
        return res.status(400).json({ message: 'Jobseekers cannot have a company name' });
      }

      // Create jobseeker
      user = await JobSeeker.create({
        ...userData,
        ...otherFields
      });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Save token to user
    user.access_token = token;
    await user.save();

    // Prepare response data
    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    };

    // Add role-specific data to response
    if (role === 'employer') {
      responseData.company_name = user.company_name;
    }

    res.status(201).json({
      message: 'Registration successful',
      user: responseData
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific errors
    if (err.code === 11000) {
      if (err.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (err.keyPattern.company_name) {
        return res.status(400).json({ message: 'Company name already exists' });
      }
    }
    
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