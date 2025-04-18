const updateJob = async (req, res) => {
    let job = await Job.findById(req.params.id);
  
    if (!job) {
      return next(
        new ErrorResponse(`No job found with ID ${req.params.id}`, 404)
      );
    }
  
    // Make sure job belongs to this employer
    if (job.employer.toString() !== req.user.id) {
      return next(
        new ErrorResponse(`Not authorized to update this job`, 401)
      );
    }
  
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: job
    });
  };
  
  module.exports = updateJob;