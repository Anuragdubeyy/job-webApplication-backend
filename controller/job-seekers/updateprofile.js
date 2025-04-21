const { JobSeekerDetail, EmployerDetail } = require("../../model/profileDetail");
const User = require('../../model/User');

const updateProfile = async (req, res, next) => {
  try {
    // Basic user information update
    const userUpdate = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile
    };

    // Update core user document
    const user = await User.findByIdAndUpdate(
      req.user.id,
      userUpdate,
      { 
        new: true,
        runValidators: true 
      }
    );

    // Role-specific profile updates
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

      // Update or create job seeker details
      const jobSeekerDetail = await JobSeekerDetail.findOneAndUpdate(
        { user: req.user.id },
        jobSeekerUpdate,
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        data: {
          user,
          profileDetails: jobSeekerDetail
        }
      });

    } else if (req.user.role === 'employer') {
      const employerUpdate = {
        company_name: req.body.company_name,
        company_description: req.body.company_description,
        company_website: req.body.company_website,
        company_logo: req.body.company_logo
      };

      // Update or create employer details
      const employerDetail = await EmployerDetail.findOneAndUpdate(
        { user: req.user.id },
        employerUpdate,
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        data: {
          user,
          profileDetails: employerDetail
        }
      });
    }

    // If role isn't jobseeker or employer
    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile };