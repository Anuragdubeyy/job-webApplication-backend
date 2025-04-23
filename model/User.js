const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

// Base User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  mobile: {
    type: String,
    required: [true, "Please add a mobile number"],
    match: [/^[6-9]\d{9}$/, "Please add a valid mobile number"],
  },
  access_token: {
    type: String,
  },
  registrationToken: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["jobseeker", "employer"],
    default: "jobseeker",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { discriminatorKey: 'role' });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword.trim(), this.password);
};

// Create the base User model
const User = mongoose.model("User", userSchema);

// Employer Schema - includes company_name
const employerSchema = new Schema({
  company_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  team_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Team" 
  },
});

// Create a partial index for company_name
employerSchema.index({ company_name: 1 }, { unique: true, partialFilterExpression: { role: "employer" } });

// JobSeeker Schema - no company_name field
const jobSeekerSchema = new Schema({
  team_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Team" 
  },
});

// Create discriminators
const Employer = User.discriminator("employer", employerSchema);
const JobSeeker = User.discriminator("jobseeker", jobSeekerSchema);

module.exports = { User, Employer, JobSeeker };