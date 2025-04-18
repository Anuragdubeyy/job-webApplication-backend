const job = require("../../model/job");

const getEmployerJobs = async (req, res) => {
    // Only show jobs posted by the logged in employer
    const jobs = await job.find({ employer: req.user.id });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  };


module.exports = getEmployerJobs