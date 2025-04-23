const Job = require("../../model/job");
const Application = require("../../model/application");
const { JobSeekerDetail } = require("../../model/profileDetail");

const isValidUrl = (url) => {
  const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,}(:\d+)?(\/\S*)?$/i;
  return urlPattern.test(url);
};

const applyForJob = async (req, res, next) => {
  try {
    const { experience, ...otherFields } = req.body;

    // Parse experience if it's a string
    let parsedExperience = [];
    if (typeof experience === 'string') {
      try {
        parsedExperience = JSON.parse(experience);
        if (!Array.isArray(parsedExperience)) {
          return next("Invalid format for experience. It must be an array.", 400);
        }
      } catch (err) {
        return next("Invalid JSON format for experience.", 400);
      }
    } else if (Array.isArray(experience)) {
      parsedExperience = experience;
    } else {
      return next("Experience field must be an array or a valid JSON string.", 400);
    }

    // Construct resume URL
    const resumeUrl = `https://job-web-application-backend.vercel.app/uploads/${req.file.filename}`;

    // Validate resume URL
    if (!isValidUrl(resumeUrl)) {
      return next("Invalid resume URL format.", 400);
    }

    const applicationData = {
      job: req.params.jobId,
      applicant: req.user.id,
      ...otherFields,
      experience: parsedExperience,
      resume: resumeUrl,
      status: "pending",
    };

    const application = await Application.create(applicationData);

    await Job.findByIdAndUpdate(
      req.params.jobId,
      { $inc: { applicationsCount: 1 } },
      { new: true }
    );

    await JobSeekerDetail.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          ...otherFields,
          experience: parsedExperience,
          resume: resumeUrl,
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

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    console.error("Error in applyForJob:", err);
    next(err);
  }
};


module.exports = { applyForJob };
