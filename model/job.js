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
  skillsRequired: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please add at least one required skill'
    }
  },
  responsibilities: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary'],
  },
  
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'temporary', 'volunteer'],
    default: 'full-time',
  },
  category: {
    type: String,
    required: true,
    enum: ['it', 'marketing','sales', 'finance', 'healthcare', 'education', 'engineer', 'design', 'customerService']
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    default: 'mid'
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  companyLogo: {
    type: String,
    default: 'default-company.jpg'
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(v) {
        return v > Date.now();
      },
      message: 'Deadline must be in the future'
    }
  },
  benefits: {
    type: [String],
    default: []
  },
  applicationProcess: {
    type: String,
    enum: ['quick-apply', 'external-link', 'email'],
    default: 'quick-apply'
  },
  applicationUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
JobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  justOne: false
});

// Update the updatedAt field before saving
JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', JobSchema);