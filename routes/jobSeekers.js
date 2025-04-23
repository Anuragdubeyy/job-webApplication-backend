const express = require("express");

const router = express.Router();

const { getAllJobs } = require("../controller/job-seekers/getAllJobList");
const { applyForJob } = require("../controller/job-seekers/applyNewJob");
const {
  withdrawApplication,
} = require("../controller/job-seekers/withdrawJob");
const { updateProfile } = require("../controller/job-seekers/updateprofile");
const {
  getMyApplications,
} = require("../controller/job-seekers/applyedJobList");
const { protect, authorize } = require("../middelware/auth");
const {
  getSingleJobDetails,
} = require("../controller/job-seekers/getSinglejobDetail");
const {
  applyForJobValidation,
} = require("../middelware/applyForJobMiddleware");
const { handleUploadError, upload } = require("../middelware/upload");

// All routes protected and only for job seekers
router.use(protect);
router.use(authorize("jobseeker"));

router.route("/jobs").get(getAllJobs);

router.route("/jobs/:jobId").get(getSingleJobDetails);

router.route("/jobs/apply/:jobId").post(upload, handleUploadError, applyForJob);

router.route("/applications").get(getMyApplications);

router.route("/applications/:applicationId").delete(withdrawApplication);

router.route("/update-profile").put(updateProfile);

module.exports = router;
