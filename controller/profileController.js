const { JobSeekerDetail, EmployerDetail } = require("../model/profileDetail");
const { User } = require("../models/user");


const updateProfile = async (req, res, next) => {
  try {
    // Update basic user info
    const userUpdate = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile
    };

    const user = await User.findByIdAndUpdate(req.user.id, userUpdate, {
      new: true,
      runValidators: true
    });

    // Update role-specific details
    if (req.user.role === 'jobseeker') {
      const jobSeekerUpdate = {
        skills: req.body.skills,
        education: req.body.education,
        experience: req.body.experience,
        resume: req.body.resume,
        current_salary: req.body.current_salary,
        expected_salary: req.body.expected_salary,
        notice_period: req.body.notice_period,
        linkedIn_link: req.body.linkedIn_link,
        portfolio: req.body.portfolio
      };

      await JobSeekerDetail.findOneAndUpdate(
        { user: req.user.id },
        jobSeekerUpdate,
        { upsert: true, new: true, runValidators: true }
      );
    } else if (req.user.role === 'employer') {
      const employerUpdate = {
        company_name: req.body.company_name,
        company_description: req.body.company_description,
        company_website: req.body.company_website,
        company_logo: req.body.company_logo
      };

      await EmployerDetail.findOneAndUpdate(
        { user: req.user.id },
        employerUpdate,
        { upsert: true, new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile };