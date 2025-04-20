const mongoose = require('mongoose');
const job = require('../../model/job');

const getSingleJobDetails = async (req, res) => {
  // Use the same parameter name as in your route
  const jobId = req.params.jobId; // Changed from req.params.id
  
  if (!jobId) {
    return res.status(400).json({
      success: false,
      error: 'No job ID provided',
      receivedParams: req.params
    });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid job ID format',
      receivedId: jobId
    });
  }

  try {
    const jobID = await job.findById(jobId)
      .populate('employer', 'name company profileImage');

    if (!jobID) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
        jobId: jobId
      });
    }

    res.status(200).json({
      success: true,
      data: jobID
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = { getSingleJobDetails };