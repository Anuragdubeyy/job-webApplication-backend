const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  requirements: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary'],
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    default: 'full-time',
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);