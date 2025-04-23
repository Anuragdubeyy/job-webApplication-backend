const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  fieldOfStudy: String,
  startYear: String,
  endYear: String
});

const ExperienceSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
    index: true
  },
  job_title: {
    type: String,
    required: true
  },
  joining_date: {
    type: String,
    required: true
  },
  end_date: {
    type: String
  },
  currently_working: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  experience_year: {
    type: Number,
    required: true
  },
  currently_working: {
    type: Boolean,
    required: true
  },
  notice_period: {
    type: String,
    required: true
  },
  linkedIn_link: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/.+$/.test(v);
      },
      message: props => `${props.value} is not a valid LinkedIn URL!`
    }
  },
  portfolio: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  current_salary: {
    type: String,
    required: true
  },
  expected_salary: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  coverLetter: {
    type: String
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please add at least one skill'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'rejected', 'accepted'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent user from applying twice for the same job
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);