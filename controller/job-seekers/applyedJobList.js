const getMyApplications = async (req, res) => {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location salary type',
        populate: {
          path: 'employer',
          select: 'name company'
        }
      });
  
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  };

  module.exports = {getMyApplications};