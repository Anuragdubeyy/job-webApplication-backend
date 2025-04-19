const express = require("express");

const router = express.Router();

const { protect, authorize } = require("../middelware/auth");
const {
  getEmployerJobs,
} = require("../controller/employers/getAllJobPostedList");
const { createJob } = require("../controller/employers/postNewJob");
const {
  getJobApplicants,
} = require("../controller/employers/applyedJobSeekersList");
const { updateJob } = require("../controller/employers/updateJobPost");
const { deleteJob } = require("../controller/employers/deleteJobPost");

// All routes protected and only for employers
router.use(protect);
router.use(authorize("employer"));

router.route("/jobs/").get(getEmployerJobs);

router.route("/jobs/create").post(createJob);

router.route("/jobs/applicants/:jobId").get(getJobApplicants);
router
  .route("/jobs/:id")
  .put(updateJob) // Update job
  .delete(deleteJob); // Delete job

module.exports = router;
