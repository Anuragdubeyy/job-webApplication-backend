const applyForJobValidation = (req, res, next) => {
  try {
    const requiredFields = [
      "name",
      "experience_year",
      "currently_working",
      "notice_period",
      "current_salary",
      "expected_salary",
      "skills",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Please provide ${field}`,
        });
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    if (!req.body.skills || req.body.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one skill",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during validation",
    });
  }
};

module.exports = { applyForJobValidation };
