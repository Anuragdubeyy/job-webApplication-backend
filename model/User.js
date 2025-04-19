const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

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
  company_name: {
    type: String,
    required: function () {
      return this.role === 'employer';
    },
    unique: true,
    sparse: true, // Ensure sparse indexing
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

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

const User = mongoose.model("User", userSchema);

const employer = User.discriminator(
  "Employer",
  new Schema({
    team_id: { type: Schema.Types.ObjectId, ref: "Team" }, // Single reference for Employee
  })
);

const JobSeeker = User.discriminator(
  "jobSeeker",
  new Schema({
    team_id: { type: Schema.Types.ObjectId, ref: "Team" }, // Single reference for Employee
  })
);

module.exports = { User, employer, JobSeeker };
