const express = require('express');


const router = express.Router();

const { getAllJobs } = require('../controller/job-seekers/getAllJobList');
const { applyForJob } = require('../controller/job-seekers/applyNewJob');
const { getMyApplications } = require('../controller/job-seekers/ApplyedJobList');
const { withdrawApplication } = require('../controller/job-seekers/withdrawJob');
const { updateProfile } = require('../controller/job-seekers/updateprofile');
const { protect, authorize } = require('../middelware/auth');

// All routes protected and only for job seekers
router.use(protect);
router.use(authorize('jobseeker'));

router.route('/jobs')
  .get(getAllJobs);

router.route('/jobs/apply/:jobId')
  .post(applyForJob);

router.route('/applications')
  .get(getMyApplications);

router.route('/applications/:applicationId')
  .delete(withdrawApplication);

router.route('/profile')
  .put(updateProfile);

module.exports = router;