const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  fieldOfStudy: String,
  startYear: String,
  endYear: String
});

const ExperienceSchema = new mongoose.Schema({
  company_name: String,
  job_title: String,
  joining_date: String,
  end_date: String,
  currently_working: Boolean,
  description: String,
  city: String
});

const JobSeekerDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: String,
  email: String,
  skills: [String],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  resume: String,
  current_salary: String,
  expected_salary: String,
  notice_period: String,
  linkedIn_link: String,
  portfolio: String,
  appliedJobs: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    applicationDate: {
      type: Date,
      default: Date.now
    },
    status: String
  }]
});

const EmployerDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company_name: String,
  company_description: String,
  company_website: String,
  company_logo: String,
  postedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

const JobSeekerDetail = mongoose.model('JobSeekerDetail', JobSeekerDetailSchema);
const EmployerDetail = mongoose.model('EmployerDetail', EmployerDetailSchema);

module.exports = { JobSeekerDetail, EmployerDetail };