const job = require("../../model/job");

const getJobApplicants = async (req, res) => {
    // Check if job exists and belongs to this employer
    const job = await Job.findOne({
      _id: req.params.jobId,
      employer: req.user.id
    });
  
    if (!job) {
      return next(
        new ErrorResponse(`No job found with ID ${req.params.jobId}`, 404)
      );
    }
  
    // Get all applications for this job with applicant details
    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'applicant',
        select: 'name email' // Only include name and email
      })
      .select('-job'); // Exclude job field from response
  
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  };

module.exports = getJobApplicants