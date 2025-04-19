const Job = require("../../model/job");
const Application = require("../../model/application"); // Make sure you have this model

const getJobApplicants = async (req, res, next) => {
  try {
    // Check if job exists and belongs to this employer
    const existingJob = await Job.findOne({
      _id: req.params.jobId,
      employer: req.user.id
    });

    if (!existingJob) {
      return next(
        `No job found with ID ${req.params.jobId}`, 404
      );
    }

    // Get all applications for this job with applicant details
    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'applicant',
        select: 'name email mobile resume' // Include relevant fields
      })
      .select('-job -__v'); // Exclude unnecessary fields

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getJobApplicants };