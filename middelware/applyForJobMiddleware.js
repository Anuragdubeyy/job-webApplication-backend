const applyForJobValidation = (req, res, next) => {
    try {
      // Validate required fields
      const requiredFields = [
        "name",
        "experience_year",
        "currently_working",
        "notice_period",
        "current_salary",
        "expected_salary",
        "resume",
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
  
      // Check if skills array has at least one item
      if (!req.body.skills || req.body.skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please add at least one skill",
        });
      }
  
      // Validation passed, proceed to the next middleware/handler
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error during validation",
      });
    }
  };
  
  module.exports = { applyForJobValidation };
  