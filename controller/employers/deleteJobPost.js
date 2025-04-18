const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
  
    if (!job) {
      return next(
        new ErrorResponse(`No job found with ID ${req.params.id}`, 404)
      );
    }

    // Make sure job belongs to this employer
    if (job.employer.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to delete this job`, 401)
      );
    }
  
    // Delete all applications for this job first
    await Application.deleteMany({ job: req.params.id });
  
    await job.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  };

  module.exports = deleteJob