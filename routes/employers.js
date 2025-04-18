const express = require('express');
const {
  getEmployerJobs,
  getJobApplicants,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes protected and only for employers
router.use(protect);
router.use(authorize('employer'));

router.route('/jobs')
  .get(getEmployerJobs)    // Get all jobs posted by employer
  .post(createJob);        // Create new job

router.route('/jobs/:jobId/applicants')
  .get(getJobApplicants);  // Get applicants for a specific job

router.route('/jobs/:id')
  .put(updateJob)          // Update job
  .delete(deleteJob);      // Delete job

module.exports = router;