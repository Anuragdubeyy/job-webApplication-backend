const Job = require("../../model/job");

const createJob = async (req, res, next) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can create jobs" });
    }

    req.body.employer = req.user.id;

    // Validate required fields
    const requiredFields = ["title", "description", "requirements", "location", "salary", "company"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Please provide a ${field}` });
      }
    }

    if (!Array.isArray(req.body.requirements)) {
      return res.status(400).json({ message: "Requirements must be an array" });
    }
    
    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (err) {
    console.error("Detailed error creating job:", {
      message: err.message,
      stack: err.stack,
      errors: err.errors
    });
    next(err);
  }
};

module.exports = { createJob };
