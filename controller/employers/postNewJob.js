const job = require("../../model/job");

const createJob = async (req, res) => {
    // Add employer to request body
    req.body.employer = req.user.id;
  
    const job = await job.create(req.body);
  
    res.status(201).json({
      success: true,
      data: job
    });
  };

  module.exports = createJob