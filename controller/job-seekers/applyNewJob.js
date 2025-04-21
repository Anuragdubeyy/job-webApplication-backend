const Job = require("../../model/job");
const Application = require("../../model/application");
const { JobSeekerDetail } = require("../../model/profileDetail");

const applyForJob = async (req, res, next) => {
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
        return next(`Please provide ${field}`, 400);
      }
    }

    // Check if skills array has at least one item
    if (!req.body.skills || req.body.skills.length === 0) {
      return next("Please add at least one skill", 400);
    }

    // Check if job exists
    const jobToApply = await Job.findById(req.params.jobId);
    if (!jobToApply) {
      return next(`No job found with ID ${req.params.jobId}`, 404);
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(200).json({
        success: false,
        message: "You have already applied for this job",
        // data: alreadyApplied,
      });
    }

    // application data
    const applicationData = {
      job: req.params.jobId,
      applicant: req.user.id,
      name: req.body.name,
      experience_year: req.body.experience_year,
      currently_working: req.body.currently_working,
      notice_period: req.body.notice_period,
      linkedIn_link: req.body.linkedIn_link,
      portfolio: req.body.portfolio,
      experience: req.body.experience || [],
      current_salary: req.body.current_salary,
      expected_salary: req.body.expected_salary,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter || "",
      skills: req.body.skills,
      status: "pending",
    };

    // Create application
    const application = await Application.create(applicationData);

    // Update job seeker profile with application details
    await JobSeekerDetail.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          name: req.body.name,
          skills: req.body.skills,
          experience: req.body.experience,
          resume: req.body.resume,
          current_salary: req.body.current_salary,
          expected_salary: req.body.expected_salary,
          notice_period: req.body.notice_period,
          linkedIn_link: req.body.linkedIn_link,
          portfolio: req.body.portfolio,
        },
        $addToSet: {
          appliedJobs: {
            jobId: req.params.jobId,
            status: "pending",
          },
        },
      },
      { upsert: true, new: true }
    );
    console.log(res.body);
    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { applyForJob };
